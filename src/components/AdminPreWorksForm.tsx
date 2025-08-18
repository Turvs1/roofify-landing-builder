import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

// ---------- Config (easy to tweak without redeploy) ----------
const CONFIG = {
  sheetApiUrl:
    'https://script.google.com/macros/s/AKfycbxAeT0tXnBGwhw7NaoAvgdhUHz412L4ESPi62gtx0SUruZnEdUOn6nUi6APrOWxlrlekg/exec',
  webhookUrl: 'https://n8n.wayvvault.cc/webhook/Pre-works',
  siteAccessOptions: [
    'Clear driveway',
    'Street parking only',
    'Height restriction',
    'Overhead power nearby',
    'Restricted access hours',
    'Other',
  ],
  propertyTypes: ['House', 'Unit', 'Townhouse', 'Other'] as const,
  conditionOptions: ['Good', 'Fair', 'Poor'] as const,
  yesNo: ['Yes', 'No'] as const,
  roofForms: ['Gable', 'Hip', 'Valley', 'Skillion'] as const,
  lysaghtProfiles: [
    'CUSTOM ORB',
    'TRIMDEK',
    'KLIP-LOK 700',
    'SPANDEK',
    'CUSTOM BLUE ORB',
  ],
  bmtOptions: ['0.42', '0.48'] as const,
  membranes: ['None', 'Sisalation 430', 'Anticon 60mm', 'Other'] as const,
  colourbondColours: [
    'Surfmist', 'Shale Grey', 'Windspray', 'Basalt', 'Monument', 'Woodland Grey', 'Dune', 'Evening Haze', 'Jasper', 'Pale Eucalypt'
  ],
  colourbondColoursWithSwatches: [
    { value: 'Surfmist', label: 'Surfmist', swatch: '/color-swatches/Surfmist.svg' },
    { value: 'Shale Grey', label: 'Shale Grey', swatch: '/color-swatches/Shale Grey.svg' },
    { value: 'Windspray', label: 'Windspray', swatch: '/color-swatches/Windspray.svg' },
    { value: 'Basalt', label: 'Basalt', swatch: '/color-swatches/Basalt.svg' },
    { value: 'Monument', label: 'Monument', swatch: '/color-swatches/Monument.svg' },
    { value: 'Woodland Grey', label: 'Woodland Grey', swatch: '/color-swatches/Woodland Grey.svg' },
    { value: 'Dune', label: 'Dune', swatch: '/color-swatches/Dune.svg' },
    { value: 'Evening Haze', label: 'Evening Haze', swatch: '/color-swatches/Evening Haze.svg' },
    { value: 'Jasper', label: 'Jasper', swatch: '/color-swatches/Jasper.svg' },
    { value: 'Pale Eucalypt', label: 'Pale Eucalypt', swatch: '/color-swatches/Pale Eucalypt.svg' }
  ],
  framingCondition: ['Good', 'Fair', 'Poor', 'Rusted', 'Loose'] as const,
  battenSpacingOptions: [
    '500 centres',
    '600 centres',
    '700 centres',
    '800 centres',
    '900 centres',
    '1000 centres',
    '1100 centres',
    '1200 centres'
  ] as const,
  propertyAges: ['1-5', '5-10', '10-20', '20-30', '30-40', '40-50', '50+'] as const,
  propertyConditions: ['Good', 'Fair', 'Poor'] as const,
  constructionTypes: ['Traditional', 'Modern', 'Custom'] as const,
}

// ---------- Types ----------
interface Job {
  description: string
  number: string
  clientName: string
  worksLocationSuburb: string
  worksLocationState: string
  worksLocationPostcode: string
  buildingType: string
  jobId: string
}

interface RoofArea {
  name: string
  type?: string
  profile?: string
  gauge?: string
  membrane?: string
  pitchDeg?: number | null
  pitchRatio?: string
  area?: number | null
  notes?: string
}

interface FormData {
  // Job selection
  selectedJob: Job | null
  jobId: string
  
  // Site access & property details
  siteAccess: string[]
  propertyType: string
  propertyAge: string
  propertyCondition: string
  constructionType: string
  
  // Roof details
  roofForm: string
  roofPitch: string
  roofCondition: string
  roofAge: string
  
  // Materials & specifications
  lysaghtProfile: string
  bmtGauge: string
  membrane: string
  colourbondColour: string
  
  // Framing & structure
  framingCondition: string
  battenSpacing: string
  trussSpacing: string
  
  // Assets & areas
  assets: RoofArea[]
  
  // Final uploads & notes
  finalPlan: File[]
  finalTakeoff: File[]
  notes: string
  reporterName: string
}

const AdminPreWorksForm = () => {
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    selectedJob: null,
    jobId: '',
    siteAccess: [],
    propertyType: '',
    propertyAge: '',
    propertyCondition: '',
    constructionType: '',
    roofForm: '',
    roofPitch: '',
    roofCondition: '',
    roofAge: '',
    lysaghtProfile: '',
    bmtGauge: '',
    membrane: '',
    colourbondColour: '',
    framingCondition: '',
    battenSpacing: '',
    trussSpacing: '',
    assets: [],
    finalPlan: [],
    finalTakeoff: [],
    notes: '',
    reporterName: ''
  })

  // Load jobs from Google Sheets
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch(CONFIG.sheetApiUrl)
        if (!res.ok) throw new Error('Failed to load jobs')
        const data: Job[] = await res.json()
        setJobs(data)
      } catch (err: any) {
        toast({ 
          title: 'Error', 
          description: err.message ?? 'Failed to load jobs', 
          variant: 'destructive' 
        })
      } finally {
        setIsLoadingJobs(false)
      }
    }
    loadJobs()
  }, [toast])

  // Timestamp
  const now = new Date()
  const attendanceDate = now.toISOString().split('T')[0]

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleJobChange = (jobId: string) => {
    const job = jobs.find(j => j.jobId === jobId)
    setFormData(prev => ({ ...prev, selectedJob: job || null, jobId }))
  }

  const addRoofArea = () => {
    const newArea: RoofArea = {
      name: `Area ${formData.assets.length + 1}`,
      type: '',
      profile: '',
      gauge: '',
      membrane: '',
      pitchDeg: null,
      pitchRatio: '',
      area: null,
      notes: ''
    }
    setFormData(prev => ({ ...prev, assets: [...prev.assets, newArea] }))
  }

  const updateRoofArea = (index: number, field: keyof RoofArea, value: any) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((area, i) => 
        i === index ? { ...area, [field]: value } : area
      )
    }))
  }

  const removeRoofArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.selectedJob) {
      toast({ title: 'Error', description: 'Please select a job', variant: 'destructive' })
      return
    }
    
    if (!formData.notes.trim()) {
      toast({ title: 'Error', description: 'Please add notes', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    
    try {
      const submitData = new FormData()
      
      // Job details
      submitData.append('jobId', formData.jobId)
      submitData.append('jobDescription', formData.selectedJob.description)
      submitData.append('jobNumber', formData.selectedJob.number)
      submitData.append('clientName', formData.selectedJob.clientName)
      submitData.append('locationAddress', `${formData.selectedJob.worksLocationSuburb}, ${formData.selectedJob.worksLocationState} ${formData.selectedJob.worksLocationPostcode}`)
      
      // Form data
      submitData.append('siteAccess', formData.siteAccess.join(', '))
      submitData.append('propertyType', formData.propertyType)
      submitData.append('propertyAge', formData.propertyAge)
      submitData.append('propertyCondition', formData.propertyCondition)
      submitData.append('constructionType', formData.constructionType)
      submitData.append('roofForm', formData.roofForm)
      submitData.append('roofPitch', formData.roofPitch)
      submitData.append('roofCondition', formData.roofCondition)
      submitData.append('roofAge', formData.roofAge)
      submitData.append('lysaghtProfile', formData.lysaghtProfile)
      submitData.append('bmtGauge', formData.bmtGauge)
      submitData.append('membrane', formData.membrane)
      submitData.append('colourbondColour', formData.colourbondColour)
      submitData.append('framingCondition', formData.framingCondition)
      submitData.append('battenSpacing', formData.battenSpacing)
      submitData.append('trussSpacing', formData.trussSpacing)
      submitData.append('notes', formData.notes)
      submitData.append('reporterName', formData.reporterName)
      submitData.append('dateSubmitted', attendanceDate)
      
      // Assets
      submitData.append('assets', JSON.stringify(formData.assets))
      
      // Files
      if (formData.finalPlan.length > 0) {
        submitData.append('finalPlan', formData.finalPlan[0])
      }
      if (formData.finalTakeoff.length > 0) {
        submitData.append('finalTakeoff', formData.finalTakeoff[0])
      }

      const res = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        body: submitData
      })

      if (res.ok) {
        toast({ title: 'Success', description: 'Pre-works form submitted successfully!' })
        // Reset form
        setFormData({
          selectedJob: null,
          jobId: '',
          siteAccess: [],
          propertyType: '',
          propertyAge: '',
          propertyCondition: '',
          constructionType: '',
          roofForm: '',
          roofPitch: '',
          roofCondition: '',
          roofAge: '',
          lysaghtProfile: '',
          bmtGauge: '',
          membrane: '',
          colourbondColour: '',
          framingCondition: '',
          battenSpacing: '',
          trussSpacing: '',
          assets: [],
          finalPlan: [],
          finalTakeoff: [],
          notes: '',
          reporterName: ''
        })
      } else {
        throw new Error(`Submission failed: ${res.status}`)
      }
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.message ?? 'Failed to submit form', 
        variant: 'destructive' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Pre-Works Assessment Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Selection */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium">Job Selection</h2>
                <div>
                  <Label>Select Job</Label>
                  <Select value={formData.jobId} onValueChange={handleJobChange} disabled={isLoadingJobs}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingJobs ? 'Loading jobs...' : 'Select a job'} />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.jobId} value={job.jobId}>
                          {job.description} — {job.worksLocationSuburb}, {job.worksLocationState} (Job {job.number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.selectedJob && (
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <Label>Job Number</Label>
                      <Input value={formData.selectedJob.number} readOnly className="bg-background" />
                    </div>
                    <div>
                      <Label>Client Name</Label>
                      <Input value={formData.selectedJob.clientName} readOnly className="bg-background" />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={`${formData.selectedJob.worksLocationSuburb}, ${formData.selectedJob.worksLocationState} ${formData.selectedJob.worksLocationPostcode}`} readOnly className="bg-background" />
                    </div>
                    <div>
                      <Label>Building Type</Label>
                      <Input value={formData.selectedJob.buildingType} readOnly className="bg-background" />
                    </div>
                  </div>
                )}
              </section>

              <Separator />

              {/* Site Access & Property Details */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium">Site Access & Property Details</h2>
                
                <div>
                  <Label>Site Access Requirements</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {CONFIG.siteAccessOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.siteAccess.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, siteAccess: [...prev.siteAccess, option] }))
                            } else {
                              setFormData(prev => ({ ...prev, siteAccess: prev.siteAccess.filter(item => item !== option) }))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Property Type</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Property Age</Label>
                    <Select value={formData.propertyAge} onValueChange={(value) => handleInputChange('propertyAge', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.propertyAges.map((age) => (
                          <SelectItem key={age} value={age}>{age} years</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Property Condition</Label>
                    <Select value={formData.propertyCondition} onValueChange={(value) => handleInputChange('propertyCondition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.propertyConditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Construction Type</Label>
                    <Select value={formData.constructionType} onValueChange={(value) => handleInputChange('constructionType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select construction type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.constructionTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Roof Details */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium">Roof Details</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Roof Form</Label>
                    <Select value={formData.roofForm} onValueChange={(value) => handleInputChange('roofForm', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select roof form" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.roofForms.map((form) => (
                          <SelectItem key={form} value={form}>{form}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Roof Pitch</Label>
                    <Input 
                      value={formData.roofPitch} 
                      onChange={(e) => handleInputChange('roofPitch', e.target.value)} 
                      placeholder="e.g., 22.5° or 4:1"
                    />
                  </div>
                  <div>
                    <Label>Roof Condition</Label>
                    <Select value={formData.roofCondition} onValueChange={(value) => handleInputChange('roofCondition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.conditionOptions.map((condition) => (
                          <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Roof Age</Label>
                    <Input 
                      value={formData.roofAge} 
                      onChange={(e) => handleInputChange('roofAge', e.target.value)} 
                      placeholder="e.g., 15 years"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Materials & Specifications */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium">Materials & Specifications</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Lysaght Profile</Label>
                    <Select value={formData.lysaghtProfile} onValueChange={(value) => handleInputChange('lysaghtProfile', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.lysaghtProfiles.map((profile) => (
                          <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>BMT Gauge</Label>
                    <Select value={formData.bmtGauge} onValueChange={(value) => handleInputChange('bmtGauge', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gauge" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.bmtOptions.map((gauge) => (
                          <SelectItem key={gauge} value={gauge}>{gauge}mm</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Membrane</Label>
                    <Select value={formData.membrane} onValueChange={(value) => handleInputChange('membrane', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select membrane" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.membranes.map((membrane) => (
                          <SelectItem key={membrane} value={membrane}>{membrane}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Colourbond Colour</Label>
                    <Select value={formData.colourbondColour} onValueChange={(value) => handleInputChange('colourbondColour', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select colour" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.colourbondColours.map((colour) => (
                          <SelectItem key={colour} value={colour}>{colour}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Framing & Structure */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium">Framing & Structure</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Framing Condition</Label>
                    <Select value={formData.framingCondition} onValueChange={(value) => handleInputChange('framingCondition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.framingCondition.map((condition) => (
                          <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Batten Spacing</Label>
                    <Select value={formData.battenSpacing} onValueChange={(value) => handleInputChange('battenSpacing', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select spacing" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIG.battenSpacingOptions.map((spacing) => (
                          <SelectItem key={spacing} value={spacing}>{spacing}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Truss Spacing</Label>
                    <Input 
                      value={formData.trussSpacing} 
                      onChange={(e) => handleInputChange('trussSpacing', e.target.value)} 
                      placeholder="e.g., 600mm centres"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Roof Areas */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Roof Areas</h2>
                  <Button type="button" onClick={addRoofArea} variant="outline">
                    Add Area
                  </Button>
                </div>
                
                {formData.assets.map((area, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{area.name}</CardTitle>
                        <Button 
                          type="button" 
                          onClick={() => removeRoofArea(index)} 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Area Type</Label>
                          <Input 
                            value={area.type || ''} 
                            onChange={(e) => updateRoofArea(index, 'type', e.target.value)} 
                            placeholder="e.g., Main roof, Garage, Verandah"
                          />
                        </div>
                        <div>
                          <Label>Profile</Label>
                          <Input 
                            value={area.profile || ''} 
                            onChange={(e) => updateRoofArea(index, 'profile', e.target.value)} 
                            placeholder="e.g., Custom Orb, Trimdek"
                          />
                        </div>
                        <div>
                          <Label>Gauge</Label>
                          <Input 
                            value={area.gauge || ''} 
                            onChange={(e) => updateRoofArea(index, 'gauge', e.target.value)} 
                            placeholder="e.g., 0.42mm"
                          />
                        </div>
                        <div>
                          <Label>Membrane</Label>
                          <Input 
                            value={area.membrane || ''} 
                            onChange={(e) => updateRoofArea(index, 'membrane', e.target.value)} 
                            placeholder="e.g., Sisalation 430"
                          />
                        </div>
                        <div>
                          <Label>Pitch (degrees)</Label>
                          <Input 
                            type="number"
                            value={area.pitchDeg || ''} 
                            onChange={(e) => updateRoofArea(index, 'pitchDeg', e.target.value ? Number(e.target.value) : null)} 
                            placeholder="e.g., 22.5"
                          />
                        </div>
                        <div>
                          <Label>Pitch (ratio)</Label>
                          <Input 
                            value={area.pitchRatio || ''} 
                            onChange={(e) => updateRoofArea(index, 'pitchRatio', e.target.value)} 
                            placeholder="e.g., 4:1"
                          />
                        </div>
                        <div>
                          <Label>Area (m²)</Label>
                          <Input 
                            type="number"
                            value={area.area || ''} 
                            onChange={(e) => updateRoofArea(index, 'area', e.target.value ? Number(e.target.value) : null)} 
                            placeholder="e.g., 45.2"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Textarea 
                          value={area.notes || ''} 
                          onChange={(e) => updateRoofArea(index, 'notes', e.target.value)} 
                          placeholder="Additional notes for this area..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>

              <Separator />

              {/* Final Uploads & Notes */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium">Final Uploads & Notes</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Plan (PDF/JPG/PNG/DOCX)</Label>
                    <Input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleInputChange('finalPlan', Array.from(e.target.files || []))}
                    />
                    {formData.finalPlan && formData.finalPlan.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">✓ {formData.finalPlan[0].name} selected</p>
                    )}
                  </div>
                  <div>
                    <Label>Takeoff (PDF/JPG/PNG/DOCX)</Label>
                    <Input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleInputChange('finalTakeoff', Array.from(e.target.files || []))}
                    />
                    {formData.finalTakeoff && formData.finalTakeoff.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">✓ {formData.finalTakeoff[0].name} selected</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>General Notes</Label>
                  <Textarea 
                    rows={5} 
                    value={formData.notes} 
                    onChange={(e) => handleInputChange('notes', e.target.value)} 
                    placeholder="Add comprehensive notes about the pre-works assessment..."
                  />
                  {!formData.notes && (
                    <p className="text-sm text-red-600 mt-1">Please add notes</p>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Your Name</Label>
                    <Input 
                      value={formData.reporterName || ''} 
                      onChange={(e) => handleInputChange('reporterName', e.target.value)} 
                      placeholder="Enter your name" 
                    />
                  </div>
                  <div>
                    <Label>Date Submitted</Label>
                    <Input readOnly className="bg-muted" value={attendanceDate} />
                  </div>
                </div>
              </section>

              <Separator />

              <div className="flex items-center gap-3">
                <Button 
                  type="submit" 
                  disabled={isLoadingJobs || isSubmitting} 
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Form'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPreWorksForm
