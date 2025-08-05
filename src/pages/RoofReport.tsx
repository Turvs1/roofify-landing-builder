import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Job {
  description: string;
  number: string;
  clientName: string;
  street:     string;
  suburb:     string;
  state:      string;
  postcode:   string;
}

const RoofReport = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Existing
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);

  // New fields
  const [weather, setWeather] = useState('');
  const [lightConditions, setLightConditions] = useState('');
  // Composed address for weather lookup
  const [locationAddress, setLocationAddress] = useState('');
  const [isPowerIsolated, setIsPowerIsolated] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [ageOfProperty, setAgeOfProperty] = useState<number | ''>('');
  const [propertyCondition, setPropertyCondition] = useState('');
  const [constructionType, setConstructionType] = useState('');
  const [roofType, setRoofType] = useState('');
  const [roofCondition, setRoofCondition] = useState('');
  const [roofAge, setRoofAge] = useState<number | ''>('');
  const [roofPitch, setRoofPitch] = useState('');
  const [ceilingInspection, setCeilingInspection] = useState('');
  const [trussSpacing, setTrussSpacing] = useState('');
  const [battensType, setBattensType] = useState('');
  const [membraneType, setMembraneType] = useState('');
  const [complyStandards, setComplyStandards] = useState('');
  const [complyManufacturers, setComplyManufacturers] = useState('');
  const [maintenanceIssues, setMaintenanceIssues] = useState('');
  const [informedInsured, setInformedInsured] = useState('');
  const [roofDamagePercent, setRoofDamagePercent] = useState<number | ''>('');
  const [visualInspectionDamage, setVisualInspectionDamage] = useState('');
  const [damageRelatedEvent, setDamageRelatedEvent] = useState('');
  const [gutterGuard, setGutterGuard] = useState('');
  const [spreaderDownpipes, setSpreaderDownpipes] = useState('');
  const [flashingsCorrect, setFlashingsCorrect] = useState('');
  const [guttersClean, setGuttersClean] = useState('');
  const [windLift, setWindLift] = useState('');
  const [windLiftCause, setWindLiftCause] = useState('');
  const [materialLifespanDecreased, setMaterialLifespanDecreased] = useState('');
  const [fullReplacement, setFullReplacement] = useState('');
  const [structuralIntegrity, setStructuralIntegrity] = useState('');
  const [internalDamageDesc, setInternalDamageDesc] = useState('');
  const [ceilingWallCondition, setCeilingWallCondition] = useState('');
  const [internalMaintenanceNotes, setInternalMaintenanceNotes] = useState('');
  const [internalMaintenanceSummary, setInternalMaintenanceSummary] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [additionalRepairs, setAdditionalRepairs] = useState('');
  const [reporterName, setReporterName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  const sheetApiUrl =
    'https://script.google.com/macros/s/AKfycbxAeT0tXnBGwhw7NaoAvgdhUHz412L4ESPi62gtx0SUruZnEdUOn6nUi6APrOWxlrlekg/exec';
  const webhookUrl = 'https://n8n.wayvvault.cc/webhook/form-builder';

  // Load jobs
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch(sheetApiUrl);
        const data = await res.json();
        setJobs(data);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load jobs',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingJobs(false);
      }
    }
    loadJobs();
  }, [toast]);

  // Timestamp
  const now = new Date();
  const attendanceDate = now.toISOString().split('T')[0];
  const attendanceTime = now.toTimeString().split(' ')[0];
  const dateSubmitted = attendanceDate;

  const handleJobChange = (desc: string) => {
    setSelectedDescription(desc);
    const matchedJob = jobs.find((j) => j.description === desc) ?? null;
    setSelectedJob(matchedJob);
    if (matchedJob) {
      const addr = `${matchedJob.street}, ${matchedJob.suburb}, ${matchedJob.state} ${matchedJob.postcode}`;
      setLocationAddress(addr);
    }
  };

  useEffect(() => {
    if (!locationAddress) return;
    const apiKey = 'c5bceca9364900a58deb67ec79d3d0b0';
    // 1) Geocode to get precise lat/lon
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        locationAddress,
      )}&limit=1&appid=${apiKey}`
    )
      .then(res => res.json())
      .then(geo => {
        if (!geo || geo.length === 0) {
          throw new Error('Geocoding failed');
        }
        const { lat, lon } = geo[0];
        // 2) Fetch weather by coordinates
        return fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
      })
      .then(res => res.json())
      .then(data => {
        setWeather(data.weather?.[0]?.description ?? '');
        setLightConditions(data.weather?.[0]?.main ?? '');
      })
      .catch(err => {
        console.error('Weather lookup error', err);
        setWeather('');
        setLightConditions('');
      });
  }, [locationAddress]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setCaptions(files.map(() => ''));
  };
  const handleCaptionChange = (i: number, val: string) => {
    const c = [...captions];
    c[i] = val;
    setCaptions(c);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !notes.trim()) {
      toast({
        title: 'Error',
        description: 'Select a job & add notes',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    // Required fields
    formData.append('job', selectedDescription);
    formData.append('number', selectedJob.number);
    formData.append('clientName', selectedJob.clientName);
    // New: location address for weather lookup and weather fields
    formData.append('locationAddress', locationAddress);
    formData.append('weather', weather);
    formData.append('lightConditions', lightConditions);
    formData.append('notes', notes);
    // Date/time
    formData.append('attendanceDate', attendanceDate);
    formData.append('attendanceTime', attendanceTime);
    formData.append('isPowerIsolated', isPowerIsolated);
    formData.append('propertyType', propertyType);
    formData.append('ageOfProperty', ageOfProperty.toString());
    formData.append('propertyCondition', propertyCondition);
    formData.append('constructionType', constructionType);
    formData.append('roofType', roofType);
    formData.append('roofCondition', roofCondition);
    formData.append('roofAge', roofAge.toString());
    formData.append('roofPitch', roofPitch);
    formData.append('ceilingInspection', ceilingInspection);
    formData.append('trussSpacing', trussSpacing);
    formData.append('battensType', battensType);
    formData.append('membraneType', membraneType);
    formData.append('complyStandards', complyStandards);
    formData.append('complyManufacturers', complyManufacturers);
    formData.append('maintenanceIssues', maintenanceIssues);
    formData.append('informedInsured', informedInsured);
    formData.append('roofDamagePercent', roofDamagePercent.toString());
    formData.append('visualInspectionDamage', visualInspectionDamage);
    formData.append('damageRelatedEvent', damageRelatedEvent);
    formData.append('gutterGuard', gutterGuard);
    formData.append('spreaderDownpipes', spreaderDownpipes);
    formData.append('flashingsCorrect', flashingsCorrect);
    formData.append('guttersClean', guttersClean);
    formData.append('windLift', windLift);
    formData.append('windLiftCause', windLiftCause);
    formData.append('materialLifespanDecreased', materialLifespanDecreased);
    formData.append('fullReplacement', fullReplacement);
    formData.append('structuralIntegrity', structuralIntegrity);
    formData.append('internalDamageDesc', internalDamageDesc);
    formData.append('ceilingWallCondition', ceilingWallCondition);
    formData.append('internalMaintenanceNotes', internalMaintenanceNotes);
    formData.append('internalMaintenanceSummary', internalMaintenanceSummary);
    formData.append('conclusion', conclusion);
    formData.append('additionalRepairs', additionalRepairs);
    // Photos
    images.forEach((f, i) => {
      formData.append(`image_${i}`, f);
      formData.append(`caption_${i}`, captions[i] || '');
    });
    // Reporter & submission date
    formData.append('reporterName', reporterName);
    formData.append('dateSubmitted', dateSubmitted);

    const res = await fetch(webhookUrl, { method: 'POST', body: formData });
    if (res.ok) {
      toast({ title: 'Success', description: 'Report submitted!' });
      // Reset state below...
    }
    setIsLoading(false);
  };

  const uniqueDescriptions = Array.from(new Set(jobs.map((j) => j.description)));

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader><CardTitle className="text-center text-2xl">Roof Report Submission</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Attendance Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Attendance Date</Label>
                  <Input value={attendanceDate} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Attendance Time</Label>
                  <Input value={attendanceTime} readOnly className="bg-muted" />
                </div>
              </div>

              {/* Job selector */}
              <div>
                <Label>Job Description</Label>
                <Select
                  value={selectedDescription}
                  onValueChange={handleJobChange}
                  disabled={isLoadingJobs}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isLoadingJobs ? 'Loading jobs...' : 'Select a description...'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueDescriptions.map((desc, i) => (
                      <SelectItem key={i} value={desc}>
                        {desc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Number & Client */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Number</Label>
                  <Input value={selectedJob?.number || ''} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Client Name</Label>
                  <Input value={selectedJob?.clientName || ''} readOnly className="bg-muted" />
                </div>
              </div>

              <div>
                <Label>Weather at Time of Inspection</Label>
                <Input value={weather} readOnly className="bg-muted" />
              </div>
              <div>
                <Label>Light Conditions</Label>
                <Input value={lightConditions} readOnly className="bg-muted" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Is Power Isolated?</Label>
                  <Select
                    value={isPowerIsolated}
                    onValueChange={setIsPowerIsolated}
                  >
                    <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Property Type</Label>
                  <Select
                    value={propertyType}
                    onValueChange={setPropertyType}
                  >
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {['House','Unit','Townhouse','Other'].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Age of Property</Label>
                  <Input
                    type="number"
                    value={ageOfProperty}
                    onChange={(e) => setAgeOfProperty(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>General Property Condition</Label>
                  <Select
                    value={propertyCondition}
                    onValueChange={setPropertyCondition}
                  >
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {['Good','Fair','Poor'].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Construction Type</Label>
                <Input value={constructionType} onChange={(e) => setConstructionType(e.target.value)} />
              </div>
              <div>
                <Label>Roof Type</Label>
                <Input value={roofType} onChange={(e) => setRoofType(e.target.value)} />
              </div>
              <div>
                <Label>Roof Condition</Label>
                <Select
                  value={roofCondition}
                  onValueChange={setRoofCondition}
                >
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {['Good','Fair','Poor'].map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Roof Age</Label>
                  <Input
                    type="number"
                    value={roofAge}
                    onChange={(e) => setRoofAge(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Roof Pitch</Label>
                  <Input value={roofPitch} onChange={(e) => setRoofPitch(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Ceiling Inspection</Label>
                <Textarea
                  rows={3}
                  value={ceilingInspection}
                  onChange={(e) => setCeilingInspection(e.target.value)}
                  placeholder="Describe ceiling inspection findings..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Truss Spacing</Label>
                  <Input value={trussSpacing} onChange={(e) => setTrussSpacing(e.target.value)} />
                </div>
                <div>
                  <Label>Battens Type</Label>
                  <Input value={battensType} onChange={(e) => setBattensType(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Membrane Type</Label>
                <Input value={membraneType} onChange={(e) => setMembraneType(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Comply with Standards</Label>
                  <Select
                    value={complyStandards}
                    onValueChange={setComplyStandards}
                  >
                    <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Comply with Manufacturers</Label>
                  <Select
                    value={complyManufacturers}
                    onValueChange={setComplyManufacturers}
                  >
                    <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Maintenance Issues</Label>
                <Textarea
                  rows={3}
                  value={maintenanceIssues}
                  onChange={(e) => setMaintenanceIssues(e.target.value)}
                  placeholder="Describe any maintenance issues found..."
                />
              </div>
              <div>
                <Label>Informed Insured</Label>
                <Select
                  value={informedInsured}
                  onValueChange={setInformedInsured}
                >
                  <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Roof Damage (% of area)</Label>
                <Input
                  type="number"
                  value={roofDamagePercent}
                  onChange={(e) => setRoofDamagePercent(Number(e.target.value))}
                  placeholder="Enter percentage"
                />
              </div>
              <div>
                <Label>Visual Inspection Damage</Label>
                <Textarea
                  rows={3}
                  value={visualInspectionDamage}
                  onChange={(e) => setVisualInspectionDamage(e.target.value)}
                  placeholder="Describe any visible damage..."
                />
              </div>
              <div>
                <Label>Damage Related to Event?</Label>
                <Select
                  value={damageRelatedEvent}
                  onValueChange={setDamageRelatedEvent}
                >
                  <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gutter Guard Present?</Label>
                <Select
                  value={gutterGuard}
                  onValueChange={setGutterGuard}
                >
                  <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Spreader Downpipes Present?</Label>
                <Select
                  value={spreaderDownpipes}
                  onValueChange={setSpreaderDownpipes}
                >
                  <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Are Flashings Correct?</Label>
                <Select
                  value={flashingsCorrect}
                  onValueChange={setFlashingsCorrect}
                >
                  <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Are Gutters Clean?</Label>
                <Select
                  value={guttersClean}
                  onValueChange={setGuttersClean}
                >
                  <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Wind Lift Present?</Label>
                <Select
                  value={windLift}
                  onValueChange={setWindLift}
                >
                  <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>If Wind Lift, What is the Cause?</Label>
                <Input
                  value={windLiftCause}
                  onChange={(e) => setWindLiftCause(e.target.value)}
                  placeholder="Describe cause if applicable"
                />
              </div>
              <div>
                <Label>Material Lifespan Decreased?</Label>
                <Select
                  value={materialLifespanDecreased}
                  onValueChange={setMaterialLifespanDecreased}
                >
                  <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Full Replacement Required?</Label>
                <Select
                  value={fullReplacement}
                  onValueChange={setFullReplacement}
                >
                  <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Structural Integrity</Label>
                <Textarea
                  rows={3}
                  value={structuralIntegrity}
                  onChange={(e) => setStructuralIntegrity(e.target.value)}
                  placeholder="Describe structural integrity..."
                />
              </div>
              <div>
                <Label>Internal Damage Description</Label>
                <Textarea
                  rows={3}
                  value={internalDamageDesc}
                  onChange={(e) => setInternalDamageDesc(e.target.value)}
                  placeholder="Describe any internal damage..."
                />
              </div>
              <div>
                <Label>Ceiling/Wall Condition</Label>
                <Textarea
                  rows={3}
                  value={ceilingWallCondition}
                  onChange={(e) => setCeilingWallCondition(e.target.value)}
                  placeholder="Describe ceiling/wall condition..."
                />
              </div>
              <div>
                <Label>Internal Maintenance Notes</Label>
                <Textarea
                  rows={3}
                  value={internalMaintenanceNotes}
                  onChange={(e) => setInternalMaintenanceNotes(e.target.value)}
                  placeholder="Notes about internal maintenance..."
                />
              </div>
              <div>
                <Label>Internal Maintenance Summary</Label>
                <Textarea
                  rows={3}
                  value={internalMaintenanceSummary}
                  onChange={(e) => setInternalMaintenanceSummary(e.target.value)}
                  placeholder="Summary of internal maintenance..."
                />
              </div>
              <div>
                <Label>Conclusion</Label>
                <Textarea
                  rows={3}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Conclusion of inspection..."
                />
              </div>
              <div>
                <Label>Additional Repairs Required</Label>
                <Textarea
                  rows={3}
                  value={additionalRepairs}
                  onChange={(e) => setAdditionalRepairs(e.target.value)}
                  placeholder="List any additional repairs required..."
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div>
                <Label>Upload Roof Photos</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {images.map((img, i) => (
                <div key={i} className="space-y-2">
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt={img.name} 
                    className="w-32 h-32 object-cover mb-2 rounded border" 
                  />
                  <Label>Caption for {img.name}</Label>
                  <Input
                    value={captions[i]}
                    onChange={(e) => handleCaptionChange(i, e.target.value)}
                  />
                </div>
              ))}
              <div>
                <Label>Your Name</Label>
                <Input
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label>Date Submitted</Label>
                <Input value={dateSubmitted} readOnly className="bg-muted" />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isLoadingJobs}
              >
                {isLoading ? 'Submitting…' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoofReport;