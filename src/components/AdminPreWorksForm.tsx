import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
// Dynamic imports for heavy libraries
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
import '../pages/PreWorksForm.css'

// Admin components only - no navigation/footer needed



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
  colour?: string
  length?: number | null
  width?: number | null
  area?: number | null
  images: ImageFile[]
}

interface BattenRow {
  kind: 'Purlin' | 'Batten'
  spacingMm?: string
  material?: 'Steel' | 'Timber'
  size?: string
  condition?: string
  images: ImageFile[]
}

interface FramingRow {
  material: 'Metal' | 'Timber'
  spacing?: string
  size?: string
  span?: string
  condition?: string
  images: ImageFile[]
}

interface Asset {
  assetName: string
  roofAreas: RoofArea[]
  battens: BattenRow[]
  framing: FramingRow[]
}

interface FormValues {
  selectedDescription: string
  notes: string
  reporterName?: string
  locationOfStructure?: string
  locationOther?: string
  siteAccess?: string
  customerNotes?: string
  isPowerIsolated?: string
  propertyType?: string
  ageOfProperty?: string
  propertyCondition?: string
  constructionType?: string
  roofServices?: string[]
  assets: Asset[]
  finalPlan?: FileList
  finalTakeoff?: FileList
  powerIsolationImage?: FileList
  mudmapUrl?: string
  siteMapUrl?: string
}

// ---------- Time helpers locked to Australia/Brisbane ----------
const tz = 'Australia/Brisbane'
const fmtDate = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }) // YYYY-MM-DD
const fmtTime = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })

// Custom Color Selector Component
interface ColorOption {
  value: string
  label: string
  swatch: string
}

const ColorSelector: React.FC<{
  value: string
  onValueChange: (value: string) => void
  options: ColorOption[]
  placeholder?: string
  showPreview?: boolean
}> = ({ value, onValueChange, options, placeholder = "Select colour…", showPreview = true }) => {
  const [open, setOpen] = useState(false)
  const selectedColor = options.find(option => option.value === value)

  return (
    <div className="flex items-center gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 text-left"
          >
            {selectedColor ? (
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <img 
                  src={selectedColor.swatch} 
                  alt={selectedColor.label}
                  className="w-4 h-4 rounded border flex-shrink-0"
                  onError={(e) => {
                    // Fallback to colored div if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLDivElement
                    if (fallback) fallback.style.display = 'block'
                  }}
                />
                <div 
                  className="w-4 h-4 rounded border hidden flex-shrink-0"
                  style={{ backgroundColor: getColorFallback(selectedColor.value) }}
                />
                <span className="truncate font-normal">{selectedColor.label}</span>
              </div>
            ) : (
              <span className="truncate text-muted-foreground font-normal">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-2 px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => {
                  onValueChange(option.value)
                  setOpen(false)
                }}
              >
                <img 
                  src={option.swatch} 
                  alt={option.label}
                  className="w-4 h-4 rounded border flex-shrink-0"
                  onError={(e) => {
                    // Fallback to colored div if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLDivElement
                    if (fallback) fallback.style.display = 'block'
                  }}
                />
                <div 
                  className="w-4 h-4 rounded border hidden flex-shrink-0"
                  style={{ backgroundColor: getColorFallback(option.value) }}
                />
                <span className="flex-1 truncate">{option.label}</span>
                {value === option.value && (
                  <Check className="h-4 w-4 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Interactive Color Preview */}
      {showPreview && selectedColor && (
        <div className="flex flex-col items-center gap-1">
          <div 
            className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
            style={{ backgroundColor: getColorFallback(selectedColor.value) }}
          />
          <span className="text-xs text-gray-600 font-medium text-center leading-tight">
            {selectedColor.label}
          </span>
        </div>
      )}
    </div>
  )
}

// Fallback color function for when images don't load
const getColorFallback = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'Surfmist': '#F5F5F0',
    'Shale Grey': '#8B8B8B',
    'Windspray': '#B8D4E3',
    'Basalt': '#2F2F2F',
    'Monument': '#1C1C1C',
    'Woodland Grey': '#4A4A4A',
    'Dune': '#D2B48C',
    'Evening Haze': '#B8A9C9',
    'Jasper': '#8B4513',
    'Pale Eucalypt': '#C8E6C9'
  }
  return colorMap[colorName] || '#CCCCCC'
}

// Form Progress Tracker Component
const FormProgressTracker: React.FC<{ formData: FormValues }> = ({ formData }) => {
  const calculateProgress = () => {
    const requiredFields = [
      'selectedDescription',
      'notes',
      'reporterName',
      'locationOfStructure',
      'isPowerIsolated',
      'propertyType',
      'ageOfProperty',
      'propertyCondition',
      'constructionType'
    ]
    
    const assetRequiredFields = ['assetName', 'type', 'profile', 'pitchDeg']
    
    let completedFields = 0
    let totalFields = requiredFields.length
    
    // Check main form fields
    requiredFields.forEach(field => {
      if (formData[field as keyof FormValues] && String(formData[field as keyof FormValues]).trim() !== '') {
        completedFields++
      }
    })
    
    // Check asset fields
    formData.assets.forEach(asset => {
      totalFields += assetRequiredFields.length
      asset.roofAreas.forEach(area => {
        assetRequiredFields.forEach(field => {
          if (area[field as keyof RoofArea] && String(area[field as keyof RoofArea]).trim() !== '') {
            completedFields++
          }
        })
      })
    })
    
    return Math.round((completedFields / totalFields) * 100)
  }
  
  const progress = calculateProgress()
  const getProgressColor = () => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  const getProgressText = () => {
    if (progress < 30) return 'Getting Started'
    if (progress < 70) return 'Good Progress'
    if (progress < 100) return 'Almost Done'
    return 'Complete!'
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-blue-900">Form Progress</h3>
        <span className="text-2xl font-bold text-blue-700">{progress}%</span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-blue-700 mb-1">
          <span>{getProgressText()}</span>
          <span>{progress}/100</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${formData.selectedDescription ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={formData.selectedDescription ? 'text-green-700' : 'text-gray-500'}>Job Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${formData.assets.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={formData.assets.length > 0 ? 'text-green-700' : 'text-gray-500'}>Assets Added</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${formData.notes ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={formData.notes ? 'text-green-700' : 'text-gray-500'}>Notes Added</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${formData.reporterName ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={formData.reporterName ? 'text-green-700' : 'text-gray-500'}>Reporter Set</span>
        </div>
      </div>
    </div>
  )
}




// Profile Info Component for Lysaght Profiles
const ProfileInfo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  const profileDetails = [
    {
      name: 'CUSTOM ORB',
      description: 'Classic corrugated profile with 76mm pitch',
      image: '/profile-images/custom-orb.jpg', // Placeholder - you can add actual images
      features: ['Traditional appearance', '76mm pitch', 'Versatile applications']
    },
    {
      name: 'TRIMDEK',
      description: 'Modern concealed fix profile with clean lines',
      image: '/profile-images/trimdek.jpg',
      features: ['Concealed fixings', 'Clean aesthetic', 'Modern design']
    },
    {
      name: 'KLIP-LOK 700',
      description: 'High-performance concealed fix profile',
      image: '/profile-images/klip-lok-700.jpg',
      features: ['High performance', 'Concealed fixings', '700mm coverage']
    },
    {
      name: 'SPANDEK',
      description: 'Versatile profile with 200mm pitch',
      image: '/profile-images/spandek.jpg',
      features: ['200mm pitch', 'Versatile', 'Cost-effective']
    },
    {
      name: 'CUSTOM BLUE ORB',
      description: 'Classic profile in distinctive blue finish',
      image: '/profile-images/custom-orb-blue.jpg',
      features: ['Blue finish', 'Classic design', 'Distinctive appearance']
    }
  ]
  
  return (
    <>
      {/* Question Mark Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full text-xs font-medium transition-colors duration-200 ml-2"
        title="View Lysaght Profile Information"
      >
        ?
      </button>
      
      {/* Profile Information Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Lysaght Profile Guide</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mt-2">Learn about different Lysaght roofing profiles and their applications</p>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileDetails.map((profile) => (
                  <div key={profile.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {/* Profile Image with Fallback */}
                      <img 
                        src={profile.image} 
                        alt={`${profile.name} profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const fallback = target.nextElementSibling as HTMLDivElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                      {/* Placeholder fallback */}
                      <div className="text-gray-500 text-center hidden">
                        <div className="text-4xl mb-2">🏠</div>
                        <div className="text-sm">{profile.name}</div>
                        <div className="text-xs text-gray-400">Profile Image</div>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{profile.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{profile.description}</p>
                    
                    <div className="space-y-1">
                      {profile.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Profile Selection Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>CUSTOM ORB:</strong> Best for traditional homes and heritage properties</li>
                  <li>• <strong>TRIMDEK:</strong> Ideal for modern homes seeking clean, concealed fixings</li>
                  <li>• <strong>KLIP-LOK 700:</strong> Perfect for high-performance applications and commercial use</li>
                  <li>• <strong>SPANDEK:</strong> Great value option for sheds and agricultural buildings</li>
                  <li>• <strong>CUSTOM BLUE ORB:</strong> Distinctive choice for coastal and heritage properties</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Drag and Drop Image Upload Component
interface ImageFile {
  id: string
  file: File
  preview: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

const DragAndDropImageUpload: React.FC<{
  multiple?: boolean
  accept?: string
  maxSize?: number // in MB
  onImagesChange: (files: File[]) => void
  className?: string
  placeholder?: string
}> = ({ 
  multiple = true, 
  accept = "image/*", 
  maxSize = 10, 
  onImagesChange, 
  className = "",
  placeholder = "Drag & drop images here or click to browse"
}) => {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Compress image function
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions (max 1200px width/height)
        const maxSize = 1200
        let { width, height } = img
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          0.8 // 80% quality
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // Handle file selection
  const handleFiles = async (files: FileList) => {
    setIsCompressing(true)
    const newImages: ImageFile[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue
      }
      
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        continue
      }
      
      const id = Math.random().toString(36).substr(2, 9)
      const preview = URL.createObjectURL(file)
      
      newImages.push({
        id,
        file,
        preview,
        progress: 0,
        status: 'uploading'
      })
    }
    
    // Compress images
    const compressedImages = await Promise.all(
      newImages.map(async (img) => {
        try {
          const compressedFile = await compressImage(img.file)
          return { ...img, file: compressedFile }
        } catch (error) {
          return img
        }
      })
    )
    
    setImages(compressedImages)
    onImagesChange(compressedImages.map(img => img.file))
    setIsCompressing(false)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  // Remove image
  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id)
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview)
    }
    
    const newImages = images.filter(img => img.id !== id)
    setImages(newImages)
    onImagesChange(newImages.map(img => img.file))
  }

  // Click to browse
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drag and Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="space-y-2">
          <div className="text-4xl">📸</div>
          <p className="text-gray-600 font-medium">{placeholder}</p>
          <p className="text-sm text-gray-500">
            {multiple ? 'Multiple images supported' : 'Single image only'} • Max {maxSize}MB per image
          </p>
          {isCompressing && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Compressing images...
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(image.id)
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ✕
                </button>
                
                {/* File Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="truncate">{image.file.name}</p>
                  <p>{(image.file.size / 1024 / 1024).toFixed(1)}MB</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Smart Form Validation Component
interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

interface ValidationResult {
  isValid: boolean
  message: string
  type: 'error' | 'warning' | 'success'
}

const SmartFormValidation: React.FC<{
  value: any
  rules: ValidationRule
  label: string
  children: React.ReactNode
  className?: string
}> = ({ value, rules, label, children, className = "" }) => {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    message: '',
    type: 'success'
  })
  const [isTouched, setIsTouched] = useState(false)

  // Validation logic
  const validateField = (value: any): ValidationResult => {
    // Required check
    if (rules.required && (!value || String(value).trim() === '')) {
      return {
        isValid: false,
        message: `${label} is required`,
        type: 'error'
      }
    }

    // Skip other validations if empty and not required
    if (!value || String(value).trim() === '') {
      return {
        isValid: true,
        message: '',
        type: 'success'
      }
    }

    const stringValue = String(value)

    // Min length check
    if (rules.minLength && stringValue.length < rules.minLength) {
      return {
        isValid: false,
        message: `${label} must be at least ${rules.minLength} characters`,
        type: 'error'
      }
    }

    // Max length check
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return {
        isValid: false,
        message: `${label} must be no more than ${rules.maxLength} characters`,
        type: 'warning'
      }
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      return {
        isValid: false,
        message: `${label} format is invalid`,
        type: 'error'
      }
    }

    // Custom validation
    if (rules.custom) {
      const customResult = rules.custom(value)
      if (customResult) {
        return {
          isValid: false,
          message: customResult,
          type: 'error'
        }
      }
    }

    // Success
    return {
      isValid: true,
      message: `${label} looks good!`,
      type: 'success'
    }
  }

  // Update validation when value changes
  useEffect(() => {
    if (isTouched) {
      const result = validateField(value)
      setValidation(result)
    }
  }, [value, isTouched, rules, label])

  // Handle field focus/blur
  const handleFieldInteraction = () => {
    if (!isTouched) {
      setIsTouched(true)
    }
  }

  // Get validation styles
  const getValidationStyles = () => {
    if (!isTouched) return ''
    
    switch (validation.type) {
      case 'error':
        return 'border-red-300 focus:border-red-500 focus:ring-red-500'
      case 'warning':
        return 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
      case 'success':
        return 'border-green-300 focus:border-green-500 focus:ring-green-500'
      default:
        return ''
    }
  }

  // Get validation icon
  const getValidationIcon = () => {
    if (!isTouched) return null
    
    switch (validation.type) {
      case 'error':
        return <div className="text-red-500">❌</div>
      case 'warning':
        return <div className="text-yellow-500">⚠️</div>
      case 'success':
        return <div className="text-green-500">✅</div>
      default:
        return null
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Field with validation styling */}
      <div 
        className="relative"
        onFocus={handleFieldInteraction}
        onBlur={handleFieldInteraction}
      >
        {children}
        
        {/* Validation Icon */}
        {isTouched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getValidationIcon()}
          </div>
        )}
      </div>

      {/* Validation Message */}
      {isTouched && validation.message && (
        <div className={`text-sm transition-all duration-200 ${
          validation.type === 'error' ? 'text-red-600' :
          validation.type === 'warning' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {validation.message}
        </div>
      )}

      {/* Required Indicator */}
      {rules.required && (
        <div className="text-xs text-gray-500">
          * Required field
        </div>
      )}
    </div>
  )
}

// Interactive Data Visualization Component
interface RoofAreaVisualization {
  name: string
  type: string
  pitch: number
  area: number // in square meters
  materials: {
    profile: string
    color: string
    membrane: string
  }
}

const InteractiveDataVisualization: React.FC<{
  assets: Asset[]
  className?: string
}> = ({ assets, className = "" }) => {
  const [selectedAsset, setSelectedAsset] = useState(0)
  const [viewMode, setViewMode] = useState<'diagram' | 'costs' | 'timeline'>('diagram')

  // Calculate roof area (simplified)
  const calculateRoofArea = (pitch: number, baseArea: number = 100) => {
    const pitchRadians = (pitch * Math.PI) / 180
    return baseArea / Math.cos(pitchRadians)
  }

  // Estimate material costs
  const estimateCosts = (area: RoofAreaVisualization) => {
    const baseCost = 45 // $ per square meter
    const pitchMultiplier = 1 + (area.pitch / 100)
    const profileMultiplier = area.materials.profile.includes('KLIP-LOK') ? 1.3 : 1.0
    
    return {
      materials: Math.round(area.area * baseCost * pitchMultiplier * profileMultiplier),
      labor: Math.round(area.area * 35 * pitchMultiplier),
      total: Math.round(area.area * (baseCost + 35) * pitchMultiplier * profileMultiplier)
    }
  }

  // Generate timeline
  const generateTimeline = (asset: Asset) => {
    const totalAreas = asset.roofAreas.length
    const baseDays = 2
    const additionalDays = totalAreas * 0.5
    
    return {
      preparation: 1,
      installation: Math.ceil(baseDays + additionalDays),
      finishing: 1,
      total: Math.ceil(baseDays + additionalDays + 2)
    }
  }

  const selectedAssetData = assets[selectedAsset]
  const roofAreas = selectedAssetData?.roofAreas.map(area => ({
    name: area.name,
    type: area.type || 'Unknown',
    pitch: area.pitchDeg || 0,
    area: calculateRoofArea(area.pitchDeg || 0),
    materials: {
      profile: area.profile || 'Not specified',
      color: area.colour || 'Not specified',
      membrane: area.membrane || 'None'
    }
  })) || []

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Interactive Data Visualization</h3>
        
        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'diagram', label: 'Diagram', icon: '🏠' },
            { key: 'costs', label: 'Costs', icon: '💰' },
            { key: 'timeline', label: 'Timeline', icon: '📅' }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === mode.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset</label>
        <div className="flex gap-2 flex-wrap">
          {assets.map((asset, index) => (
            <button
              key={index}
              onClick={() => setSelectedAsset(index)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedAsset === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {asset.assetName}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'diagram' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Roof Area Diagram</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {roofAreas.map((area, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{area.name}</h5>
                  <span className="text-sm text-gray-500">{area.area.toFixed(1)}m²</span>
                </div>
                
                {/* Simple roof diagram */}
                <div className="relative h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"
                    style={{
                      clipPath: `polygon(0 100%, 100% 100%, 100% ${100 - (area.pitch / 2)}%, 0 ${100 - (area.pitch / 2)}%)`
                    }}
                  />
                  <div className="absolute top-2 left-2 text-xs text-gray-700">
                    {area.pitch}° pitch
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <div><strong>Type:</strong> {area.type}</div>
                  <div><strong>Profile:</strong> {area.materials.profile}</div>
                  <div><strong>Color:</strong> {area.materials.color}</div>
                  <div><strong>Membrane:</strong> {area.materials.membrane}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'costs' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Material Cost Estimation</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {roofAreas.map((area, index) => {
              const costs = estimateCosts(area)
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">{area.name}</h5>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Materials:</span>
                      <span className="font-medium">${costs.materials.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Labor:</span>
                      <span className="font-medium">${costs.labor.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-blue-600">${costs.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    * Estimates based on {area.area.toFixed(1)}m² area and {area.pitch}° pitch
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {viewMode === 'timeline' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Project Timeline</h4>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-gray-900 mb-4">{selectedAssetData?.assetName}</h5>
            
            {(() => {
              const timeline = generateTimeline(selectedAssetData!)
              return (
                <div className="space-y-4">
                  {/* Timeline bars */}
                  <div className="space-y-3">
                    {[
                      { phase: 'Preparation', days: timeline.preparation, color: 'bg-blue-500' },
                      { phase: 'Installation', days: timeline.installation, color: 'bg-green-500' },
                      { phase: 'Finishing', days: timeline.finishing, color: 'bg-purple-500' }
                    ].map((phase, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">{phase.phase}</span>
                          <span className="text-gray-500">{phase.days} day{phase.days !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${phase.color}`}
                            style={{ width: `${(phase.days / timeline.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Project Time:</span>
                      <span className="text-xl font-bold text-blue-600">{timeline.total} days</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    * Timeline estimates based on {roofAreas.length} roof area{roofAreas.length !== 1 ? 's' : ''} and complexity
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

// Simple PDF Export Component with Images
const PDFExportButton: React.FC<{
  formData: FormValues
  className?: string
  jobId: string
}> = ({ formData, className = "", jobId }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      await generatePDFWithImages()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }



  const generateTextOnlyPDF = async () => {
    // Dynamically import jsPDF only when needed
    const { default: jsPDF } = await import('jspdf')
    
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Set PDF properties and metadata
    pdf.setProperties({
      title: 'Pre Works Form',
      subject: 'Pre-Works Assessment Report',
      author: 'ARW Roofing',
      creator: 'ARW Roofing Pre-Works Assessment Form',
      keywords: 'roofing, assessment, pre-works, construction'
    })
    
    // Set the document title using the correct jsPDF method
    pdf.setProperties({
      title: 'Pre Works Form'
    })
    
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20
    let currentPage = 1
    
    // Helper function to add new page if needed
    const addPageIfNeeded = () => {
      if (yPosition > pageHeight - 40) {
        addNewPage()
        return true
      }
      return false
    }
    
    // Helper function to add new page (alias for consistency)
    const addNewPage = () => {
      pdf.addPage()
      currentPage++
      yPosition = 20
    }
    
    // Helper function to convert image to base64
    const convertImageToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }
    
    // Helper function to add image to PDF with proper sizing
    const addImageToPDF = async (imageFile: File, x: number, y: number, maxWidth: number, maxHeight: number) => {
      try {
        const base64 = await convertImageToBase64(imageFile)
        const img = new Image()
        
        return new Promise<void>((resolve, reject) => {
          img.onload = () => {
            // Get original image dimensions
            let { width, height } = img
            const aspectRatio = width / height
            
            // Calculate dimensions to fit within maxWidth x maxHeight while maintaining aspect ratio
            let finalWidth, finalHeight
            
            // Start with the maximum allowed dimensions
            finalWidth = maxWidth
            finalHeight = maxHeight
            
            // Calculate which dimension will be the limiting factor
            if (width > height) {
              // Landscape image - fit to width first
              finalWidth = maxWidth
              finalHeight = maxWidth / aspectRatio
              
              // If height exceeds maxHeight, scale down proportionally
              if (finalHeight > maxHeight) {
                finalHeight = maxHeight
                finalWidth = maxHeight * aspectRatio
              }
            } else {
              // Portrait image - fit to height first
              finalHeight = maxHeight
              finalWidth = maxHeight * aspectRatio
              
              // If width exceeds maxWidth, scale down proportionally
              if (finalWidth > maxWidth) {
                finalWidth = maxWidth
                finalHeight = maxWidth / aspectRatio
              }
            }
            
            // Ensure minimum size for readability (but don't make images too small)
            const minWidth = Math.max(30, maxWidth * 0.3) // At least 30mm or 30% of max width
            const minHeight = Math.max(20, maxHeight * 0.3) // At least 20mm or 30% of max height
            
            if (finalWidth < minWidth) {
              finalWidth = minWidth
              finalHeight = minWidth / aspectRatio
            }
            if (finalHeight < minHeight) {
              finalHeight = minHeight
              finalWidth = minHeight * aspectRatio
            }
            
            // Ensure we don't exceed maximum dimensions
            finalWidth = Math.min(finalWidth, maxWidth)
            finalHeight = Math.min(finalHeight, maxHeight)
            
            // Add image to PDF with calculated dimensions
            pdf.addImage(base64, 'JPEG', x, y, finalWidth, finalHeight)
            resolve()
          }
          img.onerror = reject
          img.src = base64
        })
              } catch (error) {
          console.error('Error processing image:', error)
          // Don't add placeholder text - just log the error
          // This prevents "Image failed to load" messages from appearing
        }
    }
      
    // Add header with logo and styling
    console.log('🔄 Starting PDF styling...')
    try {
      // Smooth gradient header background
      console.log('🎨 Setting header gradient background...')
      const headerGradientColors = [
        { r: 26, g: 57, b: 105 }, // Dark blue
        { r: 0, g: 183, b: 255 }  // Bright blue/cyan
      ]
      
      // Create smooth gradient effect for header
      const headerGradientSteps = 30 // Many steps for very smooth blend
      for (let i = 0; i < headerGradientSteps; i++) {
        const ratio = i / (headerGradientSteps - 1)
        const r = Math.round(headerGradientColors[0].r * (1 - ratio) + headerGradientColors[1].r * ratio)
        const g = Math.round(headerGradientColors[0].g * (1 - ratio) + headerGradientColors[1].g * ratio)
        const b = Math.round(headerGradientColors[0].b * (1 - ratio) + headerGradientColors[1].b * ratio)
        
        pdf.setFillColor(r, g, b)
        const rectHeight = 40 / headerGradientSteps // Distribute height across all steps
        pdf.rect(0, i * rectHeight, pageWidth, rectHeight, 'F')
      }
      console.log('✅ Header gradient set successfully')
      
      // Add logo and company branding
      console.log('🎨 Setting logo and company name...')
      try {
        // Try to add the logo image first
        const logoUrl = 'https://www.dropbox.com/scl/fi/buw0myidymhr9t34heyty/Screenshot-2025-07-03-at-12.01.38-pm.png?rlkey=l37u7xr5v9jrmshzubkjzjxir&st=sftzmmpd&raw=1'
        
        // Create a temporary image element to get dimensions
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = async () => {
          try {
            // Convert image to base64 for PDF embedding
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            
            const logoBase64 = canvas.toDataURL('image/png')
            
            // Add logo to PDF (left side of header)
            const logoWidth = 30 // mm
            const logoHeight = 20 // mm
            const logoX = 20
            const logoY = 10
            
            pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight)
            console.log('✅ Logo added successfully')
            
            // Add company name to the right of logo
            pdf.setTextColor(255, 255, 255) // White text
            pdf.setFontSize(24)
            pdf.setFont('helvetica', 'bold')
            pdf.text('ARW ROOFING', logoX + logoWidth + 15, 25)
            
            // Add subtitle below company name
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'normal')
            pdf.text('Pre-Works Assessment Report', logoX + logoWidth + 15, 35)
            
          } catch (logoError) {
            console.error('❌ Error adding logo:', logoError)
            // Fallback to text-only if logo fails
            fallbackToTextOnly()
          }
        }
        
        img.onerror = () => {
          console.log('⚠️ Logo failed to load, using text fallback')
          fallbackToTextOnly()
        }
        
        img.src = logoUrl
        
        // Fallback function for text-only header
        const fallbackToTextOnly = () => {
          pdf.setTextColor(255, 255, 255) // White text
          pdf.setFontSize(28)
          pdf.setFont('helvetica', 'bold')
          pdf.text('ARW ROOFING', pageWidth / 2, 25, { align: 'center' })
          
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'normal')
          pdf.text('Pre-Works Assessment Report', pageWidth / 2, 35, { align: 'center' })
        }
        
      } catch (error) {
        console.error('❌ Error in logo setup:', error)
        // Fallback to text-only
        pdf.setTextColor(255, 255, 255) // White text
        pdf.setFontSize(28)
        pdf.setFont('helvetica', 'bold')
        pdf.text('ARW ROOFING', pageWidth / 2, 25, { align: 'center' })
        
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'normal')
        pdf.text('Pre-Works Assessment Report', pageWidth / 2, 35, { align: 'center' })
      }
      
      console.log('✅ Company branding set successfully')
      
      // Reset colors and position for body text
      pdf.setTextColor(0, 0, 0) // Black text for body content
      yPosition = 45 // Reduced from 50 to bring content closer to header
      console.log('✅ Header styling completed successfully')
    } catch (error) {
      console.error('❌ Error styling header:', error)
      // Fallback to basic header
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('ARW ROOFING - Pre-Works Assessment Report', pageWidth / 2, 25, { align: 'center' })
      yPosition = 35 // Reduced from 40 to bring content closer to header
    }
    
    // Add styled date section
    try {
      // Light blue background
      pdf.setFillColor(240, 248, 255) // Light blue background
      pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'F')
      
      yPosition += 15 // Reduced from 25 to minimize gap
    } catch (error) {
      console.error('Error styling date section:', error)
      // Fallback to basic date
        yPosition += 12 // Reduced from 20 to minimize gap
    }
        
        // Add job information if available
        if (formData.selectedDescription) {
      try {
        // Styled section header - properly sized to not cut off text
        pdf.setFillColor(26, 57, 105) // Dark blue background
        pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F') // Reduced height from 15 to 12
        
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(255, 255, 255) // White text on dark background
        pdf.text('Job Information', 20, yPosition + 3) // Adjusted text position from +5 to +3
        yPosition += 12 // Reduced spacing to match header height
        
        // Reset text color for content below
        pdf.setTextColor(0, 0, 0) // Black text for content
      } catch (error) {
        console.error('Error styling job information header:', error)
        // Fallback to basic header
          pdf.setFontSize(16)
          pdf.setFont('helvetica', 'bold')
          pdf.text('Job Information', 20, yPosition)
        yPosition += 15
      }
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
          
          // Try to extract job number from description if it follows a pattern
          const jobMatch = formData.selectedDescription.match(/(\d+)/)
          const jobNumber = jobMatch ? jobMatch[1] : 'N/A'
          
          const jobDetails = [
            ['Job Description:', formData.selectedDescription],
            ['Job Number:', jobNumber],
            ['Assessment Date:', new Date().toLocaleDateString()]
          ]
          
          jobDetails.forEach(([label, value]) => {
            pdf.setFont('helvetica', 'bold')
            pdf.setTextColor(0, 51, 102) // Dark blue labels for consistency
            pdf.text(label, 20, yPosition)
            pdf.setFont('helvetica', 'normal')
            pdf.setTextColor(0, 0, 0) // Black values
            pdf.text(value, 80, yPosition) // Increased spacing for better readability
            yPosition += 6
          })
          
          yPosition += 8 // Reduced spacing
        }
        
    // Add form details with styling
    try {
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      
      // Add styled section header - properly sized to not cut off text
      pdf.setFillColor(26, 57, 105) // Dark blue background to match Job Information
      pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F') // Reduced height from 15 to 12
      
      pdf.setTextColor(255, 255, 255) // White text on dark background
      pdf.text('Project Details', 20, yPosition + 3) // Adjusted text position from +5 to +3
      yPosition += 12 // Reduced spacing to match header height
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(0, 0, 0)
      
      // Basic form information
      const formDetails = [
        ['Job Description:', formData.selectedDescription || 'Not specified'],
        ['Property Type:', formData.propertyType || 'Not specified'],
        ['Age of Property:', formData.ageOfProperty || 'Not specified'],
        ['Property Condition:', formData.propertyCondition || 'Not specified'],
        ['Construction Type:', formData.constructionType || 'Not specified'],
        ['Reporter Name:', formData.reporterName || 'Not specified'],
        ['Location of Structure:', formData.locationOfStructure || 'Not specified'],
        ['Site Access:', formData.siteAccess || 'Not specified'],
        ['Power Isolated:', formData.isPowerIsolated || 'Not specified']
      ]
      
      formDetails.forEach(([label, value]) => {
        addPageIfNeeded()
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 51, 102) // Dark blue labels for consistency
        pdf.text(label, 20, yPosition)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0) // Black values
        pdf.text(value, 80, yPosition) // Increased spacing for better readability
        yPosition += 6
      })
      
      yPosition += 8 // Reduced spacing
    } catch (error) {
      console.error('Error styling project details header:', error)
      // Fallback to basic header
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Project Details', 20, yPosition)
      yPosition += 20
    }
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        
        // Basic form information
        const formDetails = [
          ['Job Description:', formData.selectedDescription || 'Not specified'],
          ['Property Type:', formData.propertyType || 'Not specified'],
          ['Age of Property:', formData.ageOfProperty || 'Not specified'],
          ['Property Condition:', formData.propertyCondition || 'Not specified'],
          ['Construction Type:', formData.constructionType || 'Not specified'],
          ['Reporter Name:', formData.reporterName || 'Not specified'],
          ['Location of Structure:', formData.locationOfStructure || 'Not specified'],
          ['Location Other:', formData.locationOther || 'Not specified'],
          ['Site Access:', formData.siteAccess || 'Not specified'],
          ['Customer Notes:', formData.customerNotes || 'Not specified'],
          ['Power Isolated:', formData.isPowerIsolated || 'Not specified']
        ]
        
        formDetails.forEach(([label, value]) => {
          pdf.setFont('helvetica', 'bold')
          pdf.text(label, 20, yPosition)
          pdf.setFont('helvetica', 'normal')
          pdf.text(value, 70, yPosition)
          yPosition += 6
        })
        
        yPosition += 10
        
    // Add roof services information with styling
        if (formData.roofServices && formData.roofServices.length > 0) {
      pdf.setFillColor(0, 183, 255) // Bright blue/cyan from style guide
      pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
      
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255) // White text on bright blue background
      pdf.text('Requested Roof Services:', 20, yPosition + 5)
      yPosition += 20
      
      // Reset text color for content below
      pdf.setTextColor(0, 0, 0) // Black text for content
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
          
          formData.roofServices.forEach((service, index) => {
            pdf.text(`  • ${service}`, 25, yPosition)
            yPosition += 5
          })
          
          yPosition += 10
        }
        
        // Add mudmap guide image if available
        if (formData.mudmapUrl) {
          // Check if we need a new page for the mudmap - ensure full image fits
          if (yPosition > pageHeight - 150) { // Increased from 80 to 150 to ensure full image fits
            addNewPage()
            yPosition = 20
          }
          
          pdf.setFontSize(16)
          pdf.setFont('helvetica', 'bold')
          pdf.text('Site Mudmap Guide', 20, yPosition)
          yPosition += 8
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
          pdf.text('Reference image showing roof areas and site layout:', 20, yPosition)
          yPosition += 8
          
          try {
            // Convert mudmap URL to base64 and add to PDF
            const mudmapResponse = await fetch(formData.mudmapUrl)
            const mudmapBlob = await mudmapResponse.blob()
            const mudmapFile = new File([mudmapBlob], 'mudmap.jpg', { type: 'image/jpeg' })
            
            // Add mudmap image to PDF (centered, max width 160mm)
            const mudmapWidth = 160
            const mudmapHeight = 120
            const mudmapX = (pageWidth - mudmapWidth) / 2
            
            await addImageToPDF(mudmapFile, mudmapX, yPosition, mudmapWidth, mudmapHeight)
            yPosition += mudmapHeight + 10
            
            pdf.setFontSize(8)
            pdf.setTextColor(128, 128, 128)
            pdf.text('Mudmap image loaded from webhook', pageWidth / 2, yPosition, { align: 'center' })
            pdf.setTextColor(0, 0, 0)
            yPosition += 8
            
          } catch (error) {
            console.error('Error adding mudmap to PDF:', error)
            pdf.setFontSize(12)
            pdf.setTextColor(128, 128, 128)
            pdf.text('Mudmap image could not be loaded', 20, yPosition)
            pdf.setTextColor(0, 0, 0)
            yPosition += 8
          }
        }
        
        // Add site map image if available
        console.log('🗺️ Checking for site map URL in generatePDFWithImages:', formData.siteMapUrl)
        if (formData.siteMapUrl) {
          // Check if we need a new page for the site map - ensure full image fits
          if (yPosition > pageHeight - 150) { // Increased from 80 to 150 to ensure full image fits
            addNewPage()
            yPosition = 20
          }
          
          pdf.setFontSize(16)
          pdf.setFont('helvetica', 'bold')
          pdf.text('Site Map', 20, yPosition)
          yPosition += 8
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
          pdf.text('Reference image showing site layout and property boundaries:', 20, yPosition)
          yPosition += 8
          
          try {
            // Convert site map URL to base64 and add to PDF
            const siteMapResponse = await fetch(formData.siteMapUrl)
            const siteMapBlob = await siteMapResponse.blob()
            const siteMapFile = new File([siteMapBlob], 'sitemap.jpg', { type: 'image/jpeg' })
            
            // Add site map image to PDF (centered, max width 160mm)
            const siteMapWidth = 160
            const siteMapHeight = 120
            const siteMapX = (pageWidth - siteMapWidth) / 2
            
            await addImageToPDF(siteMapFile, siteMapX, yPosition, siteMapWidth, siteMapHeight)
            yPosition += siteMapHeight + 10
            
            pdf.setFontSize(8)
            pdf.setTextColor(128, 128, 128)
            pdf.text('Site map image loaded from webhook', pageWidth / 2, yPosition, { align: 'center' })
            pdf.setTextColor(0, 0, 0)
            yPosition += 8
            
          } catch (error) {
            console.error('Error adding site map to PDF:', error)
            pdf.setFontSize(12)
            pdf.setTextColor(128, 128, 128)
            pdf.text('Site map image could not be loaded', 20, yPosition)
            pdf.setTextColor(0, 0, 0)
            yPosition += 8
          }
        }
        
    // Add assets information with images
    for (let assetIndex = 0; assetIndex < formData.assets.length; assetIndex++) {
      const asset = formData.assets[assetIndex]
      
      // Always start each asset on a new page for better organization
      if (assetIndex > 0 || yPosition > pageHeight - 100) {
            addNewPage()
            yPosition = 20
          }
          
      // Add asset header with blue gradient background (matching reference PDF)
      const assetHeaderGradientColors = [
        { r: 26, g: 57, b: 105 }, // Dark blue
        { r: 0, g: 183, b: 255 }  // Bright blue/cyan
      ]
      
      // Create smooth gradient effect for asset header
      const assetHeaderGradientSteps = 20
      for (let i = 0; i < assetHeaderGradientSteps; i++) {
        const ratio = i / (assetHeaderGradientSteps - 1)
        const r = Math.round(assetHeaderGradientColors[0].r * (1 - ratio) + assetHeaderGradientColors[1].r * ratio)
        const g = Math.round(assetHeaderGradientColors[0].g * (1 - ratio) + assetHeaderGradientColors[1].g * ratio)
        const b = Math.round(assetHeaderGradientColors[0].b * (1 - ratio) + assetHeaderGradientColors[1].b * ratio)
        
        pdf.setFillColor(r, g, b)
        const rectHeight = 15 / assetHeaderGradientSteps
        pdf.rect(15, yPosition - 5 + (i * rectHeight), pageWidth - 30, rectHeight, 'F')
      }
      
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255) // White text on gradient background
      pdf.text(`Asset ${assetIndex + 1}: ${asset.assetName}`, 20, yPosition + 5)
      yPosition += 20
      
      // Reset text color for content below
      pdf.setTextColor(0, 0, 0) // Black text for content
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
          
      // Roof Areas with images
      if (asset.roofAreas.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('Roof Areas:', 25, yPosition)
        yPosition += 8
        
        for (let areaIndex = 0; areaIndex < asset.roofAreas.length; areaIndex++) {
          const area = asset.roofAreas[areaIndex]
          
          // Add styled roof area header with blue gradient background (matching reference PDF)
          const roofAreaHeaderGradientColors = [
            { r: 26, g: 57, b: 105 }, // Dark blue
            { r: 0, g: 183, b: 255 }  // Bright blue/cyan
          ]
          
          // Create smooth gradient effect for roof area header
          const roofAreaHeaderGradientSteps = 15
          for (let i = 0; i < roofAreaHeaderGradientSteps; i++) {
            const ratio = i / (roofAreaHeaderGradientSteps - 1)
            const r = Math.round(roofAreaHeaderGradientColors[0].r * (1 - ratio) + roofAreaHeaderGradientColors[1].r * ratio)
            const g = Math.round(roofAreaHeaderGradientColors[0].g * (1 - ratio) + roofAreaHeaderGradientColors[1].g * ratio)
            const b = Math.round(roofAreaHeaderGradientColors[0].b * (1 - ratio) + roofAreaHeaderGradientColors[1].b * ratio)
            
            pdf.setFillColor(r, g, b)
            const rectHeight = 12 / roofAreaHeaderGradientSteps
            pdf.rect(20, yPosition - 3 + (i * rectHeight), pageWidth - 40, rectHeight, 'F')
          }
          
          // Header text
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(16)
          pdf.setTextColor(255, 255, 255) // White text on gradient background
          pdf.text(`Roof Area ${areaIndex + 1}: ${area.name}`, 25, yPosition + 5)
          yPosition += 20
          
          // Reset text color for content
          pdf.setTextColor(0, 0, 0)
          
          // Create a styled details box with light background (matching reference PDF)
          pdf.setFillColor(248, 250, 252) // Light gray background
          pdf.rect(20, yPosition - 3, pageWidth - 40, 55, 'F') // Height for 5 rows of details
          
          // Add subtle border
          pdf.setDrawColor(200, 200, 200)
          pdf.setLineWidth(0.5)
          pdf.rect(20, yPosition - 3, pageWidth - 40, 45, 'S')
          
          // Organize details in a 2-column grid layout (matching reference PDF)
          const leftColumn = [
            { label: 'Type', value: area.type || 'Not specified' },
            { label: 'Profile', value: area.profile || 'Not specified' },
            { label: 'Pitch', value: `${area.pitchDeg || 'Not specified'}°` },
            { label: 'Length', value: `${area.length || 'Not specified'}m` },
            { label: 'Membrane', value: area.membrane || 'None' }
          ]
          
          const rightColumn = [
            { label: 'Width', value: `${area.width || 'Not specified'}m` },
            { label: 'Calculated Area', value: `${area.area ? area.area.toFixed(2) : 'Not calculated'}m²` },
            { label: 'Colour', value: area.colour || 'Not specified' },
            { label: 'Thickness (BMT)', value: area.gauge || 'Not specified' }
          ]
          
          // Left column details - properly left-aligned with good spacing
          let detailY = yPosition
          leftColumn.forEach((detail, index) => {
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(10)
            pdf.setTextColor(0, 51, 102) // Dark blue labels
            pdf.text(detail.label, 25, detailY)
            
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(10)
            pdf.setTextColor(0, 0, 0) // Black values
            pdf.text(detail.value, 50, detailY) // 25mm gap between labels and values
            
            detailY += 10
          })
          
          // Right column details - properly left-aligned with good spacing
          detailY = yPosition
          rightColumn.forEach((detail, index) => {
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(10)
            pdf.setTextColor(0, 51, 102) // Dark blue labels
            pdf.text(detail.label, 120, detailY)
            
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(10)
            pdf.setTextColor(0, 0, 0) // Black values
            pdf.text(detail.value, 155, detailY) // 35mm gap between labels and values
            
            detailY += 10
          })
          
          yPosition += 55 // Space for the styled details box
              
          // Add images for this area
              if (area.images && area.images.length > 0) {
            yPosition += 5
            
            // Check if we need a new page for images
            if (yPosition > pageHeight - 50) {
              addNewPage()
              yPosition = 20
            }
            
            pdf.setFont('helvetica', 'bold')
            pdf.text(`    Images for ${area.name}:`, 30, yPosition)
                yPosition += 5
            
                         // Calculate dynamic image layout with minimal padding for maximum image size
             const totalImages = area.images.length
             const imagesPerRow = totalImages <= 3 ? totalImages : Math.min(3, Math.ceil(Math.sqrt(totalImages)))
             const maxImageWidth = Math.min(130, (pageWidth - 15 - (imagesPerRow - 1) * 2) / imagesPerRow) // Maximum width, almost no margin
             const maxImageHeight = Math.min(100, maxImageWidth * 0.8) // Maximum height, maintain aspect ratio
             const imageSpacing = 2 // mm (virtually no spacing between images)
             const marginLeft = 7 // mm (virtually no left margin)
             const marginTop = 3 // mm (virtually no top margin)
            
            for (let imgIndex = 0; imgIndex < area.images.length; imgIndex++) {
              // Check if we need a new page for the image
              const imagesPerPage = imagesPerRow * 3 // 3 rows per page
              if (imgIndex > 0 && imgIndex % imagesPerPage === 0) {
                addNewPage()
                yPosition = 20
              }
              
              // Calculate grid position
              const gridRow = Math.floor((imgIndex % imagesPerPage) / imagesPerRow)
              const gridCol = (imgIndex % imagesPerPage) % imagesPerRow
              
              // Calculate image position with right margin check
              const xPos = marginLeft + (gridCol * (maxImageWidth + imageSpacing))
              const yPos = yPosition + marginTop + (gridRow * (maxImageHeight + 3))
              
              // Ensure image doesn't go off the right edge of the page
              if (xPos + maxImageWidth > pageWidth - 25) {
                // Move to next row if this would overflow
                const newRow = gridRow + 1
                const newYPos = yPosition + marginTop + (newRow * (maxImageHeight + 15))
                if (newYPos + maxImageHeight > pageHeight - 30) {
                  // Need new page
                  addNewPage()
                  yPosition = 20
                  const adjustedYPos = 20 + marginTop + (0 * (maxImageHeight + 15))
                  const adjustedXPos = marginLeft + (0 * (maxImageWidth + imageSpacing))
                  const imageFile = area.images[imgIndex]?.file || area.images[imgIndex]
                  // Ensure we have a File object, not ImageFile
                  if (imageFile && 'file' in imageFile) {
                    await addImageToPDF(imageFile.file, adjustedXPos, adjustedYPos, maxImageWidth, maxImageHeight)
                  } else if (imageFile instanceof File) {
                    await addImageToPDF(imageFile, adjustedXPos, adjustedYPos, maxImageWidth, maxImageHeight)
                  }
                  continue
                }
              }
              
              // Image label removed - cleaner appearance
              
              // No border - clean look
              
                                // Add image
                  const imageFile = area.images[imgIndex]?.file || area.images[imgIndex]
                  // Ensure we have a File object, not ImageFile
                  if (imageFile && 'file' in imageFile) {
                    await addImageToPDF(imageFile.file, xPos, yPos, maxImageWidth, maxImageHeight)
                  } else if (imageFile instanceof File) {
                    await addImageToPDF(imageFile, xPos, yPos, maxImageWidth, maxImageHeight)
                  }
              
              // Update yPosition for next section (after all images per page or end of images)
              if ((imgIndex + 1) % imagesPerPage === 0 || imgIndex === area.images.length - 1) {
                const lastRow = Math.floor(((imgIndex % imagesPerPage) / imagesPerRow))
                yPosition = yPos + maxImageHeight + 5
              }
            }
          }
          
          // Only add spacing if there were images
          if (area.images && area.images.length > 0) {
            yPosition += 10
          }
        }
      }
      
      // Support Width (Battens/Purlins) with images
          if (asset.battens.length > 0) {
        // Add section separator
        yPosition += 10
        if (yPosition > pageHeight - 80) {
              addNewPage()
              yPosition = 20
            }
            
        // Section header with accent color background
        pdf.setFillColor(128, 128, 128) // Dark gray from style guide
        pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
        
        pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(255, 255, 255) // White text on dark gray background
        pdf.text('Support Width (Battens/Purlins)', 20, yPosition + 5)
        yPosition += 20
        
        // Reset text color for content below
        pdf.setTextColor(0, 0, 0) // Black text for content
        
        for (let battenIndex = 0; battenIndex < asset.battens.length; battenIndex++) {
          const batten = asset.battens[battenIndex]
          
              pdf.setFont('helvetica', 'normal')
              const battenDetails = [
                `  Row ${battenIndex + 1}:`,
                `    Type: ${batten.kind}`,
                `    Spacing: ${batten.spacingMm || 'Not specified'}`,
                `    Material: ${batten.material || 'Not specified'}`,
                `    Size: ${batten.size || 'Not specified'}`,
                `    Condition: ${batten.condition || 'Not specified'}`
              ]
              
              battenDetails.forEach(detail => {
            if (yPosition > pageHeight - 40) {
                  addNewPage()
                  yPosition = 20
                }
                pdf.text(detail, 30, yPosition)
                yPosition += 5
              })
              
          // Add images for this batten
              if (batten.images && batten.images.length > 0) {
            yPosition += 3
            
            if (yPosition > pageHeight - 50) {
              addNewPage()
              yPosition = 20
            }
            
            pdf.setFont('helvetica', 'bold')
            pdf.text(`    Images for Row ${battenIndex + 1}:`, 30, yPosition)
                yPosition += 5
            
            // Add images with grid layout (2x3 for 6 images per page)
            const maxImageWidth = 85 // mm (smaller to fit 2 per row with margins)
            const maxImageHeight = 65 // mm (smaller to fit 3 per column with margins)
            const imageSpacing = 25 // mm (spacing between images)
            const marginLeft = 30 // mm (left margin to prevent bleeding)
            const marginTop = 15 // mm (top margin)
            
            for (let imgIndex = 0; imgIndex < batten.images.length; imgIndex++) {
              // Check if we need a new page (after 6 images)
              if (imgIndex > 0 && imgIndex % 6 === 0) {
                addNewPage()
                yPosition = 20
              }
              
              // Calculate grid position
              const gridRow = Math.floor((imgIndex % 6) / 2)
              const gridCol = (imgIndex % 6) % 2
              
              // Calculate image position
              const xPos = marginLeft + (gridCol * (maxImageWidth + imageSpacing))
              const yPos = yPosition + marginTop + (gridRow * (maxImageHeight + 3))
              
              // Image label removed - cleaner appearance
              
              // No border - clean look
              
              const imageFile = batten.images[imgIndex]?.file || batten.images[imgIndex]
              // Ensure we have a File object, not ImageFile
              if (imageFile && 'file' in imageFile) {
                await addImageToPDF(imageFile.file, xPos, yPos, maxImageWidth, maxImageHeight)
              } else if (imageFile instanceof File) {
                await addImageToPDF(imageFile, xPos, yPos, maxImageWidth, maxImageHeight)
              }
              
              // Update yPosition for next section (after all 6 images or end of images)
              if ((imgIndex + 1) % 6 === 0 || imgIndex === batten.images.length - 1) {
                const lastRow = Math.floor(((imgIndex % 6) / 2))
                yPosition = yPos + maxImageHeight + 5
              }
            }
              }
              
              yPosition += 2
        }
          }
          
      // Roof Framing with images
          if (asset.framing.length > 0) {
        // Add section separator
        yPosition += 10
        if (yPosition > pageHeight - 80) {
              addNewPage()
              yPosition = 20
            }
            
        // Section header with accent color background
        pdf.setFillColor(128, 128, 128) // Dark gray from style guide
        pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
        
        pdf.setFontSize(14)
            pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(255, 255, 255) // White text on dark gray background
        pdf.text('Roof Framing', 20, yPosition + 5)
        yPosition += 20
        
        // Reset text color for content below
        pdf.setTextColor(0, 0, 0) // Black text for content
        
        for (let frameIndex = 0; frameIndex < asset.framing.length; frameIndex++) {
          const frame = asset.framing[frameIndex]
          
              pdf.setFont('helvetica', 'normal')
              const frameDetails = [
                `  Row ${frameIndex + 1}:`,
                `    Material: ${frame.material}`,
                `    Spacing: ${frame.spacing || 'Not specified'}`,
                `    Size: ${frame.size || 'Not specified'}`,
                `    Span: ${frame.span || 'Not specified'}`,
                `    Condition: ${frame.condition || 'Not specified'}`
              ]
              
              frameDetails.forEach(detail => {
            if (yPosition > pageHeight - 40) {
                  addNewPage()
                  yPosition = 20
                }
                pdf.text(detail, 30, yPosition)
                yPosition += 5
              })
              
          // Add images for this frame
              if (frame.images && frame.images.length > 0) {
            yPosition += 3
            
            if (yPosition > pageHeight - 50) {
              addNewPage()
              yPosition = 20
            }
            
            pdf.setFont('helvetica', 'bold')
            pdf.text(`    Images for Framing Row ${frameIndex + 1}:`, 30, yPosition)
                yPosition += 5
            
            // Add images for this frame in a 2-column grid layout
            const validFrameImages = frame.images?.filter(img => {
              // Handle both ImageFile objects and direct File objects
              const file = img && typeof img === 'object' && 'file' in img ? img.file : img
              return file && 
                     file instanceof File && 
                     file.size > 0 && 
                     file.name && 
                     file.name.trim() !== ''
            }) || []
            
            console.log(`Framing Row ${frameIndex + 1}: Found ${frame.images?.length || 0} images, ${validFrameImages.length} are valid`)
            
            if (validFrameImages.length > 0) {
              yPosition += 5
              
              // Add styled section header for images
              pdf.setFillColor(0, 183, 255) // Bright blue/cyan background
              pdf.rect(25, yPosition - 3, pageWidth - 50, 10, 'F')
              
              // Add subtle border
              pdf.setDrawColor(0, 150, 200)
              pdf.setLineWidth(0.5)
              pdf.rect(25, yPosition - 3, pageWidth - 50, 10, 'S')
              
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(12)
              pdf.setTextColor(255, 255, 255) // White text on blue background
              pdf.text(`Images for Framing Row ${frameIndex + 1}:`, 30, yPosition + 3)
              yPosition += 15
              
              // Calculate dynamic grid layout with reduced padding for larger images
              const totalImages = validFrameImages.length
              const imagesPerRow = totalImages <= 3 ? totalImages : Math.min(3, Math.ceil(Math.sqrt(totalImages)))
              const maxImageWidth = Math.min(95, (pageWidth - 40 - (imagesPerRow - 1) * 10) / imagesPerRow) // Larger width, less margin
              const maxImageHeight = Math.min(75, maxImageWidth * 0.8) // Larger height, maintain aspect ratio
              const imageSpacing = 10 // Space between images (reduced)
              const leftMargin = 20
              
              for (let imgIndex = 0; imgIndex < validFrameImages.length; imgIndex++) {
                const image = validFrameImages[imgIndex]
                
                try {
                  // Check if we need a new page for the image
                  // Start new page after every imagesPerPage images or if current position is too low
                  const imagesPerPage = imagesPerRow * 3 // 3 rows per page
                  if (imgIndex > 0 && imgIndex % imagesPerPage === 0) {
                    addNewPage()
                    yPosition = 20
                  } else if (yPosition > pageHeight - 100) {
                    addNewPage()
                    yPosition = 20
                  }
                  
                  // Calculate grid position (reset for each page)
                  const pageImageIndex = imgIndex % imagesPerPage
                  const row = Math.floor(pageImageIndex / imagesPerRow)
                  const col = pageImageIndex % imagesPerRow
                  
                  const xPos = leftMargin + (col * (maxImageWidth + imageSpacing))
                  // Always start from the top of the current page (yPosition) and add row offset
                  const yPos = yPosition + (row * (maxImageHeight + 3)) // 3mm spacing between rows (virtually none)
                  
                  // Image caption removed - cleaner appearance
                  
                  // Add image to PDF with dynamic sizing
                  const imageFile = image?.file || image
                  // Ensure we have a File object, not ImageFile
                  if (imageFile && 'file' in imageFile) {
                    await addImageToPDF(imageFile.file, xPos, yPos, maxImageWidth, maxImageHeight)
                  } else if (imageFile instanceof File) {
                    await addImageToPDF(imageFile, xPos, yPos, maxImageWidth, maxImageHeight)
                  }
                  
                  // Image filename removed - cleaner appearance
                  
                  // Update yPosition for next section (after all images in this frame)
                  if (imgIndex === validFrameImages.length - 1) {
                    const totalRows = Math.ceil(validFrameImages.length / imagesPerRow)
                    yPosition = yPos + maxImageHeight + 5 // 5mm below last image row
                  }
                  
                } catch (imgError) {
                  console.error('Error processing image:', imgError)
                  // Don't add error messages to PDF - just log the error
                  // This prevents error placeholders from appearing
                }
              }
              
              // Reset text color
              pdf.setTextColor(0, 0, 0)
            }
              }
              
              yPosition += 2
        }
          }
          
          yPosition += 10
    }
        
        // Add uploaded files information with bright blue header (matching reference PDF)
        const uploadedFiles = []
        if (formData.finalPlan && formData.finalPlan.length > 0) {
          uploadedFiles.push(`Final Plan: ${formData.finalPlan[0].name}`)
        }
        if (formData.finalTakeoff && formData.finalTakeoff.length > 0) {
          uploadedFiles.push(`Final Takeoff: ${formData.finalTakeoff[0].name}`)
        }
        if (formData.powerIsolationImage && formData.powerIsolationImage.length > 0) {
          uploadedFiles.push(`Power Isolation Image: ${formData.powerIsolationImage[0].name}`)
        }
        
        if (uploadedFiles.length > 0) {
          if (yPosition > pageHeight - 60) {
            addNewPage()
            yPosition = 20
          }
          
          // Bright blue header bar (matching reference PDF)
          pdf.setFillColor(0, 183, 255) // Bright blue/cyan from reference PDF
          pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
          
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(255, 255, 255) // White text on bright blue background
          pdf.text('Uploaded Files:', 20, yPosition + 3)
          yPosition += 15
          
          // Reset text color for content below
          pdf.setTextColor(0, 0, 0) // Black text for content
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
          
          uploadedFiles.forEach(file => {
            pdf.text(`  • ${file}`, 25, yPosition)
            yPosition += 5
          })
          
          yPosition += 10
        }
        
        // Add notes if available
        if (formData.notes) {
          if (yPosition > pageHeight - 30) {
            addNewPage()
            yPosition = 20
          }
          
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'bold')
          pdf.text('General Notes:', 20, yPosition)
          yPosition += 8
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
          
          // Split notes into lines that fit the page width
          const words = formData.notes.split(' ')
          let line = ''
          const maxWidth = pageWidth - 40
          
          words.forEach(word => {
            const testLine = line + word + ' '
            const textWidth = pdf.getTextWidth(testLine)
            
            if (textWidth > maxWidth) {
              if (yPosition > pageHeight - 20) {
                addNewPage()
                yPosition = 20
              }
              pdf.text(line, 20, yPosition)
              yPosition += 6
              line = word + ' '
            } else {
              line = testLine
            }
          })
          
          if (line.trim()) {
            if (yPosition > pageHeight - 20) {
              addNewPage()
              yPosition = 20
            }
            pdf.text(line, 20, yPosition)
          }
        }
        
        // Add additional observations section
        if (yPosition > pageHeight - 40) {
          addNewPage()
          yPosition = 20
        }
    
    // Styled section header
    pdf.setFillColor(128, 128, 0) // Olive green from style guide
    pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
        
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255) // White text
    pdf.text('Additional Observations:', 20, yPosition + 5)
    yPosition += 20
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        
        // Add any important observations based on form data
        const observations = []
        
        // Check for high-pitch roofs that might need special equipment
        const hasHighPitch = formData.assets.some(asset => 
          asset.roofAreas.some(area => area.pitchDeg && area.pitchDeg > 30)
        )
        if (hasHighPitch) {
          observations.push('High-pitch roof areas detected - may require special safety equipment')
        }
        
        // Check for multiple roof areas that might indicate complex project
        const roofAreaCount = formData.assets.reduce((total, asset) => total + asset.roofAreas.length, 0)
        if (roofAreaCount > 3) {
          observations.push('Complex roof structure with multiple areas - plan for extended timeline')
        }
        
        // Check for power isolation requirements
        if (formData.isPowerIsolated === 'Yes') {
          observations.push('Power isolation required - ensure electrical safety protocols')
        }
        
        // Check for site access restrictions
        if (formData.siteAccess && formData.siteAccess !== 'None') {
          observations.push(`Site access considerations: ${formData.siteAccess}`)
        }
        
        if (observations.length > 0) {
          observations.forEach(obs => {
            pdf.text(`  • ${obs}`, 25, yPosition)
            yPosition += 5
          })
        } else {
          pdf.text('  • No special observations noted', 25, yPosition)
        }
        
        yPosition += 10
        
        // Add safety considerations section
        if (yPosition > pageHeight - 40) {
          addNewPage()
          yPosition = 20
        }
    
    // Styled section header
    pdf.setFillColor(255, 0, 0) // Red for safety
    pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
        
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255) // White text
    pdf.text('Safety Considerations:', 20, yPosition + 5)
    yPosition += 20
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        
        const safetyNotes = []
        
        // Check for steep roofs
        const hasSteepRoof = formData.assets.some(asset => 
          asset.roofAreas.some(area => area.pitchDeg && area.pitchDeg > 45)
        )
        if (hasSteepRoof) {
          safetyNotes.push('Steep roof areas detected - ensure proper fall protection equipment')
        }
        
        // Check for power isolation
        if (formData.isPowerIsolated === 'Yes') {
          safetyNotes.push('Electrical safety protocols required - power isolation confirmed')
        }
        
        // Check for site access restrictions
        if (formData.siteAccess && formData.siteAccess.includes('Height restriction')) {
          safetyNotes.push('Height restrictions noted - verify equipment clearance requirements')
        }
        
        if (formData.siteAccess && formData.siteAccess.includes('Overhead power nearby')) {
          safetyNotes.push('Overhead power lines nearby - maintain safe working distances')
        }
        
        if (safetyNotes.length > 0) {
          safetyNotes.forEach(note => {
            pdf.text(`  ⚠️ ${note}`, 25, yPosition)
            yPosition += 5
          })
        } else {
          pdf.text('  ✓ No special safety concerns identified', 25, yPosition)
        }
        
        yPosition += 10
        
        // Add material specifications section
        if (yPosition > pageHeight - 40) {
          addNewPage()
          yPosition = 20
        }
    
    // Styled section header
    pdf.setFillColor(0, 183, 255) // Bright blue/cyan from style guide
    pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
        
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255) // White text
    pdf.text('Material Specifications:', 20, yPosition + 5)
    yPosition += 20
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        
        // Collect all unique materials used across all assets
        const materials = new Set<string>()
        const profiles = new Set<string>()
        const membranes = new Set<string>()
        
        formData.assets.forEach(asset => {
          asset.roofAreas.forEach(area => {
            if (area.profile) profiles.add(area.profile)
            if (area.membrane && area.membrane !== 'None') membranes.add(area.membrane)
          })
        })
        
        if (profiles.size > 0) {
          pdf.text('  Roof Profiles Required:', 25, yPosition)
          yPosition += 5
          Array.from(profiles).forEach(profile => {
            pdf.text(`    • ${profile}`, 30, yPosition)
            yPosition += 4
          })
          yPosition += 2
        }
        
        if (membranes.size > 0) {
          pdf.text('  Membranes Required:', 25, yPosition)
          yPosition += 5
          Array.from(membranes).forEach(membrane => {
            pdf.text(`    • ${membrane}`, 30, yPosition)
            yPosition += 4
          })
          yPosition += 2
        }
        
        if (profiles.size === 0 && membranes.size === 0) {
          pdf.text('  • No specific materials specified', 25, yPosition)
        }
        
        yPosition += 10
        
        // Add special requirements section
        const specialRequirements = []
        if (formData.siteAccess && formData.siteAccess !== 'None') {
          specialRequirements.push(`Site Access: ${formData.siteAccess}`)
        }
        if (formData.isPowerIsolated === 'Yes') {
          specialRequirements.push('Power Isolation Required')
        }
        if (formData.customerNotes && formData.customerNotes.trim()) {
          specialRequirements.push(`Customer Notes: ${formData.customerNotes}`)
        }
        
        if (specialRequirements.length > 0) {
          if (yPosition > pageHeight - 40) {
            addNewPage()
            yPosition = 20
          }
          
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'bold')
          pdf.text('Special Requirements & Notes:', 20, yPosition)
          yPosition += 8
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
          
          specialRequirements.forEach(req => {
            pdf.text(`  • ${req}`, 25, yPosition)
            yPosition += 5
          })
          
          yPosition += 10
        }
        
        // Add summary section
        if (yPosition > pageHeight - 40) {
          addNewPage()
          yPosition = 20
        }
        
    // Styled section header with smooth gradient
    const summaryGradientColors = [
      { r: 26, g: 57, b: 105 }, // Dark blue
      { r: 0, g: 183, b: 255 }  // Bright blue/cyan
    ]
    
    // Create smooth gradient effect with many thin rectangles
    const summaryGradientSteps = 25 // More steps for smoother blend
    for (let i = 0; i < summaryGradientSteps; i++) {
      const ratio = i / (summaryGradientSteps - 1)
      const r = Math.round(summaryGradientColors[0].r * (1 - ratio) + summaryGradientColors[1].r * ratio)
      const g = Math.round(summaryGradientColors[0].g * (1 - ratio) + summaryGradientColors[1].g * ratio)
      const b = Math.round(summaryGradientColors[0].b * (1 - ratio) + summaryGradientColors[1].b * ratio)
      
      pdf.setFillColor(r, g, b)
      const rectHeight = 12 / summaryGradientSteps // Distribute height across all steps
      pdf.rect(15, yPosition - 3 + (i * rectHeight), pageWidth - 30, rectHeight, 'F')
    }
    
    pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255) // White text
    pdf.text('Project Summary:', 20, yPosition + 5)
    yPosition += 20
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        
        const totalAssets = formData.assets.length
        const totalRoofAreas = formData.assets.reduce((total, asset) => total + asset.roofAreas.length, 0)
        const totalBattens = formData.assets.reduce((total, asset) => total + asset.battens.length, 0)
        const totalFraming = formData.assets.reduce((total, asset) => total + asset.framing.length, 0)
        const totalServices = formData.roofServices ? formData.roofServices.length : 0
    
    // Count total images
    const totalImages = formData.assets.reduce((total, asset) => {
      return total + 
        asset.roofAreas.reduce((areaTotal, area) => areaTotal + (area.images?.length || 0), 0) +
        asset.battens.reduce((battenTotal, batten) => battenTotal + (batten.images?.length || 0), 0) +
        asset.framing.reduce((frameTotal, frame) => frameTotal + (frame.images?.length || 0), 0)
    }, 0) + (formData.powerIsolationImage?.length || 0)
        
        const summaryDetails = [
          `Total Assets: ${totalAssets}`,
          `Total Roof Areas: ${totalRoofAreas}`,
          `Total Batten/Purlin Rows: ${totalBattens}`,
          `Total Framing Rows: ${totalFraming}`,
          `Total Services Requested: ${totalServices}`,
      `Files Uploaded: ${uploadedFiles.length}`,
      `Total Images Captured: ${totalImages}`
        ]
        
        // Add estimated timeline if we have roof areas
        if (totalRoofAreas > 0) {
          const baseDays = 3 // Base days for any project
          const additionalDays = totalRoofAreas * 0.5 // 0.5 days per roof area
          const estimatedTimeline = Math.round(baseDays + additionalDays)
          
          summaryDetails.push(`Estimated Timeline: ${estimatedTimeline} days`)
        }
        
        summaryDetails.forEach(detail => {
          pdf.text(`  • ${detail}`, 25, yPosition)
          yPosition += 5
        })
        
        yPosition += 10
        
    // Add styled footer
        const totalPages = pdf.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
      
      // Footer background
      pdf.setFillColor(26, 57, 105) // Dark blue
      pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F')
      
      // Footer text
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255) // White text
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 15, { align: 'center' })
      
          pdf.setFontSize(8)
          pdf.setFont('helvetica', 'normal')
      pdf.text('Generated by ARW Roofing Pre-Works Assessment Form', pageWidth / 2, pageHeight - 8, { align: 'center' })
      
      // Add accent line
      pdf.setDrawColor(0, 183, 255) // Bright blue/cyan
      pdf.setLineWidth(2)
      pdf.line(20, pageHeight - 22, pageWidth - 20, pageHeight - 22)
    }
    
    // Test basic styling to ensure it works
    console.log('🧪 Testing basic PDF styling...')
    try {
      // Add a test colored rectangle at the bottom
      pdf.setFillColor(255, 0, 0) // Red
      pdf.rect(20, pageHeight - 50, 50, 20, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.text('TEST', 25, pageHeight - 40)
      console.log('✅ Basic styling test passed')
    } catch (error) {
      console.error('❌ Basic styling test failed:', error)
    }
        
    // Save the PDF
    const fileName = `pre-works-assessment-${new Date().toISOString().split('T')[0]}.pdf`
    console.log('💾 Saving PDF:', fileName)
    pdf.save(fileName)
    console.log('✅ PDF saved successfully')
  }

  const generatePDFWithImages = async (): Promise<Blob> => {
    try {
      // Dynamically import jsPDF only when needed
      const { default: jsPDF } = await import('jspdf')
      
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      // Set PDF properties and metadata
      pdf.setProperties({
        title: 'Pre Works Form',
        subject: 'Pre-Works Assessment Report',
        author: 'ARW Roofing',
        creator: 'ARW Roofing Pre-Works Assessment Form',
        keywords: 'roofing, assessment, pre-works, construction'
      })
      
      // Set the document title using the correct jsPDF method
      pdf.setProperties({
        title: 'Pre Works Form'
      })
      
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let yPosition = 20
      let currentPage = 1
      
      // Helper function to add new page if needed
      const addPageIfNeeded = () => {
        if (yPosition > pageHeight - 40) {
          addNewPage()
          currentPage++
          yPosition = 20
          return true
        }
        return false
      }
      
      // Helper function to add new page (alias for consistency)
      const addNewPage = () => {
        pdf.addPage()
        currentPage++
        yPosition = 20
      }
      
      // Helper function to convert image to base64
      const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }
      
      // Helper function to add image to PDF with proper sizing
      const addImageToPDF = async (imageFile: File, x: number, y: number, maxWidth: number, maxHeight: number) => {
        try {
          const base64 = await convertImageToBase64(imageFile)
          const img = new Image()
          
          return new Promise<void>((resolve, reject) => {
            img.onload = () => {
              // Get original image dimensions
              let { width, height } = img
              const aspectRatio = width / height
              
              // Calculate dimensions to fit within maxWidth x maxHeight while maintaining aspect ratio
              let finalWidth, finalHeight
              
              // Start with the maximum allowed dimensions
              finalWidth = maxWidth
              finalHeight = maxHeight
              
              // Calculate which dimension will be the limiting factor
              if (width > height) {
                // Landscape image - fit to width first
                finalWidth = maxWidth
                finalHeight = maxWidth / aspectRatio
                
                // If height exceeds maxHeight, scale down proportionally
                if (finalHeight > maxHeight) {
                  finalHeight = maxHeight
                  finalWidth = maxHeight * aspectRatio
                }
              } else {
                // Portrait image - fit to height first
                finalHeight = maxHeight
                finalWidth = maxHeight * aspectRatio
                
                // If width exceeds maxWidth, scale down proportionally
                if (finalWidth > maxWidth) {
                  finalWidth = maxWidth
                  finalHeight = maxWidth / aspectRatio
                }
              }
              
              // Ensure minimum size for readability (but don't make images too small)
              const minWidth = Math.max(30, maxWidth * 0.3) // At least 30mm or 30% of max width
              const minHeight = Math.max(20, maxHeight * 0.3) // At least 20mm or 30% of max height
              
              if (finalWidth < minWidth) {
                finalWidth = minWidth
                finalHeight = minWidth / aspectRatio
              }
              if (finalHeight < minHeight) {
                finalHeight = minHeight
                finalWidth = minHeight * aspectRatio
              }
              
              // Ensure we don't exceed maximum dimensions
              finalWidth = Math.min(finalWidth, maxWidth)
              finalHeight = Math.min(finalHeight, maxHeight)
              
              // Add image to PDF with calculated dimensions
              pdf.addImage(base64, 'JPEG', x, y, finalWidth, finalHeight)
              resolve()
            }
            img.onerror = reject
            img.src = base64
          })
        } catch (error) {
          console.error('Error processing image:', error)
          // Don't add placeholder text - just log the error
          // This prevents "Image failed to load" messages from appearing
        }
      }
      
      // Add header with blue gradient banner (matching reference PDF)
      const headerGradientColors = [
        { r: 26, g: 57, b: 105 }, // Dark blue
        { r: 0, g: 183, b: 255 }  // Bright blue/cyan
      ]
      
      // Create smooth gradient effect for header
      const headerGradientSteps = 20
      for (let i = 0; i < headerGradientSteps; i++) {
        const ratio = i / (headerGradientSteps - 1)
        const r = Math.round(headerGradientColors[0].r * (1 - ratio) + headerGradientColors[1].r * ratio)
        const g = Math.round(headerGradientColors[0].g * (1 - ratio) + headerGradientColors[1].g * ratio)
        const b = Math.round(headerGradientColors[0].b * (1 - ratio) + headerGradientColors[1].b * ratio)
        
        pdf.setFillColor(r, g, b)
        const rectHeight = 40 / headerGradientSteps
        pdf.rect(0, i * rectHeight, pageWidth, rectHeight, 'F')
      }
      
      // Add title text
      pdf.setTextColor(255, 255, 255) // White text
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('ARW Roofing Pre-Works Assessment Form', pageWidth / 2, 25, { align: 'center' })
      
      // Reset text color and position
      pdf.setTextColor(0, 0, 0)
      yPosition = 60 // Increased spacing to match reference PDF layout
      
      // Add job information if available with styling
      if (formData.selectedDescription) {
        // Add section background - properly sized to not cut off text
        pdf.setFillColor(26, 57, 105) // Dark blue background to match other sections
        pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F') // Reduced height to 12mm for better proportions
        
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(255, 255, 255) // White text on dark background
        pdf.text('Job Information', 20, yPosition + 3) // Centered text in header
        yPosition += 12 // Match header height
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)
        
        // Try to extract job number from description if it follows a pattern
        const jobMatch = formData.selectedDescription.match(/(\d+)/)
        const jobNumber = jobMatch ? jobMatch[1] : 'N/A'
        
        const jobDetails = [
          ['Job Description:', formData.selectedDescription],
          ['Job Number:', jobNumber],
          ['Assessment Date:', new Date().toLocaleDateString()]
        ]
        
        jobDetails.forEach(([label, value]) => {
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(0, 51, 102) // Dark blue labels for consistency
          pdf.text(label, 20, yPosition)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(0, 0, 0) // Black values
          pdf.text(value, 80, yPosition) // Increased spacing for better readability
          yPosition += 6
        })
        
        yPosition += 6 // Reduced spacing to match reference PDF
      }
      
      // Add form details
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      
      // Add styled section header - properly sized to not cut off text
      pdf.setFillColor(26, 57, 105) // Dark blue background to match other sections
      pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F') // Consistent 12mm height
      
      pdf.setTextColor(255, 255, 255) // White text on dark background
      pdf.text('Project Details', 20, yPosition + 3) // Centered text in header
      yPosition += 12 // Match header height
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(0, 0, 0)
      
      // Basic form information
      const formDetails = [
        ['Job Description:', formData.selectedDescription || 'Not specified'],
        ['Property Type:', formData.propertyType || 'Not specified'],
        ['Age of Property:', formData.ageOfProperty || 'Not specified'],
        ['Property Condition:', formData.propertyCondition || 'Not specified'],
        ['Construction Type:', formData.constructionType || 'Not specified'],
        ['Reporter Name:', formData.reporterName || 'Not specified'],
        ['Location of Structure:', formData.locationOfStructure || 'Not specified'],
        ['Site Access:', formData.siteAccess || 'Not specified'],
        ['Power Isolated:', formData.isPowerIsolated || 'Not specified']
      ]
      
      formDetails.forEach(([label, value]) => {
        addPageIfNeeded()
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 51, 102) // Dark blue labels for consistency
        pdf.text(label, 20, yPosition)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0) // Black values
        pdf.text(value, 80, yPosition) // Increased spacing for better readability
        yPosition += 6
      })
      
      yPosition += 6 // Reduced spacing to match reference PDF
      
      // Add Safety Considerations section with light switch icon (matching reference PDF)
      if (yPosition > pageHeight - 60) {
        addNewPage()
        yPosition = 20
      }
      
      // Safety section header with light switch icon
      pdf.setFillColor(255, 0, 0) // Red background for safety (matching reference PDF)
      pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
      
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255) // White text on red background
      pdf.text('Safety Considerations:', 20, yPosition + 3) // Removed problematic emoji
      yPosition += 15
      
      // Reset text color for content below
      pdf.setTextColor(0, 0, 0) // Black text for content
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      
      // Add safety considerations based on form data
      const safetyNotes = []
      
      // Check for power isolation
      if (formData.isPowerIsolated === 'Yes') {
        safetyNotes.push('Electrical safety protocols required - power isolation confirmed')
      }
      
      // Check for site access restrictions
      if (formData.siteAccess && formData.siteAccess.includes('Height restriction')) {
        safetyNotes.push('Height restrictions noted - verify equipment clearance requirements')
      }
      
      if (formData.siteAccess && formData.siteAccess.includes('Overhead power nearby')) {
        safetyNotes.push('Overhead power lines nearby - maintain safe working distances')
      }
      
      if (safetyNotes.length > 0) {
        safetyNotes.forEach(note => {
          pdf.text(`  • ${note}`, 25, yPosition)
          yPosition += 6
        })
      } else {
        pdf.text('  • No special safety concerns identified', 25, yPosition)
        yPosition += 6
      }
      
      yPosition += 6 // Reduced spacing after safety section
      
      // Add Material Specifications section (matching reference PDF)
      if (yPosition > pageHeight - 60) {
        addNewPage()
        yPosition = 20
      }
      
      // Material specifications section header
      pdf.setFillColor(0, 183, 255) // Bright blue background (matching reference PDF)
      pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
      
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255) // White text on bright blue background
      pdf.text('Material Specifications:', 20, yPosition + 3)
      yPosition += 15
      
      // Reset text color for content below
      pdf.setTextColor(0, 0, 0) // Black text for content
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      
      // Collect all unique materials used across all assets
      const profiles = new Set<string>()
      const membranes = new Set<string>()
      
      formData.assets.forEach(asset => {
        asset.roofAreas.forEach(area => {
          if (area.profile) profiles.add(area.profile)
          if (area.membrane && area.membrane !== 'None') membranes.add(area.membrane)
        })
      })
      
      if (profiles.size > 0) {
        pdf.text('  Roof Profiles Required:', 25, yPosition)
        yPosition += 5
        Array.from(profiles).forEach(profile => {
          pdf.text(`    • ${profile}`, 30, yPosition)
          yPosition += 5
        })
        yPosition += 3
      }
      
      if (membranes.size > 0) {
        pdf.text('  Membranes Required:', 25, yPosition)
        yPosition += 5
        Array.from(membranes).forEach(membrane => {
          pdf.text(`    • ${membrane}`, 30, yPosition)
          yPosition += 5
        })
        yPosition += 3
      }
      
      if (profiles.size === 0 && membranes.size === 0) {
        pdf.text('  • No specific materials specified', 25, yPosition)
        yPosition += 5
      }
      
      yPosition += 6 // Reduced spacing after materials section
      
      // Add roof services information with bright blue header (matching reference PDF)
      if (formData.roofServices && formData.roofServices.length > 0) {
        // Bright blue header bar
        pdf.setFillColor(0, 183, 255) // Bright blue/cyan from reference PDF
        pdf.rect(15, yPosition - 3, pageWidth - 30, 12, 'F')
        
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(255, 255, 255) // White text on bright blue background
        pdf.text('Requested Roof Services:', 20, yPosition + 3)
        yPosition += 15
        
        // Reset text color for content below
        pdf.setTextColor(0, 0, 0) // Black text for content
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        
        formData.roofServices.forEach((service, index) => {
          pdf.text(`  • ${service}`, 25, yPosition)
          yPosition += 5
        })
        
        yPosition += 10
      }
      
      // Add mudmap guide image if available
      if (formData.mudmapUrl) {
        // Check if we need a new page for the mudmap - ensure full image fits
        if (yPosition > pageHeight - 150) { // Increased from 80 to 150 to ensure full image fits
          addNewPage()
          yPosition = 20
        }
        
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Site Mudmap Guide', 20, yPosition)
        yPosition += 8
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.text('Reference image showing roof areas and site layout:', 20, yPosition)
        yPosition += 8
        
        try {
          // Convert mudmap URL to base64 and add to PDF
          const mudmapResponse = await fetch(formData.mudmapUrl)
          const mudmapBlob = await mudmapResponse.blob()
          const mudmapFile = new File([mudmapBlob], 'mudmap.jpg', { type: 'image/jpeg' })
          
          // Add mudmap image to PDF (centered, max width 160mm)
          const mudmapWidth = 160
          const mudmapHeight = 120
          const mudmapX = (pageWidth - mudmapWidth) / 2
          
          await addImageToPDF(mudmapFile, mudmapX, yPosition, mudmapWidth, mudmapHeight)
          yPosition += mudmapHeight + 10
          
          pdf.setFontSize(8)
          pdf.setTextColor(128, 128, 128)
          pdf.text('Mudmap image loaded from webhook', pageWidth / 2, yPosition, { align: 'center' })
          pdf.setTextColor(0, 0, 0)
          yPosition += 8
          
        } catch (error) {
          console.error('Error adding mudmap to PDF:', error)
          pdf.setFontSize(12)
          pdf.setTextColor(128, 128, 128)
          pdf.text('Mudmap image could not be loaded', 20, yPosition)
          pdf.setTextColor(0, 0, 0)
          yPosition += 8
        }
      }
      
      // Add site map image if available
      console.log('🗺️ Checking for site map URL:', formData.siteMapUrl)
      if (formData.siteMapUrl) {
        // Check if we need a new page for the site map - ensure full image fits
        if (yPosition > pageHeight - 150) { // Increased from 80 to 150 to ensure full image fits
          addNewPage()
          yPosition = 20
        }
        
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Site Map', 20, yPosition)
        yPosition += 8
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.text('Reference image showing site layout and property boundaries:', 20, yPosition)
        yPosition += 8
        
        try {
          // Convert site map URL to base64 and add to PDF
          const siteMapResponse = await fetch(formData.siteMapUrl)
          const siteMapBlob = await siteMapResponse.blob()
          const siteMapFile = new File([siteMapBlob], 'sitemap.jpg', { type: 'image/jpeg' })
          
          // Add site map image to PDF (centered, max width 160mm)
          const siteMapWidth = 160
          const siteMapHeight = 120
          const siteMapX = (pageWidth - siteMapWidth) / 2
          
          await addImageToPDF(siteMapFile, siteMapX, yPosition, siteMapWidth, siteMapHeight)
          yPosition += siteMapHeight + 10
          
          pdf.setFontSize(8)
          pdf.setTextColor(128, 128, 128)
          pdf.text('Site map image loaded from webhook', pageWidth / 2, yPosition, { align: 'center' })
          pdf.setTextColor(0, 0, 0)
          yPosition += 8
          
        } catch (error) {
          console.error('Error adding site map to PDF:', error)
          pdf.setFontSize(12)
          pdf.setTextColor(128, 128, 128)
          pdf.text('Site map image could not be loaded', 20, yPosition)
          pdf.setTextColor(0, 0, 0)
          yPosition += 8
        }
      }
      
      // Add assets information with images
      for (let assetIndex = 0; assetIndex < formData.assets.length; assetIndex++) {
        const asset = formData.assets[assetIndex]
        
        addPageIfNeeded()
        
        // Add styled asset header with gradient background
        const assetHeaderGradientColors = [
          { r: 26, g: 57, b: 105 }, // Dark blue
          { r: 0, g: 183, b: 255 }  // Bright blue/cyan
        ]
        
        // Create smooth gradient effect for header
        const assetHeaderGradientSteps = 20
        for (let i = 0; i < assetHeaderGradientSteps; i++) {
          const ratio = i / (assetHeaderGradientSteps - 1)
          const r = Math.round(assetHeaderGradientColors[0].r * (1 - ratio) + assetHeaderGradientColors[1].r * ratio)
          const g = Math.round(assetHeaderGradientColors[0].g * (1 - ratio) + assetHeaderGradientColors[1].g * ratio)
          const b = Math.round(assetHeaderGradientColors[0].b * (1 - ratio) + assetHeaderGradientColors[1].b * ratio)
          
          pdf.setFillColor(r, g, b)
          const rectHeight = 15 / assetHeaderGradientSteps
          pdf.rect(15, yPosition - 5 + (i * rectHeight), pageWidth - 30, rectHeight, 'F')
        }
        
        // Add subtle border
        pdf.setDrawColor(0, 150, 200)
        pdf.setLineWidth(0.8)
        pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'S')
        
        pdf.setFontSize(18)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(255, 255, 255) // White text on gradient background
        pdf.text(`Asset ${assetIndex + 1}: ${asset.assetName}`, 20, yPosition + 5)
        yPosition += 20
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)
        
        // Roof Areas with images
        if (asset.roofAreas && asset.roofAreas.length > 0) {
          // Ensure we have enough space for the roof areas section
          if (yPosition > pageHeight - 80) {
            addNewPage()
            yPosition = 20
          }
          
          console.log(`Roof areas section started at Y position: ${yPosition}, Page: ${currentPage}`)
          
          for (let areaIndex = 0; areaIndex < asset.roofAreas.length; areaIndex++) {
            const area = asset.roofAreas[areaIndex]
            
            // Ensure we have enough space for the roof area row (header + details + images)
            const requiredSpace = 100 // Approximate space needed for roof area row
            if (yPosition > pageHeight - requiredSpace) {
              addNewPage()
              yPosition = 20
            }
            
            // Styled section header with gradient background
            const headerGradientColors = [
              { r: 26, g: 57, b: 105 }, // Dark blue
              { r: 0, g: 183, b: 255 }  // Bright blue/cyan
            ]
            
            // Create smooth gradient effect for header
            const headerGradientSteps = 15
            for (let i = 0; i < headerGradientSteps; i++) {
              const ratio = i / (headerGradientSteps - 1)
              const r = Math.round(headerGradientColors[0].r * (1 - ratio) + headerGradientColors[1].r * ratio)
              const g = Math.round(headerGradientColors[0].g * (1 - ratio) + headerGradientColors[1].g * ratio)
              const b = Math.round(headerGradientColors[0].b * (1 - ratio) + headerGradientColors[1].b * ratio)
              
              pdf.setFillColor(r, g, b)
              const rectHeight = 12 / headerGradientSteps
              pdf.rect(20, yPosition - 3 + (i * rectHeight), pageWidth - 40, rectHeight, 'F')
            }
            
            // Header text
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(16)
            pdf.setTextColor(255, 255, 255) // White text on gradient background
            pdf.text(`Roof Area ${areaIndex + 1}: ${area.name}`, 25, yPosition + 5)
            yPosition += 20
            
            console.log(`Roof Area ${areaIndex + 1} at Y position: ${yPosition}, Page: ${currentPage}`)
            
            // Reset text color for content
            pdf.setTextColor(0, 0, 0)
            
            // Create a styled details box with light background
            pdf.setFillColor(248, 250, 252) // Light gray background
            pdf.rect(20, yPosition - 3, pageWidth - 40, 55, 'F') // Height for 5 rows of details
            
            // Add subtle border
            pdf.setDrawColor(200, 200, 200)
            pdf.setLineWidth(0.5)
            pdf.rect(20, yPosition - 3, pageWidth - 40, 45, 'S')
            
            // Organize details in a 2-column grid layout
            const leftColumn = [
              { label: 'Type', value: area.type || 'Not specified' },
              { label: 'Profile', value: area.profile || 'Not specified' },
              { label: 'Pitch', value: `${area.pitchDeg || 'Not specified'}°` },
              { label: 'Length', value: `${area.length || 'Not specified'}m` },
              { label: 'Membrane', value: area.membrane || 'None' }
            ]
            
            const rightColumn = [
              { label: 'Width', value: `${area.width || 'Not specified'}m` },
              { label: 'Calculated Area', value: `${area.area ? area.area.toFixed(2) : 'Not calculated'}m²` },
              { label: 'Colour', value: area.colour || 'Not specified' },
              { label: 'Thickness (BMT)', value: area.gauge || 'Not specified' }
            ]
            
            // Left column details - properly left-aligned with good spacing
            let detailY = yPosition
            leftColumn.forEach((detail, index) => {
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(10)
              pdf.setTextColor(0, 51, 102) // Dark blue labels
              pdf.text(detail.label, 25, detailY)
              
              pdf.setFont('helvetica', 'normal')
              pdf.setFontSize(10)
              pdf.setTextColor(0, 0, 0) // Black values
              pdf.text(detail.value, 50, detailY) // 25mm gap between labels and values
              
              detailY += 10
            })
            
            // Right column details - properly left-aligned with good spacing
            detailY = yPosition
            rightColumn.forEach((detail, index) => {
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(10)
              pdf.setTextColor(0, 51, 102) // Dark blue labels
              pdf.text(detail.label, 120, detailY)
              
              pdf.setFont('helvetica', 'normal')
              pdf.setFontSize(10)
              pdf.setTextColor(0, 0, 0) // Black values
              pdf.text(detail.value, 155, detailY) // 35mm gap between labels and values
              
              detailY += 10
            })
            
            yPosition += 55 // Space for the styled details box
            
            // Add images for this area in a 2-column grid layout
            // Only show image section if there are valid images with actual file objects
            const validImages = area.images?.filter(img => {
              // Handle both ImageFile objects and direct File objects
              const file = img && typeof img === 'object' && 'file' in img ? img.file : img
              return file && 
                     file instanceof File && 
                     file.size > 0 && 
                     file.name && 
                     file.name.trim() !== ''
            }) || []
            
            console.log(`Area ${area.name}: Found ${area.images?.length || 0} images, ${validImages.length} are valid`)
            
            if (validImages.length > 0) {
              yPosition += 5
              
              // Create folder-like header with asset name and section type
              const folderName = `Pre-Works Assessment Report - ${asset.assetName} - Roof Areas`
              
              // Add styled section header for images with folder-like appearance
              pdf.setFillColor(0, 183, 255) // Bright blue/cyan background
              pdf.rect(25, yPosition - 3, pageWidth - 50, 12, 'F')
              
              // Add subtle border
              pdf.setDrawColor(0, 150, 200)
              pdf.setLineWidth(0.5)
              pdf.rect(25, yPosition - 3, pageWidth - 50, 12, 'S')
              
              // Add folder icon representation (small rectangle)
              pdf.setFillColor(255, 255, 255)
              pdf.rect(30, yPosition, 8, 6, 'F')
              pdf.setDrawColor(0, 150, 200)
              pdf.rect(30, yPosition, 8, 6, 'S')
              
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(12)
              pdf.setTextColor(255, 255, 255) // White text on blue background
              pdf.text(folderName, 45, yPosition + 5)
              yPosition += 20
              
              // Calculate dynamic grid layout with minimal padding for maximum image size
              const totalImages = validImages.length
              const imagesPerRow = totalImages <= 3 ? totalImages : Math.min(3, Math.ceil(Math.sqrt(totalImages)))
              const maxImageWidth = Math.min(130, (pageWidth - 15 - (imagesPerRow - 1) * 2) / imagesPerRow) // Maximum width, almost no margin
              const maxImageHeight = Math.min(100, maxImageWidth * 0.8) // Maximum height, maintain aspect ratio
              const imageSpacing = 2 // Space between images (virtually none)
              const leftMargin = 7
              
              for (let imgIndex = 0; imgIndex < validImages.length; imgIndex++) {
                const image = validImages[imgIndex]
                
                try {
                  // Check if we need a new page for the image
                  // Start new page after every imagesPerPage images or if current position is too low
                  const imagesPerPage = imagesPerRow * 3 // 3 rows per page
                  if (imgIndex > 0 && imgIndex % imagesPerPage === 0) {
                    addNewPage()
                    yPosition = 20
                  } else if (yPosition > pageHeight - 100) {
                    addNewPage()
                    yPosition = 20
                  }
                  
                  // Additional check: Ensure we have enough space for this image row
                  const currentRow = Math.floor((imgIndex % imagesPerPage) / imagesPerRow)
                  const requiredHeight = yPosition + (currentRow * (maxImageHeight + 25)) + maxImageHeight + 30 // 30mm for caption and description
                  if (requiredHeight > pageHeight - 20) {
                    addNewPage()
                    yPosition = 20
                  }
                  
                  // Ensure proper positioning after page breaks
                  if (yPosition === 20) {
                    // We're on a new page, ensure proper spacing from top
                    yPosition = 20
                  }
                  
                  // Calculate grid position (reset for each page)
                  const pageImageIndex = imgIndex % imagesPerPage
                  const row = Math.floor(pageImageIndex / imagesPerRow)
                  const col = pageImageIndex % imagesPerRow
                  
                  const xPos = leftMargin + (col * (maxImageWidth + imageSpacing))
                  // Always start from the top of the current page (yPosition) and add row offset
                  const yPos = yPosition + (row * (maxImageHeight + 3)) // 3mm spacing between rows (virtually none)
                  
                  // Image caption removed - cleaner appearance
                  
                  // Add image to PDF with dynamic sizing
                  const imageFile = image?.file || image
                  // Ensure we have a File object, not ImageFile
                  if (imageFile && 'file' in imageFile) {
                    await addImageToPDF(imageFile.file, xPos, yPos, maxImageWidth, maxImageHeight)
                  } else if (imageFile instanceof File) {
                    await addImageToPDF(imageFile, xPos, yPos, maxImageWidth, maxImageHeight)
                  }
                  
                  // Image filename removed - cleaner appearance
                  
                  // Update yPosition for next section (after all images in this area)
                  if (imgIndex === validImages.length - 1) {
                    const totalRows = Math.ceil(validImages.length / imagesPerRow)
                    yPosition = yPos + maxImageHeight + 5 // 5mm below last image row
                  }
                  
                  // Ensure proper spacing for next content after images
                  if (imgIndex === validImages.length - 1) {
                    yPosition += 10 // Add extra space before next section
                  }
                  
                } catch (imgError) {
                  console.error('Error processing image:', imgError)
                  // Don't add error messages to PDF - just log the error
                  // This prevents error placeholders from appearing
                }
              }
              
              // Reset text color
              pdf.setTextColor(0, 0, 0)
            }
            
            // Only add spacing if there were valid images
            if (validImages.length > 0) {
              yPosition += 5
            }
          }
        }
        
        // Support Width (Battens/Purlins) with images
        if (asset.battens && asset.battens.length > 0) {
          // Ensure we have enough space for the batten section header
          if (yPosition > pageHeight - 60) {
            addNewPage()
            yPosition = 20
          }
          
          // Styled section header with gradient background
          const battenHeaderGradientColors = [
            { r: 128, g: 128, b: 128 }, // Dark gray
            { r: 180, g: 180, b: 180 }  // Light gray
          ]
          
          // Create smooth gradient effect for header
          const battenHeaderGradientSteps = 12
          for (let i = 0; i < battenHeaderGradientSteps; i++) {
            const ratio = i / (battenHeaderGradientSteps - 1)
            const r = Math.round(battenHeaderGradientColors[0].r * (1 - ratio) + battenHeaderGradientColors[1].r * ratio)
            const g = Math.round(battenHeaderGradientColors[0].g * (1 - ratio) + battenHeaderGradientColors[1].g * ratio)
            const b = Math.round(battenHeaderGradientColors[0].b * (1 - ratio) + battenHeaderGradientColors[1].b * ratio)
            
            pdf.setFillColor(r, g, b)
            const rectHeight = 12 / battenHeaderGradientSteps
            pdf.rect(20, yPosition - 3 + (i * rectHeight), pageWidth - 40, rectHeight, 'F')
          }
          
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(16)
          pdf.setTextColor(255, 255, 255) // White text on gradient background
          pdf.text('Support Width (Battens/Purlins):', 25, yPosition + 5)
          yPosition += 20
          
          console.log(`Batten section started at Y position: ${yPosition}, Page: ${currentPage}`)
          
          for (let battenIndex = 0; battenIndex < asset.battens.length; battenIndex++) {
            const batten = asset.battens[battenIndex]
            
            // Ensure we have enough space for the batten row (header + details + images)
            const requiredSpace = 80 // Approximate space needed for batten row
            if (yPosition > pageHeight - requiredSpace) {
              addNewPage()
              yPosition = 20
            }
            
            // Styled batten row header with accent color
            pdf.setFillColor(240, 248, 255) // Light blue background
            pdf.rect(25, yPosition - 3, pageWidth - 50, 10, 'F')
            
            console.log(`Batten Row ${battenIndex + 1} at Y position: ${yPosition}, Page: ${currentPage}`)
            
            // Add subtle border
            pdf.setDrawColor(200, 200, 200)
            pdf.setLineWidth(0.3)
            pdf.rect(25, yPosition - 3, pageWidth - 50, 10, 'S')
            
            // Row header
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(12)
            pdf.setTextColor(0, 51, 102) // Dark blue text
            pdf.text(`Row ${battenIndex + 1}:`, 30, yPosition + 3)
            yPosition += 15
            
            // Create a styled details box
            pdf.setFillColor(252, 252, 252) // Very light gray background
            pdf.rect(25, yPosition - 3, pageWidth - 50, 30, 'F') // Height for 3 rows
            
            // Add subtle border
            pdf.setDrawColor(220, 220, 220)
            pdf.setLineWidth(0.3)
            pdf.rect(25, yPosition - 3, pageWidth - 50, 30, 'S')
            
            // Organize details in a 2-column grid layout
            const battenLeftColumn = [
              { label: 'Type', value: batten.kind },
              { label: 'Spacing', value: batten.spacingMm || 'Not specified' }
            ]
            
            const battenRightColumn = [
              { label: 'Material', value: batten.material || 'Not specified' },
              { label: 'Size', value: batten.size || 'Not specified' }
            ]
            
            // Left column details
            let battenDetailY = yPosition
            battenLeftColumn.forEach((detail, index) => {
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(9)
              pdf.setTextColor(0, 51, 102) // Dark blue labels
              pdf.text(detail.label, 30, battenDetailY)
              
              pdf.setFont('helvetica', 'normal')
              pdf.setFontSize(9)
              pdf.setTextColor(0, 0, 0) // Black values
              pdf.text(detail.value, 55, battenDetailY)
              
              battenDetailY += 8
            })
            
            // Right column details
            battenDetailY = yPosition
            battenRightColumn.forEach((detail, index) => {
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(9)
              pdf.setTextColor(0, 51, 102) // Dark blue labels
              pdf.text(detail.label, 130, battenDetailY)
              
              pdf.setFont('helvetica', 'normal')
              pdf.setFontSize(9)
              pdf.setTextColor(0, 0, 0) // Black values
              pdf.text(detail.value, 155, battenDetailY)
              
              battenDetailY += 8
            })
            
            // Add condition info below the grid (full width)
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(9)
            pdf.setTextColor(0, 51, 102) // Dark blue label
            pdf.text('Condition', 30, yPosition + 20)
            
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(9)
            pdf.setTextColor(0, 0, 0) // Black value
            pdf.text(batten.condition || 'Not specified', 55, yPosition + 20)
            
            yPosition += 40 // Space for the styled details box
            
            // Add images for this batten in a 2-column grid layout
            // Only show image section if there are valid images
            const validBattenImages = batten.images?.filter(img => {
              // Handle both ImageFile objects and direct File objects
              const file = img && typeof img === 'object' && 'file' in img ? img.file : img
              return file && 
                     file instanceof File && 
                     file.size > 0 && 
                     file.name && 
                     file.name.trim() !== ''
            }) || []
            
            console.log(`Batten Row ${battenIndex + 1}: Found ${batten.images?.length || 0} images, ${validBattenImages.length} are valid`)
            
            if (validBattenImages.length > 0) {
              yPosition += 5
              
              // Create folder-like header with asset name and section type
              const folderName = `Pre-Works Assessment Report - ${asset.assetName} - Battens`
              
              // Add styled section header for images with folder-like appearance
              pdf.setFillColor(0, 183, 255) // Bright blue/cyan background
              pdf.rect(25, yPosition - 3, pageWidth - 50, 12, 'F')
              
              // Add subtle border
              pdf.setDrawColor(0, 150, 200)
              pdf.setLineWidth(0.5)
              pdf.rect(25, yPosition - 3, pageWidth - 50, 12, 'S')
              
              // Add folder icon representation (small rectangle)
              pdf.setFillColor(255, 255, 255)
              pdf.rect(30, yPosition, 8, 6, 'F')
              pdf.setDrawColor(0, 150, 200)
              pdf.rect(30, yPosition, 8, 6, 'S')
              
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(12)
              pdf.setTextColor(255, 255, 255) // White text on blue background
              pdf.text(folderName, 45, yPosition + 5)
              yPosition += 20
              
              // Calculate dynamic grid layout with minimal padding for maximum image size
              const totalImages = validBattenImages.length
              const imagesPerRow = totalImages <= 3 ? totalImages : Math.min(3, Math.ceil(Math.sqrt(totalImages)))
              const maxImageWidth = Math.min(130, (pageWidth - 15 - (imagesPerRow - 1) * 2) / imagesPerRow) // Maximum width, almost no margin
              const maxImageHeight = Math.min(100, maxImageWidth * 0.8) // Maximum height, maintain aspect ratio
              const imageSpacing = 2 // Space between images (virtually none)
              const leftMargin = 7
              
              for (let imgIndex = 0; imgIndex < validBattenImages.length; imgIndex++) {
                const image = validBattenImages[imgIndex]
                
                try {
                  // Check if we need a new page for the image
                  // Start new page after every imagesPerPage images or if current position is too low
                  const imagesPerPage = imagesPerRow * 3 // 3 rows per page
                  if (imgIndex > 0 && imgIndex % imagesPerPage === 0) {
                    addNewPage()
                    yPosition = 20
                  } else if (yPosition > pageHeight - 100) {
                    addNewPage()
                    yPosition = 20
                  }
                  
                  // Additional check: Ensure we have enough space for this image row
                  const currentRow = Math.floor((imgIndex % imagesPerPage) / imagesPerRow)
                  const requiredHeight = yPosition + (currentRow * (maxImageHeight + 25)) + maxImageHeight + 30 // 30mm for caption and description
                  if (requiredHeight > pageHeight - 20) {
                    addNewPage()
                    yPosition = 20
                  }
                  
                  // Calculate grid position (reset for each page)
                  const pageImageIndex = imgIndex % imagesPerPage
                  const row = Math.floor(pageImageIndex / imagesPerRow)
                  const col = pageImageIndex % imagesPerRow
                  
                  const xPos = leftMargin + (col * (maxImageWidth + imageSpacing))
                  // Always start from the top of the current page (yPosition) and add row offset
                  const yPos = yPosition + (row * (maxImageHeight + 3)) // 3mm spacing between rows (virtually none)
                  
                  // Image caption removed - cleaner appearance
                  
                  // Add image to PDF with dynamic sizing
                  const imageFile = image?.file || image
                  // Ensure we have a File object, not ImageFile
                  if (imageFile && 'file' in imageFile) {
                    await addImageToPDF(imageFile.file, xPos, yPos, maxImageWidth, maxImageHeight)
                  } else if (imageFile instanceof File) {
                    await addImageToPDF(imageFile, xPos, yPos, maxImageWidth, maxImageHeight)
                  }
                  
                  // Image filename removed - cleaner appearance
                  
                  // Update yPosition for next section (after all images in this batten)
                  if (imgIndex === validBattenImages.length - 1) {
                    const totalRows = Math.ceil(validBattenImages.length / imagesPerRow)
                    yPosition = yPos + maxImageHeight + 5 // 5mm below last image row
                  }
                  
                } catch (imgError) {
                  console.error('Error processing image:', imgError)
                  // Don't add error messages to PDF - just log the error
                  // This prevents error placeholders from appearing
                }
              }
              
              // Reset text color
              pdf.setTextColor(0, 0, 0)
            }
            
            // Only add spacing if there were valid images
            if (validBattenImages.length > 0) {
              yPosition += 5
            }
          }
        }
        
        // Roof Framing with images
        if (asset.framing && asset.framing.length > 0) {
          // Ensure we have enough space for the framing section
          if (yPosition > pageHeight - 80) {
            addNewPage()
            yPosition = 20
          }
          
          console.log(`Framing section started at Y position: ${yPosition}, Page: ${currentPage}`)
          
          // Styled section header with gradient background
          const framingHeaderGradientColors = [
            { r: 128, g: 128, b: 128 }, // Dark gray
            { r: 180, g: 180, b: 180 }  // Light gray
          ]
          
          // Create smooth gradient effect for header
          const framingHeaderGradientSteps = 12
          for (let i = 0; i < framingHeaderGradientSteps; i++) {
            const ratio = i / (framingHeaderGradientSteps - 1)
            const r = Math.round(framingHeaderGradientColors[0].r * (1 - ratio) + framingHeaderGradientColors[1].r * ratio)
            const g = Math.round(framingHeaderGradientColors[0].g * (1 - ratio) + framingHeaderGradientColors[1].g * ratio)
            const b = Math.round(framingHeaderGradientColors[0].b * (1 - ratio) + framingHeaderGradientColors[1].b * ratio)
            
            pdf.setFillColor(r, g, b)
            const rectHeight = 12 / framingHeaderGradientSteps
            pdf.rect(20, yPosition - 3 + (i * rectHeight), pageWidth - 40, rectHeight, 'F')
          }
          
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(16)
          pdf.setTextColor(255, 255, 255) // White text on gradient background
          pdf.text('Roof Framing:', 25, yPosition + 5)
          yPosition += 20
          
          for (let frameIndex = 0; frameIndex < asset.framing.length; frameIndex++) {
            const frame = asset.framing[frameIndex]
            
            // Ensure we have enough space for the framing row (header + details + images)
            const requiredSpace = 80 // Approximate space needed for framing row
            if (yPosition > pageHeight - requiredSpace) {
              addNewPage()
              yPosition = 20
            }
            
            // Styled frame row header with accent color
            pdf.setFillColor(240, 248, 255) // Light blue background
            pdf.rect(25, yPosition - 3, pageWidth - 50, 10, 'F')
            
            // Add subtle border
            pdf.setDrawColor(200, 200, 200)
            pdf.setLineWidth(0.3)
            pdf.rect(25, yPosition - 3, pageWidth - 50, 10, 'S')
            
            // Row header
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(12)
            pdf.setTextColor(0, 51, 102) // Dark blue text
            pdf.text(`Row ${frameIndex + 1}:`, 30, yPosition + 3)
            yPosition += 15
            
            console.log(`Framing Row ${frameIndex + 1} at Y position: ${yPosition}, Page: ${currentPage}`)
            
            // Create a styled details box
            pdf.setFillColor(252, 252, 252) // Very light gray background
            pdf.rect(25, yPosition - 3, pageWidth - 50, 30, 'F') // Height for 3 rows
            
            // Add subtle border
            pdf.setDrawColor(220, 220, 220)
            pdf.setLineWidth(0.3)
            pdf.rect(25, yPosition - 3, pageWidth - 50, 30, 'S')
            
            // Organize details in a 2-column grid layout
            const frameLeftColumn = [
              { label: 'Material', value: frame.material },
              { label: 'Spacing', value: frame.spacing || 'Not specified' }
            ]
            
            const frameRightColumn = [
              { label: 'Size', value: frame.size || 'Not specified' },
              { label: 'Span', value: frame.span || 'Not specified' }
            ]
            
            // Left column details
            let frameDetailY = yPosition
            frameLeftColumn.forEach((detail, index) => {
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(9)
              pdf.setTextColor(0, 51, 102) // Dark blue labels
              pdf.text(detail.label, 30, frameDetailY)
              
              pdf.setFont('helvetica', 'normal')
              pdf.setFontSize(9)
              pdf.setTextColor(0, 0, 0) // Black values
              pdf.text(detail.value, 55, frameDetailY)
              
              frameDetailY += 8
            })
            
            // Right column details
            frameDetailY = yPosition
            frameRightColumn.forEach((detail, index) => {
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(9)
              pdf.setTextColor(0, 51, 102) // Dark blue labels
              pdf.text(detail.label, 130, frameDetailY)
              
              pdf.setFont('helvetica', 'normal')
              pdf.setFontSize(9)
              pdf.setTextColor(0, 0, 0) // Black values
              pdf.text(detail.value, 155, frameDetailY)
              
              frameDetailY += 8
            })
            
            // Add condition info below the grid (full width)
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(9)
            pdf.setTextColor(0, 51, 102) // Dark blue label
            pdf.text('Condition', 30, yPosition + 20)
            
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(9)
            pdf.setTextColor(0, 0, 0) // Black value
            pdf.text(frame.condition || 'Not specified', 55, yPosition + 20)
            
            yPosition += 40 // Space for the styled details box
            
            // Add images for this frame in a 2-column grid layout
            // Only show image section if there are valid images with actual file objects
            const validFrameImages = frame.images?.filter(img => {
              // Handle both ImageFile objects and direct File objects
              const file = img && typeof img === 'object' && 'file' in img ? img.file : img
              return file && 
                     file instanceof File && 
                     file.size > 0 && 
                     file.name && 
                     file.name.trim() !== ''
            }) || []
            
            console.log(`Framing Row ${frameIndex + 1}: Found ${frame.images?.length || 0} images, ${validFrameImages.length} are valid`)
            
            if (validFrameImages.length > 0) {
              yPosition += 5
              
              // Add styled section header for images
              pdf.setFillColor(0, 183, 255) // Bright blue/cyan background
              pdf.rect(25, yPosition - 3, pageWidth - 50, 10, 'F')
              
              // Add subtle border
              pdf.setDrawColor(0, 150, 200)
              pdf.setLineWidth(0.5)
              pdf.rect(25, yPosition - 3, pageWidth - 50, 10, 'S')
              
              pdf.setFont('helvetica', 'bold')
              pdf.setFontSize(12)
              pdf.setTextColor(255, 255, 255) // White text on blue background
              pdf.text(`Images for Framing Row ${frameIndex + 1}:`, 30, yPosition + 3)
              yPosition += 15
              
              // Calculate dynamic grid layout with reduced padding for larger images
              const totalImages = validFrameImages.length
              const imagesPerRow = totalImages <= 3 ? totalImages : Math.min(3, Math.ceil(Math.sqrt(totalImages)))
              const maxImageWidth = Math.min(95, (pageWidth - 40 - (imagesPerRow - 1) * 10) / imagesPerRow) // Larger width, less margin
              const maxImageHeight = Math.min(75, maxImageWidth * 0.8) // Larger height, maintain aspect ratio
              const imageSpacing = 10 // Space between images (reduced)
              const leftMargin = 20
              
              for (let imgIndex = 0; imgIndex < validFrameImages.length; imgIndex++) {
                const image = validFrameImages[imgIndex]
                
                try {
                  // Check if we need a new page for the image
                  // Start new page after every imagesPerPage images or if current position is too low
                  const imagesPerPage = imagesPerRow * 3 // 3 rows per page
                  if (imgIndex > 0 && imgIndex % imagesPerPage === 0) {
                    addNewPage()
                    yPosition = 20
                  } else if (yPosition > pageHeight - 100) {
                    addNewPage()
                    yPosition = 20
                  }
                  
                  // Additional check: Ensure we have enough space for this image row
                  const currentRow = Math.floor((imgIndex % imagesPerPage) / imagesPerRow)
                  const requiredHeight = yPosition + (currentRow * (maxImageHeight + 25)) + maxImageHeight + 30 // 30mm for caption and description
                  if (requiredHeight > pageHeight - 20) {
                    addNewPage()
                    yPosition = 20
                  }
                  
                  // Calculate grid position (reset for each page)
                  const pageImageIndex = imgIndex % imagesPerPage
                  const row = Math.floor(pageImageIndex / imagesPerRow)
                  const col = pageImageIndex % imagesPerRow
                  
                  const xPos = leftMargin + (col * (maxImageWidth + imageSpacing))
                  // Always start from the top of the current page (yPosition) and add row offset
                  const yPos = yPosition + (row * (maxImageHeight + 3)) // 3mm spacing between rows (virtually none)
                  
                  // Image caption removed - cleaner appearance
                  
                  // Add image to PDF with dynamic sizing
                  const imageFile = image?.file || image
                  // Ensure we have a File object, not ImageFile
                  if (imageFile && 'file' in imageFile) {
                    await addImageToPDF(imageFile.file, xPos, yPos, maxImageWidth, maxImageHeight)
                  } else if (imageFile instanceof File) {
                    await addImageToPDF(imageFile, xPos, yPos, maxImageWidth, maxImageHeight)
                  }
                  
                  // Image filename removed - cleaner appearance
                  
                  // Update yPosition for next section (after all images in this frame)
                  if (imgIndex === validFrameImages.length - 1) {
                    const totalRows = Math.ceil(validFrameImages.length / imagesPerRow)
                    yPosition = yPos + maxImageHeight + 5 // 5mm below last image row
                  }
                  
                } catch (imgError) {
                  console.error('Error processing image:', imgError)
                  // Don't add error messages to PDF - just log the error
                  // This prevents error placeholders from appearing
                }
              }
              
              // Reset text color
              pdf.setTextColor(0, 0, 0)
            }
            
            // Only add spacing if there were valid images
            if (validFrameImages.length > 0) {
              yPosition += 5
            }
          }
        }
        
        yPosition += 10
      }
      
      // Add notes if available
      if (formData.notes) {
        addPageIfNeeded()
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('General Notes:', 20, yPosition)
        yPosition += 8
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        
        // Split notes into lines that fit the page width
        const words = formData.notes.split(' ')
        let line = ''
        const maxWidth = pageWidth - 40
        
        words.forEach(word => {
          const testLine = line + word + ' '
          const textWidth = pdf.getTextWidth(testLine)
          
          if (textWidth > maxWidth) {
            addPageIfNeeded()
            pdf.text(line, 20, yPosition)
            yPosition += 6
            line = word + ' '
          } else {
            line = testLine
          }
        })
        
        if (line.trim()) {
          addPageIfNeeded()
          pdf.text(line, 20, yPosition)
        }
      }
      
      // Add footer to all pages (matching reference PDF)
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        
        // Dark blue footer bar (matching reference PDF)
        pdf.setFillColor(26, 57, 105) // Dark blue
        pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F')
        
        // Footer text in white
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(255, 255, 255) // White text
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 15, { align: 'right' })
        
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        pdf.text('Generated by ARW Roofing Pre-Works Assessment Form', pageWidth / 2, pageHeight - 8, { align: 'center' })
      }
      
      // Convert PDF to blob instead of saving
      const pdfBlob = pdf.output('blob')
      console.log('PDF with images generated successfully as blob')
      return pdfBlob
      
    } catch (error) {
      console.error('Error generating PDF with images:', error)
      throw error
    }
  }

      return (
    <div className="space-y-4">
      {/* Export Button */}
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Generating PDF with Images...
          </>
        ) : (
          <>
            📄 Export as PDF (with Images)
          </>
        )}
      </Button>

      {/* Submit Button - Generate PDF and include it in webhook submission */}
      <Button
        onClick={async () => {
          try {
            setIsGenerating(true)
            
            // Generate PDF and get it as a blob instead of downloading
            const pdfBlob = await generatePDFWithImages()
            console.log('PDF generated as blob, size:', pdfBlob.size)
            
            // Create FormData with PDF included
            const submitFormData = new FormData()
            
            // Add the PDF file
            const pdfFile = new File([pdfBlob], `pre-works-assessment-${new Date().toISOString().split('T')[0]}.pdf`, { type: 'application/pdf' })
            submitFormData.append('pdf', pdfFile)
            console.log('PDF added to FormData:', pdfFile.name)
            
            // Add all the existing form data
            submitFormData.append('formData', JSON.stringify(formData))
            
            // Add Job Description and Job Number separately for webhook processing
            if (formData.selectedDescription) {
              submitFormData.append('jobDescription', formData.selectedDescription)
              
              // Use the actual jobId from the selected job (pulled from sheets)
              const jobNumber = jobId || 'N/A'
              submitFormData.append('jobNumber', jobNumber)
              
              console.log('Added job details to webhook:', { jobDescription: formData.selectedDescription, jobNumber })
            }
            
            // Add all images from assets
            formData.assets.forEach((asset, assetIndex) => {
              // Roof areas images
              asset.roofAreas.forEach((area, areaIndex) => {
                if (area.images && area.images.length > 0) {
                  console.log(`Processing ${area.images.length} images for ${asset.assetName} - ${area.name}`)
                  area.images.forEach((image, imageIndex) => {
                    console.log(`Image ${imageIndex}:`, image)
                    console.log(`Image file type:`, typeof image.file)
                    console.log(`Image file constructor:`, image.file?.constructor?.name)
                    console.log(`Image file instanceof File:`, image.file instanceof File)
                    console.log(`Image file instanceof Blob:`, image.file instanceof Blob)
                    
                    // Ensure we have a valid File/Blob object before appending to FormData
                    if (image && image.file) {
                      const fileObj = image.file as any;
                      if (fileObj instanceof File || fileObj instanceof Blob) {
                        const fileName = fileObj instanceof File ? fileObj.name : `image_${imageIndex}`;
                        console.log(`Adding valid image: ${fileName}`)
                        submitFormData.append(`asset_${assetIndex}_area_${areaIndex}_image_${imageIndex}`, fileObj, fileName)
                      } else {
                        console.warn(`File object is not a File or Blob:`, fileObj)
                      }
                    } else {
                      console.warn(`Invalid image object at index ${imageIndex}:`, image)
                    }
                  })
                }
              })
              
              // Battens images
              asset.battens.forEach((batten, battenIndex) => {
                if (batten.images && batten.images.length > 0) {
                  console.log(`Processing ${batten.images.length} images for ${asset.assetName} - Batten ${battenIndex}`)
                  batten.images.forEach((image, imageIndex) => {
                    console.log(`Batten Image ${imageIndex}:`, image)
                    // Ensure we have a valid File/Blob object before appending to FormData
                    if (image && image.file) {
                      const fileObj = image.file as any;
                      if (fileObj instanceof File || fileObj instanceof Blob) {
                        const fileName = fileObj instanceof File ? fileObj.name : `batten_image_${imageIndex}`;
                        console.log(`Adding valid batten image: ${fileName}`)
                        submitFormData.append(`asset_${assetIndex}_batten_${battenIndex}_image_${imageIndex}`, fileObj, fileName)
                      } else {
                        console.warn(`Batten file object is not a File or Blob:`, fileObj)
                      }
                    } else {
                      console.warn(`Invalid batten image object at index ${imageIndex}:`, image)
                    }
                  })
                }
              })
              
              // Framing images
              asset.framing.forEach((frame, frameIndex) => {
                if (frame.images && frame.images.length > 0) {
                  console.log(`Processing ${frame.images.length} images for ${asset.assetName} - Frame ${frameIndex}`)
                  frame.images.forEach((image, imageIndex) => {
                    console.log(`Frame Image ${imageIndex}:`, image)
                    // Ensure we have a valid File/Blob object before appending to FormData
                    if (image && image.file) {
                      const fileObj = image.file as any;
                      if (fileObj instanceof File || fileObj instanceof Blob) {
                        const fileName = fileObj instanceof File ? fileObj.name : `frame_image_${imageIndex}`;
                        console.log(`Adding valid frame image: ${fileName}`)
                        submitFormData.append(`asset_${assetIndex}_framing_${frameIndex}_image_${imageIndex}`, fileObj, fileName)
                      } else {
                        console.warn(`Frame file object is not a File or Blob:`, fileObj)
                      }
                    } else {
                      console.warn(`Invalid frame image object at index ${imageIndex}:`, image)
                    }
                  })
                }
              })
            })
            
            // Add mudmap if exists
            if (formData.mudmapUrl) {
              submitFormData.append('mudmap', formData.mudmapUrl)
            }
            
            // Add site map if exists
            if (formData.siteMapUrl) {
              submitFormData.append('siteMap', formData.siteMapUrl)
            }
            
                          // Add power isolation image if exists
              if (formData.powerIsolationImage) {
                // Convert FileList to individual files
                Array.from(formData.powerIsolationImage).forEach((file, index) => {
                  submitFormData.append(`powerIsolationImage`, file)
                })
              }
            
            console.log('Submitting FormData with PDF included...')
            
            // Submit to webhook
            const response = await fetch(CONFIG.webhookUrl, {
              method: 'POST',
              body: submitFormData
            })
            
            if (response.ok) {
              alert('✅ Form submitted successfully! PDF and all data have been sent to the webhook.')
            } else {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
          } catch (error) {
            console.error('Error submitting form:', error)
            alert('❌ Error submitting form. Please try again.')
          } finally {
            setIsGenerating(false)
          }
        }}
        disabled={isGenerating}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Submitting...
          </>
        ) : (
          <>
            📤 Submit Form with PDF Included
          </>
        )}
      </Button>
    </div>
  )
}

const AdminPreWorksForm: React.FC = () => {
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState<FormValues>(() => {
    // Try to load saved form data from localStorage
    const saved = localStorage.getItem('preWorksFormData')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.log('Failed to parse saved form data')
      }
    }
    
    // Default form data
    return {
      selectedDescription: '',
      notes: '',
      mudmapUrl: '',
      siteMapUrl: '',
      assets: [
        {
          assetName: 'Main House',
                  roofAreas: [
          { name: 'Area A', type: '', profile: '', pitchDeg: null, colour: '', gauge: '', membrane: '', length: null, width: null, area: null, images: [] },
        ],
          battens: [
            { kind: 'Batten', spacingMm: '600 centres', material: 'Timber', size: '', condition: 'Good', images: [] }
          ],
          framing: [
            { material: 'Timber', spacing: '', size: '', span: '', condition: 'Good', images: [] }
          ],
        },
      ],
    }
  })

  // Auto-save form data to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('preWorksFormData', JSON.stringify(formData))
    }, 1000) // Save after 1 second of inactivity
    
    return () => clearTimeout(timeoutId)
  }, [formData])

  // Debug form data changes
  useEffect(() => {
    if (formData.siteMapUrl) {
      console.log('🔄 Form data updated - siteMapUrl:', formData.siteMapUrl)
    }
  }, [formData.siteMapUrl])

  // Show auto-save notification
  const [showAutoSave, setShowAutoSave] = useState(false)
  // Mudmap generation state
  const [isGeneratingMudmap, setIsGeneratingMudmap] = useState(false)
  const [mudmapError, setMudmapError] = useState<string | null>(null)
  useEffect(() => {
    setShowAutoSave(true)
    const timer = setTimeout(() => setShowAutoSave(false), 2000)
    return () => clearTimeout(timer)
  }, [formData])

  // Dark mode state - DISABLED FOR NOW (can be re-enabled later)
  // const [isDarkMode, setIsDarkMode] = useState(false);
  
  // useEffect(() => {
  //   // Check system preference and localStorage
  //   const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   const savedPreference = localStorage.getItem('darkMode');
  //   
  //   if (savedPreference !== null) {
  //     setIsDarkMode(savedPreference === 'true');
  //   } else {
  //     setIsDarkMode(systemPrefersDark);
  //   }
  // }, []);
  
  // useEffect(() => {
  //   // Apply/remove dark class
  //   if (isDarkMode) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [isDarkMode]);
  
  // const toggleDarkMode = () => {
  //   const newMode = !isDarkMode;
  //   setIsDarkMode(newMode);
  //   localStorage.setItem('darkMode', newMode.toString());
  // };
  
  // const resetToSystemPreference = () => {
  //   const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   setIsDarkMode(systemPrefersDark);
  //   localStorage.removeItem('darkMode');
  // };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save form (Cmd/Ctrl + S)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        // Auto-save is already handled by useEffect
      }
      
      // Submit form (Cmd/Ctrl + Enter)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        // Handle form submission
      }
      
      // Toggle dark mode (Cmd/Ctrl + T) - DISABLED FOR NOW
      // if ((e.metaKey || e.ctrlKey) && e.key === 't') {
      //   e.preventDefault()
      //   toggleDarkMode()
      // }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Enhanced validation helper
  const getFieldValidation = (value: any, required: boolean = false) => {
    if (!required) return { isValid: true, message: '' }
    
    if (!value || String(value).trim() === '') {
      return { isValid: false, message: 'This field is required' }
    }
    
    return { isValid: true, message: '' }
  }

  // Jobs
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [jobId, setJobId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  } | null>(null)

  // Timestamps
  const now = useMemo(() => new Date(), [])
  const attendanceDate = fmtDate.format(now)
  const attendanceTime = fmtTime.format(now)
  const dateSubmitted = attendanceDate

  // Load jobs
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(CONFIG.sheetApiUrl)
        if (!res.ok) throw new Error(`Jobs load failed (${res.status})`)
        const data = await res.json()
        if (mounted) setJobs(data)
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setIsLoadingJobs(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Sync selectedDescription → selectedJob + jobId
  useEffect(() => {
    if (!formData.selectedDescription) { setSelectedJob(null); setJobId(''); return }
    const matched = jobs.find(j => j.description === formData.selectedDescription) || null
    setSelectedJob(matched)
    setJobId(matched?.jobId || '')
  }, [formData.selectedDescription, jobs])

  // Helper numeric parser to keep number|null
  const toNumberOrNull = (v: string) => {
    if (!v && v !== '0') return null
    const n = Number(v)
    return Number.isNaN(n) ? null : n
  }

  // Form handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate mudmap and site map when job description is selected
    if (field === 'selectedDescription' && value) {
      // Clear existing mudmap and site map when new job is selected
      setFormData(prev => ({ ...prev, mudmapUrl: '', siteMapUrl: '' }))
      // Clear any previous mudmap errors
      setMudmapError(null)
      // Generate new mudmap and site map for the selected job
      generateMudmap(value)
      generateSiteMap(value)
    }
  }

  // Generate mudmap from job description
  const generateMudmap = async (jobDescription: string) => {
    setIsGeneratingMudmap(true)
    setMudmapError(null)
    
    try {
      // Get the correct job ID for this description
      const matchedJob = jobs.find(j => j.description === jobDescription)
      const correctJobId = matchedJob?.jobId || ''
      
      // Prepare webhook payload
      const payload = {
        jobDescription,
        jobNumber: correctJobId,
        timestamp: new Date().toISOString(),
        requestId: `mudmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      
      // Call your webhook automation to generate mudmap
      const response = await fetch('https://n8n.wayvvault.cc/webhook/image-load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          jobNumber: correctJobId,
          timestamp: new Date().toISOString(),
          requestId: `mudmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
      })
      
      if (!response.ok) {
        // Try to get error details from response
        let errorDetails = ''
        try {
          const errorData = await response.text()
          errorDetails = ` - ${errorData}`
          
          // Check for specific n8n error messages
          if (errorData.includes('No item to return got found')) {
            throw new Error('n8n workflow completed but no data was returned. Check workflow output configuration.')
          }
        } catch (e) {
          errorDetails = ' - Could not read error details'
        }
        throw new Error(`Webhook failed: ${response.status}${errorDetails}`)
      }
      
      const data = await response.json()
      
      // Extract image URL from ImgBB response
      if (data && data.data && data.data.image && data.data.image.url) {
        const mudmapUrl = data.data.image.url
        setFormData(prev => ({ ...prev, mudmapUrl }))
      } else {
        throw new Error('No valid image URL found in webhook response. Check response structure.')
      }
      
    } catch (error) {
      console.error('Error generating mudmap:', error)
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          setMudmapError('Webhook endpoint unreachable. Please check if https://n8n.wayvvault.cc/webhook/image-load is running.')
        } else {
          setMudmapError(`Error: ${error.message}`)
        }
      } else {
        setMudmapError('Failed to generate mudmap - unknown error')
      }
    } finally {
      setIsGeneratingMudmap(false)
    }
  }

  // Generate site map from job description
  const generateSiteMap = async (jobDescription: string) => {
    console.log('🗺️ Generating site map for:', jobDescription)
    try {
      // Get the correct job ID for this description
      const matchedJob = jobs.find(j => j.description === jobDescription)
      const correctJobId = matchedJob?.jobId || ''
      console.log('🔍 Found job ID:', correctJobId)
      
      // Call your webhook automation to generate site map
      console.log('📡 Calling site map webhook...')
      const response = await fetch('https://n8n.wayvvault.cc/webhook/site-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          jobNumber: correctJobId,
          timestamp: new Date().toISOString(),
          requestId: `sitemap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
      })
      
      if (!response.ok) {
        throw new Error(`Site map webhook failed: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📥 Site map webhook response:', data)
      
      // Extract image URL from response
      if (data && data.siteMapUrl) {
        console.log('✅ Found siteMapUrl:', data.siteMapUrl)
        setFormData(prev => {
          console.log('🔄 Setting siteMapUrl in form state:', data.siteMapUrl)
          return { ...prev, siteMapUrl: data.siteMapUrl }
        })
      } else if (data && data.data && data.data.image && data.data.image.url) {
        // Fallback to ImgBB format
        console.log('✅ Found ImgBB URL:', data.data.image.url)
        setFormData(prev => {
          console.log('🔄 Setting siteMapUrl in form state (ImgBB):', data.data.image.url)
          return { ...prev, siteMapUrl: data.data.image.url }
        })
      } else {
        console.error('❌ No valid site map URL found in response')
        throw new Error('No valid site map URL found in webhook response')
      }
      
    } catch (error) {
      console.error('Error generating site map:', error)
      // Don't show error to user for site map - it's optional
    }
  }

  const handleAssetChange = (assetIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? { ...asset, [field]: value } : asset
      )
    }))
  }

  const handleRoofAreaChange = (assetIndex: number, areaIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? {
          ...asset,
          roofAreas: asset.roofAreas.map((area, aIndex) => 
            aIndex === areaIndex ? { ...area, [field]: value } : area
          )
        } : asset
      )
    }))
  }

  const handleBattenChange = (assetIndex: number, battenIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? {
          ...asset,
          battens: asset.battens.map((batten, bIndex) => 
            bIndex === battenIndex ? { ...batten, [field]: value } : batten
          )
        } : asset
      )
    }))
  }

  const handleFramingChange = (assetIndex: number, framingIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? {
          ...asset,
          framing: asset.framing.map((frame, fIndex) => 
            fIndex === framingIndex ? { ...frame, [field]: value } : frame
          )
        } : asset
      )
    }))
  }

  // Add/remove assets and sections
  const addAsset = () => {
    setFormData(prev => ({
      ...prev,
      assets: [...prev.assets, {
        assetName: `Shed ${prev.assets.length + 1}`,
        roofAreas: [{ name: `Area ${String.fromCharCode(65 + prev.assets.length)}`, type: '', profile: '', pitchDeg: null, colour: '', gauge: '', membrane: '', length: null, width: null, area: null, images: [] }],
        battens: [
          { kind: 'Batten', spacingMm: '600 centres', material: 'Timber', size: '', condition: 'Good', images: [] }
        ],
        framing: [
          { material: 'Timber', spacing: '', size: '', span: '', condition: 'Good', images: [] }
        ],
      }]
    }))
  }

  const removeAsset = (assetIndex: number) => {
    if (formData.assets.length > 1) {
      setFormData(prev => ({
        ...prev,
        assets: prev.assets.filter((_, index) => index !== assetIndex)
      }))
    }
  }

  const addRoofArea = (assetIndex: number) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? {
          ...asset,
          roofAreas: [...asset.roofAreas, { 
            name: `Area ${String.fromCharCode(65 + asset.roofAreas.length)}`, 
            type: '', profile: '', pitchDeg: null, colour: '', gauge: '', membrane: '', length: null, width: null, area: null, images: [] 
          }]
        } : asset
      )
    }))
  }

  const removeRoofArea = (assetIndex: number, areaIndex: number) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? {
          ...asset,
          roofAreas: asset.roofAreas.filter((_, aIndex) => aIndex !== areaIndex)
        } : asset
      )
    }))
  }

  const addBatten = (assetIndex: number) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? {
          ...asset,
          battens: [...asset.battens, { kind: 'Batten', spacingMm: '600 centres', material: 'Timber', size: '', condition: 'Good', images: [] }]
        } : asset
      )
    }))
  }

  const removeBatten = (assetIndex: number, battenIndex: number) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? {
          ...asset,
          battens: asset.battens.filter((_, bIndex) => bIndex !== battenIndex)
        } : asset
      )
    }))
  }

  const addFraming = (assetIndex: number) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? {
          ...asset,
          framing: [...asset.framing, { material: 'Timber', spacing: '', size: '', span: '', condition: 'Good', images: [] }]
        } : asset
      )
    }))
  }

  const removeFraming = (assetIndex: number, framingIndex: number) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, index) => 
        index === assetIndex ? {
          ...asset,
          framing: asset.framing.filter((_, fIndex) => fIndex !== framingIndex)
        } : asset
      )
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    // Show loading state
    setIsSubmitting(true)

    try {
      // Prepare structured data for n8n automation
      const formPayload = {
        // Metadata
        formType: 'pre_works_assessment',
        version: '1.0',
        submittedAt: new Date().toISOString(),
        source: 'ARW Roofing Website',
        
        // Job Information
        job: {
          id: jobId,
          number: selectedJob.number,
          description: formData.selectedDescription,
          clientName: selectedJob.clientName,
          reporterName: formData.reporterName || '',
          status: 'pending_review'
        },

        // Timestamps
        timestamps: {
          attendanceDate,
          attendanceTime,
          dateSubmitted,
          submittedAt: new Date().toISOString()
        },

        // Site Assessment
        site: {
          locationOfStructure: formData.locationOfStructure || '',
          locationOther: formData.locationOther || '',
          siteAccess: formData.siteAccess || '',
          customerNotes: formData.customerNotes || '',
          accessRestrictions: formData.siteAccess ? formData.siteAccess.split(',').map(s => s.trim()) : []
        },

        // Property Details
        property: {
          type: formData.propertyType || '',
          age: formData.ageOfProperty || '',
          condition: formData.propertyCondition || '',
          constructionType: formData.constructionType || '',
          powerIsolation: {
            isIsolated: formData.isPowerIsolated || '',
            imageUploaded: formData.powerIsolationImage && formData.powerIsolationImage.length > 0
          }
        },

        // Roof Services Required
        services: {
          requested: formData.roofServices || [],
          totalServices: (formData.roofServices || []).length
        },

        // Asset Assessment
        assets: formData.assets || [],

        // Additional Notes
        notes: formData.notes || '',

        // Form Validation
        validation: {
          isComplete: true,
          missingFields: [],
          hasImages: formData.powerIsolationImage && formData.powerIsolationImage.length > 0
        }
      }

      // Create FormData for file uploads
      const fd = new FormData()
      
      // Append the structured JSON data
      fd.append('formData', JSON.stringify(formPayload))
      
      // Append individual fields for backward compatibility
      fd.append('form', 'pre_works_v1')
      fd.append('jobId', jobId)
      fd.append('jobDescription', formData.selectedDescription)
      fd.append('jobNumber', selectedJob.number)
      fd.append('clientName', selectedJob.clientName)
      fd.append('reporterName', formData.reporterName || '')
      fd.append('attendanceDate', attendanceDate)
      fd.append('attendanceTime', attendanceTime)
      fd.append('dateSubmitted', dateSubmitted)
      fd.append('locationOfStructure', formData.locationOfStructure || '')
      fd.append('locationOther', formData.locationOther || '')
      fd.append('siteAccess', formData.siteAccess || '')
      fd.append('customerNotes', formData.customerNotes || '')
      fd.append('isPowerIsolated', formData.isPowerIsolated || '')
      fd.append('propertyType', formData.propertyType || '')
      fd.append('ageOfProperty', formData.ageOfProperty || '')
      fd.append('propertyCondition', formData.propertyCondition || '')
      fd.append('constructionType', formData.constructionType || '')
      fd.append('roofServices', (formData.roofServices || []).join(','))
      fd.append('assetsJson', JSON.stringify(formData.assets, (_k, v) => (v === null ? '' : v)))
      fd.append('notes', formData.notes)

      // Append images if they exist
      if (formData.powerIsolationImage && formData.powerIsolationImage.length > 0) {
        fd.append('powerIsolationImage', formData.powerIsolationImage[0])
      }

      // Append final plan and takeoff files if they exist
      if (formData.finalPlan && formData.finalPlan.length > 0) {
        fd.append('finalPlan', formData.finalPlan[0])
      }
      
      if (formData.finalTakeoff && formData.finalTakeoff.length > 0) {
        fd.append('finalTakeoff', formData.finalTakeoff[0])
      }

      // Append all asset images
      if (formData.assets && formData.assets.length > 0) {
        formData.assets.forEach((asset, assetIndex) => {
          // Asset roof area images
          if (asset.roofAreas) {
            asset.roofAreas.forEach((area, areaIndex) => {
              if (area.images && area.images.length > 0) {
                area.images.forEach((image, imageIndex) => {
                  fd.append(`asset_${assetIndex}_area_${areaIndex}_image_${imageIndex}`, image.file)
                })
              }
            })
          }
          
          // Asset batten/purlin images
          if (asset.battens) {
            asset.battens.forEach((batten, battenIndex) => {
              if (batten.images && batten.images.length > 0) {
                batten.images.forEach((image, imageIndex) => {
                  fd.append(`asset_${assetIndex}_batten_${battenIndex}_image_${imageIndex}`, image.file)
                })
              }
            })
          }
          
          // Asset framing images
          if (asset.framing) {
            asset.framing.forEach((frame, frameIndex) => {
              if (frame.images && frame.images.length > 0) {
                frame.images.forEach((image, imageIndex) => {
                  fd.append(`asset_${assetIndex}_framing_${frameIndex}_image_${imageIndex}`, image.file)
                })
              }
            })
          }
        })
      }

      // Log the data being sent to n8n for debugging
      console.log('🚀 Sending data to n8n webhook:', {
        url: CONFIG.webhookUrl,
        formPayload,
        formDataEntries: Array.from(fd.entries())
      })
      
      // Send to n8n webhook
      const res = await fetch(CONFIG.webhookUrl, { 
        method: 'POST', 
        body: fd,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!res.ok) {
        let errorMessage = `Webhook submission failed (${res.status})`
        try { 
          const errorData = await res.json()
          if (errorData?.message) errorMessage = errorData.message
          if (errorData?.error) errorMessage = errorData.error
        } catch {}
        throw new Error(errorMessage)
      }

      // Parse response from n8n
      const responseData = await res.json().catch(() => ({}))
      
      console.log('n8n webhook response:', responseData)
      
      // Handle successful submission
      const ref = responseData?.ref || responseData?.jobId || responseData?.id || jobId
      const successMessage = responseData?.message || 'Pre-works assessment submitted successfully!'
      
      // Show success notification
      setNotification({
        type: 'success',
        message: successMessage,
        show: true
      })
      
      // Auto-hide notification after 5 seconds (no redirect)
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch (err: any) {
      console.error('Form submission error:', err)
      
      // Enhanced error handling
      let errorMessage = 'An error occurred while submitting the form. Please try again.'
      
      if (err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.message.includes('webhook')) {
        errorMessage = 'Server error. Please contact support if the problem persists.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setNotification({
        type: 'error',
        message: `Submission Failed: ${errorMessage}`,
        show: true
      })
      
      // Auto-hide error notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Notification Banner */}
      {notification && (
        <div className={cn(
          "fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg max-w-md",
          notification.type === 'success' && "bg-green-100 border border-green-300 text-green-800",
          notification.type === 'error' && "bg-red-100 border border-red-300 text-red-800",
          notification.type === 'info' && "bg-blue-100 border border-blue-300 text-blue-800"
        )}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
      
      <div className="p-2 sm:p-4 mt-8">
        <div className="max-w-4xl mx-auto w-full">
          <Card className="overflow-hidden">
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="text-center text-xl sm:text-2xl">Pre‑Works Form</CardTitle>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-2">
                {showAutoSave && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Auto-saved
                  </div>
                )}
                
                {/* Theme Indicator - Shows current mode and allows reset */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-xs">
                    {/* Dark Mode Indicator - DISABLED FOR NOW */}
                    {/* {isDarkMode ? '🌙' : '☀️'} 
                    {isDarkMode ? 'Dark' : 'Light'} Mode */}
                  </span>
                  <button
                    onClick={() => {
                      // Reset to system preference - DISABLED FOR NOW
                      // resetToSystemPreference()
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                    title="Reset to system preference"
                  >
                    Reset
                  </button>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
                      localStorage.removeItem('preWorksFormData')
                      window.location.reload()
                    }
                  }}
                >
                  Clear Form
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8" noValidate>
                {/* Form Progress Tracker */}
                <FormProgressTracker formData={formData} />
                
                {/* --- Step 1: Job & Attendance --- */}
                <section className="space-y-4">
                  <h2 className="text-lg font-medium">Job & Attendance</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Job Description</Label>
                      <div className="relative">
                        <Select value={formData.selectedDescription} onValueChange={(value) => handleInputChange('selectedDescription', value)} disabled={isLoadingJobs}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={isLoadingJobs ? 'Loading jobs…' : 'Search jobs…'} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <div className="px-3 py-2">
                              <Input 
                                placeholder="Search jobs..." 
                                className="mb-2"
                                onChange={(e) => {
                                  // Filter jobs based on search
                                  const searchTerm = e.target.value.toLowerCase()
                                  const filteredJobs = jobs.filter(j => 
                                    j.description.toLowerCase().includes(searchTerm) ||
                                    j.clientName.toLowerCase().includes(searchTerm) ||
                                    j.number.toLowerCase().includes(searchTerm)
                                  )
                                  // Update the jobs list temporarily for search
                                  if (searchTerm) {
                                    setJobs(filteredJobs)
                                  } else {
                                    // Reload original jobs if search is cleared
                                    fetch(CONFIG.sheetApiUrl)
                                      .then(res => res.json())
                                      .then(data => setJobs(data))
                                      .catch(console.error)
                                  }
                                }}
                              />
                            </div>
                            {[...new Set(jobs.map(j => j.description))].map((desc) => (
                              <SelectItem key={desc} value={desc} className="cursor-pointer">
                                <div className="flex flex-col">
                                  <span className="font-medium">{desc}</span>
                                  <span className="text-xs text-gray-500">
                                    {jobs.find(j => j.description === desc)?.clientName} - {jobs.find(j => j.description === desc)?.number}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Job Number</Label>
                      <Input 
                        value={jobId || ''} 
                        onChange={(e) => setJobId(e.target.value)} 
                        placeholder="Job number will auto-populate"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Property Type</Label>
                      <Select value={formData.propertyType || ''} onValueChange={(value) => handleInputChange('propertyType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONFIG.propertyTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Age of Property</Label>
                      <Select value={formData.ageOfProperty || ''} onValueChange={(value) => handleInputChange('ageOfProperty', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONFIG.propertyAges.map(age => (
                            <SelectItem key={age} value={age}>{age}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Property Condition</Label>
                      <Select value={formData.propertyCondition || ''} onValueChange={(value) => handleInputChange('propertyCondition', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONFIG.propertyConditions.map(condition => (
                            <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Construction Type</Label>
                      <Select value={formData.constructionType || ''} onValueChange={(value) => handleInputChange('constructionType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select construction" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONFIG.constructionTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* --- Step 2: Site & Property --- */}
                <section className="space-y-4">
                  <h2 className="text-lg font-medium">Site & Property</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Location of Structure</Label>
                      <Select value={formData.locationOfStructure || ''} onValueChange={(value) => handleInputChange('locationOfStructure', value)}>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          {['Residential','Industrial','Commercial','Other'].map(o => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.locationOfStructure === 'Other' && (
                      <div>
                        <Label>Other (if selected)</Label>
                        <Input 
                          value={formData.locationOther || ''} 
                          onChange={(e) => handleInputChange('locationOther', e.target.value)} 
                          placeholder="Describe…" 
                        />
                      </div>
                    )}
                    <div>
                      <Label>Site Access</Label>
                      <Select value={formData.siteAccess || ''} onValueChange={(value) => handleInputChange('siteAccess', value)}>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          {CONFIG.siteAccessOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Customer Notes</Label>
                    <Textarea 
                      rows={3} 
                      value={formData.customerNotes || ''} 
                      onChange={(e) => handleInputChange('customerNotes', e.target.value)} 
                    />
                  </div>
                  <div className="grid md:grid-cols-1 gap-4">
                    <div>
                      <Label>Power Supply Status</Label>
                      <Select value={formData.isPowerIsolated || ''} onValueChange={(value) => handleInputChange('isPowerIsolated', value)}>
                        <SelectTrigger><SelectValue placeholder="Select status…" /></SelectTrigger>
                        <SelectContent>
                          {CONFIG.yesNo.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-600 mt-1">Has the power been safely isolated for roof work?</p>
                    </div>
                  </div>
                  
                  {/* Power Isolation Image Upload - Only show when "Yes" is selected */}
                  {formData.isPowerIsolated === 'Yes' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                      <Label className="text-blue-900 font-medium">Power Isolation Evidence</Label>
                      <p className="text-sm text-blue-700 mb-3">Please upload a photo showing the power has been safely isolated (e.g., circuit breaker off, main switch down, or lockout tag)</p>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleInputChange('powerIsolationImage', e.target.files)}
                        className="border-blue-300"
                      />
                      <p className="text-xs text-blue-600 mt-2">This helps ensure safety compliance and provides evidence of proper power isolation</p>
                    </div>
                  )}
                  
                  {/* Smart Construction Type Suggestions */}
                  {formData.propertyType && formData.ageOfProperty && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                      <h4 className="font-medium text-green-900 mb-2">💡 Smart Suggestions</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        {formData.propertyType === 'House' && formData.ageOfProperty === '50+' && (
                          <p>• Consider heritage restoration requirements for older properties</p>
                        )}
                        {formData.propertyType === 'Unit' && (
                          <p>• Check body corporate approval requirements</p>
                        )}
                        {formData.ageOfProperty === '1-5' && (
                          <p>• New construction may have warranty considerations</p>
                        )}
                        {formData.propertyCondition === 'Poor' && (
                          <p>• Structural assessment may be required before roof work</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Mudmap Display - Auto-generated when job is selected */}
                  {formData.mudmapUrl && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-orange-900 font-medium">Generated Mudmap</Label>
                        <Button
                          onClick={() => handleInputChange('mudmapUrl', '')}
                          variant="outline"
                          size="sm"
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="mt-2 p-3 bg-white border border-orange-200 rounded-lg">
                        <img 
                          src={formData.mudmapUrl} 
                          alt="Site Mudmap" 
                          className="w-full h-auto rounded border shadow-lg"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                        <div className="mt-2">
                          <a 
                            href={formData.mudmapUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                          >
                            View Full Size
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Mudmap Generation Status */}
                  {isGeneratingMudmap && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3" />
                        <span className="text-blue-700">Generating mudmap from job description...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Mudmap Error Display */}
                  {mudmapError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-sm">{mudmapError}</p>
                    </div>
                  )}
                </section>

                <Separator />

                {/* --- Step 2.5: Site Map --- */}
                <section className="space-y-4">
                  <h2 className="text-lg font-medium">Site Map</h2>
                  <div className="space-y-4">
                    {formData.siteMapUrl ? (
                      <div className="space-y-3">
                        <Label>Site Map Image</Label>
                        <div className="relative">
                          <img 
                            src={formData.siteMapUrl} 
                            alt="Site Map" 
                            className="w-full max-w-2xl h-auto rounded-lg border shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const fallback = target.nextElementSibling as HTMLDivElement
                              if (fallback) fallback.style.display = 'block'
                            }}
                          />
                          <div className="hidden bg-gray-100 border rounded-lg p-8 text-center text-gray-500">
                            <p>Site map image failed to load</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Site map loaded from webhook</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label>Site Map</Label>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-blue-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">Site map will be automatically generated when a job description is selected</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <Separator />

                {/* --- Step 3: Assets (repeatable) --- */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Assets</h2>
                    <Button type="button" variant="secondary" onClick={addAsset}>Add Asset</Button>
                  </div>
                  {formData.assets.map((asset, assetIndex) => (
                    <Card key={assetIndex} className="border rounded-xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{`Asset ${assetIndex + 1}`}</CardTitle>
                          {formData.assets.length > 1 && (
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeAsset(assetIndex)}>Remove</Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label>Asset Name</Label>
                            <Input 
                              value={asset.assetName} 
                              onChange={(e) => handleAssetChange(assetIndex, 'assetName', e.target.value)} 
                            />
                          </div>
                        </div>

                        {/* Roof Areas */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Roof Areas</h3>
                            <Button type="button" variant="secondary" size="sm" onClick={() => addRoofArea(assetIndex)}>Add Area</Button>
                          </div>
                          {asset.roofAreas.map((area, areaIndex) => (
                            <div key={areaIndex} className="space-y-4 border rounded-lg p-3">
                              {/* Input Fields - Mobile-first responsive grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-end">
                                <div className="sm:col-span-2 lg:col-span-1">
                                  <Label>Area Name</Label>
                                  <Input 
                                    value={area.name} 
                                    onChange={(e) => handleRoofAreaChange(assetIndex, areaIndex, 'name', e.target.value)} 
                                  />
                                </div>
                                <div>
                                  <Label>Type</Label>
                                  <Select value={area.type || ''} onValueChange={(value) => handleRoofAreaChange(assetIndex, areaIndex, 'type', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                    <SelectContent>
                                      {CONFIG.roofForms.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Label>Profile</Label>
                                    <ProfileInfo />
                                  </div>
                                  <Select value={area.profile || ''} onValueChange={(value) => handleRoofAreaChange(assetIndex, areaIndex, 'profile', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                    <SelectContent>
                                      {CONFIG.lysaghtProfiles.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Thickness (BMT)</Label>
                                  <Select value={area.gauge || ''} onValueChange={(value) => handleRoofAreaChange(assetIndex, areaIndex, 'gauge', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                    <SelectContent>
                                      {CONFIG.bmtOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Pitch (°)</Label>
                                  <Input 
                                    type="number" 
                                    inputMode="numeric" 
                                    value={area.pitchDeg ?? ''} 
                                    onChange={(e) => handleRoofAreaChange(assetIndex, areaIndex, 'pitchDeg', toNumberOrNull(e.target.value))} 
                                  />
                                </div>
                                <div>
                                  <Label>Colour</Label>
                                  <ColorSelector 
                                    value={area.colour || ''} 
                                    onValueChange={(value) => handleRoofAreaChange(assetIndex, areaIndex, 'colour', value)} 
                                    options={CONFIG.colourbondColoursWithSwatches}
                                    showPreview={false}
                                  />
                                </div>
                                <div>
                                  <Label>Membrane</Label>
                                  <Select value={area.membrane || ''} onValueChange={(value) => handleRoofAreaChange(assetIndex, areaIndex, 'membrane', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select membrane…" /></SelectTrigger>
                                    <SelectContent>
                                      {CONFIG.membranes.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Measurement Fields - Full width below other inputs */}
                              <div className="col-span-full">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <div>
                                    <Label>Length (m)</Label>
                                    <Input 
                                      type="number" 
                                      inputMode="decimal"
                                      step="0.01"
                                      min="0"
                                      value={area.length || ''} 
                                      onChange={(e) => handleRoofAreaChange(assetIndex, areaIndex, 'length', toNumberOrNull(e.target.value))} 
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div>
                                    <Label>Width (m)</Label>
                                    <Input 
                                      type="number" 
                                      inputMode="decimal"
                                      step="0.01"
                                      min="0"
                                      value={area.width || ''} 
                                      onChange={(e) => handleRoofAreaChange(assetIndex, areaIndex, 'width', toNumberOrNull(e.target.value))} 
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div>
                                    <Label>Calculated Area (m²)</Label>
                                    <div className="flex items-center space-x-2">
                                      <Input 
                                        type="number" 
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        value={area.area || ''} 
                                        onChange={(e) => handleRoofAreaChange(assetIndex, areaIndex, 'area', toNumberOrNull(e.target.value))} 
                                        placeholder="0.00"
                                        className="flex-1"
                                        readOnly
                                      />
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          if (area.length && area.width && area.pitchDeg) {
                                            const calculatedArea = (area.length * area.width) / Math.cos((area.pitchDeg * Math.PI) / 180)
                                            handleRoofAreaChange(assetIndex, areaIndex, 'area', Math.round(calculatedArea * 100) / 100)
                                          }
                                        }}
                                        disabled={!area.length || !area.width || !area.pitchDeg}
                                        className="whitespace-nowrap"
                                      >
                                        Calculate
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Total Area (m²)</Label>
                                    <div className="p-2 bg-blue-50 border border-blue-200 rounded text-center">
                                      <span className="text-lg font-bold text-blue-900">
                                        {area.area ? area.area.toFixed(2) : '0.00'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Area Images - Full width below inputs */}
                              <div>
                                <Label>Area Images</Label>
                                <DragAndDropImageUpload 
                                  multiple 
                                  accept="image/*" 
                                  onImagesChange={(files) => {
                                    // Store images for this specific roof area
                                    const imageFiles: ImageFile[] = files.map((file, index) => ({
                                      id: `${assetIndex}-${areaIndex}-${index}`,
                                      file,
                                      preview: URL.createObjectURL(file),
                                      progress: 100,
                                      status: 'success'
                                    }))
                                    const updatedAssets = [...formData.assets]
                                    updatedAssets[assetIndex] = {
                                      ...updatedAssets[assetIndex],
                                      roofAreas: updatedAssets[assetIndex].roofAreas.map((ra, idx) => 
                                        idx === areaIndex ? { ...ra, images: imageFiles } : ra
                                      )
                                    }
                                    setFormData(prev => ({ ...prev, assets: updatedAssets }))
                                  }}
                                />
                              </div>

                              {/* Remove Area Button */}
                              {asset.roofAreas.length > 1 && (
                                <div className="flex justify-end">
                                  <Button type="button" variant="destructive" size="sm" onClick={() => removeRoofArea(assetIndex, areaIndex)}>Remove Area</Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Battens / Purlins */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Support Width (Battens / Purlins)</h3>
                            <Button type="button" variant="secondary" size="sm" onClick={() => addBatten(assetIndex)}>Add Row</Button>
                          </div>
                          {asset.battens.map((row, rowIndex) => (
                            <div key={rowIndex} className="border rounded-lg p-3 space-y-4">
                              {/* Input Fields Row */}
                              <div className="grid md:grid-cols-5 gap-3 items-end">
                                <div>
                                  <Label>Type</Label>
                                  <Select value={row.kind} onValueChange={(value) => handleBattenChange(assetIndex, rowIndex, 'kind', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Batten">Batten</SelectItem>
                                      <SelectItem value="Purlin">Purlin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Spacing (mm)</Label>
                                  <Select value={row.spacingMm || ''} onValueChange={(value) => handleBattenChange(assetIndex, rowIndex, 'spacingMm', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select spacing…" /></SelectTrigger>
                                    <SelectContent>
                                      {CONFIG.battenSpacingOptions.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Material</Label>
                                  <Select value={row.material || ''} onValueChange={(value) => handleBattenChange(assetIndex, rowIndex, 'material', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Steel">Steel</SelectItem>
                                      <SelectItem value="Timber">Timber</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Size</Label>
                                  <Input 
                                    value={row.size || ''} 
                                    onChange={(e) => handleBattenChange(assetIndex, rowIndex, 'size', e.target.value)} 
                                    placeholder="70×30mm" 
                                  />
                                </div>
                                <div>
                                  <Label>Condition</Label>
                                  <Select value={row.condition || ''} onValueChange={(value) => handleBattenChange(assetIndex, rowIndex, 'condition', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                    <SelectContent>
                                      {CONFIG.framingCondition.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Row Image - Now positioned below the input fields */}
                              <div>
                                <Label>Row Image</Label>
                                <DragAndDropImageUpload 
                                  multiple 
                                  accept="image/*" 
                                  onImagesChange={(files) => {
                                    // Store images for this specific batten row
                                    const imageFiles: ImageFile[] = files.map((file, index) => ({
                                      id: `${assetIndex}-batten-${rowIndex}-${index}`,
                                      file,
                                      preview: URL.createObjectURL(file),
                                      progress: 100,
                                      status: 'success'
                                    }))
                                    const updatedAssets = [...formData.assets]
                                    updatedAssets[assetIndex] = {
                                      ...updatedAssets[assetIndex],
                                      battens: updatedAssets[assetIndex].battens.map((b, idx) => 
                                        idx === rowIndex ? { ...b, images: imageFiles } : b
                                      )
                                    }
                                    setFormData(prev => ({ ...prev, assets: updatedAssets }))
                                  }}
                                />
                              </div>

                              {/* Remove Row Button */}
                              <div className="flex justify-end">
                                <Button type="button" variant="destructive" size="sm" onClick={() => removeBatten(assetIndex, rowIndex)}>Remove Row</Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Framing */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Roof Framing</h3>
                            <Button type="button" variant="secondary" size="sm" onClick={() => addFraming(assetIndex)}>Add Row</Button>
                          </div>
                          {asset.framing.map((row, rowIndex) => (
                            <div key={rowIndex} className="border rounded-lg p-3 space-y-4">
                              {/* Input Fields Row */}
                              <div className="grid md:grid-cols-5 gap-3 items-end">
                                <div>
                                  <Label>Material</Label>
                                  <Select value={row.material} onValueChange={(value) => handleFramingChange(assetIndex, rowIndex, 'material', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Metal">Metal</SelectItem>
                                      <SelectItem value="Timber">Timber</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Spacing</Label>
                                  <Input 
                                    value={row.spacing || ''} 
                                    onChange={(e) => handleFramingChange(assetIndex, rowIndex, 'spacing', e.target.value)} 
                                    placeholder="e.g., 600 mm" 
                                  />
                                </div>
                                <div>
                                  <Label>Size</Label>
                                  <Input 
                                    value={row.size || ''} 
                                    onChange={(e) => handleFramingChange(assetIndex, rowIndex, 'size', e.target.value)} 
                                    placeholder="70×30mm" 
                                  />
                                </div>
                                <div>
                                  <Label>Span</Label>
                                  <Input 
                                    value={row.span || ''} 
                                    onChange={(e) => handleFramingChange(assetIndex, rowIndex, 'span', e.target.value)} 
                                    placeholder="e.g., Ridge to top plate" 
                                  />
                                </div>
                                <div>
                                  <Label>Condition</Label>
                                  <Select value={row.condition || ''} onValueChange={(value) => handleFramingChange(assetIndex, rowIndex, 'condition', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                    <SelectContent>
                                      {CONFIG.framingCondition.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Row Image - Now positioned below the input fields */}
                              <div>
                                <Label>Row Image</Label>
                                <DragAndDropImageUpload 
                                  multiple 
                                  accept="image/*" 
                                  onImagesChange={(files) => {
                                    // Store images for this specific framing row
                                    const imageFiles: ImageFile[] = files.map((file, index) => ({
                                      id: `${assetIndex}-framing-${rowIndex}-${index}`,
                                      file,
                                      preview: URL.createObjectURL(file),
                                      progress: 100,
                                      status: 'success'
                                    }))
                                    const updatedAssets = [...formData.assets]
                                    updatedAssets[assetIndex] = {
                                      ...updatedAssets[assetIndex],
                                      framing: updatedAssets[assetIndex].framing.map((f, idx) => 
                                        idx === rowIndex ? { ...f, images: imageFiles } : f
                                      )
                                    }
                                    setFormData(prev => ({ ...prev, assets: updatedAssets }))
                                  }}
                                />
                              </div>

                              {/* Remove Row Button */}
                              <div className="flex justify-end">
                                <Button type="button" variant="destructive" size="sm" onClick={() => removeFraming(assetIndex, rowIndex)}>Remove Row</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                {/* Interactive Data Visualization */}
                <section className="space-y-4">
                  <InteractiveDataVisualization assets={formData.assets} />
                </section>

                <Separator />

                {/* --- Step 4: Final uploads & Notes --- */}
                <section className="space-y-4">
                  <h2 className="text-lg font-medium">Final Uploads & Notes</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Plan (PDF/JPG/PNG/DOCX)</Label>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => handleInputChange('finalPlan', e.target.files)}
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
                        onChange={(e) => handleInputChange('finalTakeoff', e.target.files)}
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
                      <Label>Date Submitted (AEST)</Label>
                      <Input readOnly className="bg-muted" value={attendanceDate} />
                    </div>
                  </div>
                </section>

                <Separator />

                <div className="flex items-center gap-3">
                  <Button 
                    type="submit" 
                    disabled={isLoadingJobs || isSubmitting} 
                    className="w-full md:w-auto bg-arw-navy hover:bg-arw-blue"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Form...
                      </>
                    ) : (
                      'Submit Form'
                    )}
                  </Button>
                  <PDFExportButton formData={formData} jobId={jobId} />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}

export default AdminPreWorksForm

