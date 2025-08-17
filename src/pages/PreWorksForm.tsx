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
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
// Dynamic imports for heavy libraries
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
import './PreWorksForm.css'

// Navigation and layout components
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

// Import custom styles
import './PreWorksForm.css'

// ---------- Config (easy to tweak without redeploy) ----------
const CONFIG = {
  sheetApiUrl:
    'https://script.google.com/macros/s/AKfycbxAeT0tXnBGwhw7NaoAvgdhUHz412L4ESPi62gtx0SUruZnEdUOn6nUi6APrOWxlrlekg/exec',
  webhookUrl: 'https://n8n.wayvvault.cc/webhook/form-builder',
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
  pitchDeg?: number | null
  colour?: string
  gauge?: string
  membrane?: string
}

interface BattenRow {
  kind: 'Purlin' | 'Batten'
  spacingMm?: string
  material?: 'Steel' | 'Timber'
  size?: string
  condition?: string
}

interface FramingRow {
  material: 'Metal' | 'Timber'
  spacing?: string
  size?: string
  span?: string
  condition?: string
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

// Floating Help Panel Component
const HelpPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        title="Keyboard Shortcuts & Help"
      >
        <span className="text-xl">?</span>
      </button>
      
      {/* Help Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Keyboard Shortcuts</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Save Form:</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘ + S</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submit Form:</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘ + Enter</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Add Asset:</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab + A</kbd>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Form Tips</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Form auto-saves every second</li>
              <li>• Use Tab to navigate between fields</li>
              <li>• Color swatches show live previews</li>
              <li>• Progress bar tracks completion</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">⌘/Ctrl + S</kbd>
                <span className="ml-2">Save form</span>
              </div>
              <div>
                <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">⌘/Ctrl + Enter</kbd>
                <span className="ml-2">Submit form</span>
              </div>
              {/* Dark Mode Shortcut - DISABLED FOR NOW */}
              {/* <div>
                <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">⌘/Ctrl + T</kbd>
                <span className="ml-2">Toggle dark mode</span>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
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

const PreWorksForm: React.FC = () => {
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
      assets: [
        {
          assetName: 'Main House',
          roofAreas: [
            { name: 'Area A', type: '', profile: '', pitchDeg: null, colour: '', gauge: '', membrane: '' },
          ],
          battens: [
            { kind: 'Batten', spacingMm: '600 centres', material: 'Timber', size: '', condition: 'Good' }
          ],
          framing: [
            { material: 'Timber', spacing: '', size: '', span: '', condition: 'Good' }
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

  // Show auto-save notification
  const [showAutoSave, setShowAutoSave] = useState(false)
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
        roofAreas: [{ name: `Area ${String.fromCharCode(65 + prev.assets.length)}`, type: '', profile: '', pitchDeg: null, colour: '', gauge: '', membrane: '' }],
        battens: [
          { kind: 'Batten', spacingMm: '600 centres', material: 'Timber', size: '', condition: 'Good' }
        ],
        framing: [
          { material: 'Timber', spacing: '', size: '', span: '', condition: 'Good' }
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
            type: '', profile: '', pitchDeg: null, colour: '', gauge: '', membrane: '' 
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
          battens: [...asset.battens, { kind: 'Batten', spacingMm: '600 centres', material: 'Timber', size: '', condition: 'Good' }]
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
          framing: [...asset.framing, { material: 'Timber', spacing: '', size: '', span: '', condition: 'Good' }]
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

    const fd = new FormData()
    // meta/job
    fd.append('form', 'pre_works_v1')
    fd.append('jobId', jobId)
    fd.append('jobDescription', formData.selectedDescription)
    fd.append('jobNumber', selectedJob.number)
    fd.append('clientName', selectedJob.clientName)
    fd.append('reporterName', formData.reporterName || '')

    // timestamps
    fd.append('attendanceDate', attendanceDate)
    fd.append('attendanceTime', attendanceTime)
    fd.append('dateSubmitted', dateSubmitted)

    // site basics
    fd.append('locationOfStructure', formData.locationOfStructure || '')
    fd.append('locationOther', formData.locationOther || '')
    fd.append('siteAccess', formData.siteAccess || '')
    fd.append('customerNotes', formData.customerNotes || '')

    // property
    fd.append('isPowerIsolated', formData.isPowerIsolated || '')
    if (formData.powerIsolationImage && formData.powerIsolationImage.length > 0) {
      fd.append('powerIsolationImage', formData.powerIsolationImage[0])
    }
    fd.append('propertyType', formData.propertyType || '')
    fd.append('ageOfProperty', formData.ageOfProperty || '')
    fd.append('propertyCondition', formData.propertyCondition || '')
    fd.append('constructionType', formData.constructionType || '')

    // services (simple CSV)
    fd.append('roofServices', (formData.roofServices || []).join(','))

    // assets (serialize JSON for structured sections; images appended separately by naming convention)
    fd.append('assetsJson', JSON.stringify(formData.assets, (_k, v) => (v === null ? '' : v)))

    // notes
    fd.append('notes', formData.notes)

    try {
      const res = await fetch(CONFIG.webhookUrl, { method: 'POST', body: fd })
      if (!res.ok) {
        let msg = `Submit failed (${res.status})`
        try { const j = await res.json(); if (j?.message) msg = j.message } catch {}
        throw new Error(msg)
      }
      const data = await res.json().catch(() => ({}))
      // Navigate to success (optional ref number)
      const ref = data?.ref ? `?ref=${encodeURIComponent(data.ref)}` : ''
      navigate(`/forms/pre-works/success${ref}`)
    } catch (err: any) {
      alert(err.message)
    }
  }

  // PDF Export Component
  const PDFExportButton: React.FC<{
    formData: FormValues
    className?: string
  }> = ({ formData, className = "" }) => {
    const [isGenerating, setIsGenerating] = useState(false)

    const generatePDF = async () => {
      setIsGenerating(true)
      
      try {
        // Dynamically import jsPDF only when needed
        const { default: jsPDF } = await import('jspdf')
        
        // Create new PDF document
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        let yPosition = 20
        
        // Add header
        pdf.setFontSize(24)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Pre-Works Assessment Report', pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 15
        
        // Add date
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 20
        
        // Add form details
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Project Details', 20, yPosition)
        yPosition += 10
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        
        // Basic form information
        const formDetails = [
          ['Job Description:', formData.selectedDescription || 'Not specified'],
          ['Property Type:', formData.propertyType || 'Not specified'],
          ['Age of Property:', formData.ageOfProperty || 'Not specified'],
          ['Property Condition:', formData.propertyCondition || 'Not specified'],
          ['Construction Type:', formData.constructionType || 'Not specified'],
          ['Reporter Name:', formData.reporterName || 'Not specified']
        ]
        
        formDetails.forEach(([label, value]) => {
          pdf.setFont('helvetica', 'bold')
          pdf.text(label, 20, yPosition)
          pdf.setFont('helvetica', 'normal')
          pdf.text(value, 70, yPosition)
          yPosition += 6
        })
        
        yPosition += 10
        
        // Add assets information
        formData.assets.forEach((asset, assetIndex) => {
          // Check if we need a new page
          if (yPosition > pageHeight - 40) {
            pdf.addPage()
            yPosition = 20
          }
          
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'bold')
          pdf.text(`Asset ${assetIndex + 1}: ${asset.assetName}`, 20, yPosition)
          yPosition += 8
          
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          
          // Roof Areas
          if (asset.roofAreas.length > 0) {
            pdf.setFont('helvetica', 'bold')
            pdf.text('Roof Areas:', 25, yPosition)
            yPosition += 6
            
            asset.roofAreas.forEach((area, areaIndex) => {
              pdf.setFont('helvetica', 'normal')
              const areaDetails = [
                `  Area ${areaIndex + 1}: ${area.name}`,
                `    Type: ${area.type || 'Not specified'}`,
                `    Profile: ${area.profile || 'Not specified'}`,
                `    Pitch: ${area.pitchDeg || 'Not specified'}°`,
                `    Colour: ${area.colour || 'Not specified'}`,
                `    Thickness (BMT): ${area.gauge || 'Not specified'}`,
                `    Membrane: ${area.membrane || 'None'}`
              ]
              
              areaDetails.forEach(detail => {
                if (yPosition > pageHeight - 20) {
                  pdf.addPage()
                  yPosition = 20
                }
                pdf.text(detail, 30, yPosition)
                yPosition += 5
              })
              yPosition += 2
            })
          }
          
          // Support Width (Battens/Purlins)
          if (asset.battens.length > 0) {
            if (yPosition > pageHeight - 30) {
              pdf.addPage()
              yPosition = 20
            }
            
            pdf.setFont('helvetica', 'bold')
            pdf.text('Support Width (Battens/Purlins):', 25, yPosition)
            yPosition += 6
            
            asset.battens.forEach((batten, battenIndex) => {
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
                if (yPosition > pageHeight - 20) {
                  pdf.addPage()
                  yPosition = 20
                }
                pdf.text(detail, 30, yPosition)
                yPosition += 5
              })
              yPosition += 2
            })
          }
          
          // Roof Framing
          if (asset.framing.length > 0) {
            if (yPosition > pageHeight - 30) {
              pdf.addPage()
              yPosition = 20
            }
            
            pdf.setFont('helvetica', 'bold')
            pdf.text('Roof Framing:', 25, yPosition)
            yPosition += 6
            
            asset.framing.forEach((frame, frameIndex) => {
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
                if (yPosition > pageHeight - 20) {
                  pdf.addPage()
                  yPosition = 20
                }
                pdf.text(detail, 30, yPosition)
                yPosition += 5
              })
              yPosition += 2
            })
          }
          
          yPosition += 10
        })
        
        // Add notes if available
        if (formData.notes) {
          if (yPosition > pageHeight - 30) {
            pdf.addPage()
            yPosition = 20
          }
          
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'bold')
          pdf.text('General Notes:', 20, yPosition)
          yPosition += 8
          
          pdf.setFontSize(10)
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
                pdf.addPage()
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
              pdf.addPage()
              yPosition = 20
            }
            pdf.text(line, 20, yPosition)
          }
        }
        
        // Add footer
        const totalPages = pdf.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
          pdf.setFontSize(8)
          pdf.setFont('helvetica', 'normal')
          pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
          pdf.text('Generated by Roofify Pre-Works Assessment Form', pageWidth / 2, pageHeight - 5, { align: 'center' })
        }
        
        // Save the PDF
        const fileName = `pre-works-assessment-${new Date().toISOString().split('T')[0]}.pdf`
        pdf.save(fileName)
        
      } catch (error) {
        console.error('Error generating PDF:', error)
        alert('Error generating PDF. Please try again.')
      } finally {
        setIsGenerating(false)
      }
    }

    return (
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Generating PDF...
          </>
        ) : (
          <>
            📄 Export as PDF
          </>
        )}
      </Button>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO page="preWorks" />
      <Navigation />
      
      <div className="p-2 sm:p-4 mt-24">
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
                  <div className="grid md:grid-cols-4 gap-4">
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
                    <div>
                      <Label>Property Type</Label>
                      <Select value={formData.propertyType || ''} onValueChange={(value) => handleInputChange('propertyType', value)}>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          {CONFIG.propertyTypes.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Age of Property</Label>
                      <Select value={formData.ageOfProperty || ''} onValueChange={(value) => handleInputChange('ageOfProperty', value)}>
                        <SelectTrigger><SelectValue placeholder="Select age range…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10-20">10-20 years</SelectItem>
                          <SelectItem value="20-30">20-30 years</SelectItem>
                          <SelectItem value="30-40">30-40 years</SelectItem>
                          <SelectItem value="40-50">40-50 years</SelectItem>
                          <SelectItem value="50+">50+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Condition</Label>
                      <Select value={formData.propertyCondition || ''} onValueChange={(value) => handleInputChange('propertyCondition', value)}>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          {CONFIG.conditionOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
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
                  <div>
                    <Label>Construction Type</Label>
                    <Input 
                      value={formData.constructionType || ''} 
                      onChange={(e) => handleInputChange('constructionType', e.target.value)} 
                    />
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

                              {/* Area Images - Full width below inputs */}
                              <div>
                                <Label>Area Images</Label>
                                <DragAndDropImageUpload 
                                  multiple 
                                  accept="image/*" 
                                  onImagesChange={(files) => {
                                    // Handle image upload for this specific area
                                    console.log(`Images for ${asset.assetName} - Roof Area ${areaIndex}:`, files)
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
                                    // Handle image upload for this specific row
                                    console.log(`Images for ${asset.assetName} - Batten Row ${rowIndex}:`, files)
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
                                    // Handle image upload for this specific row
                                    console.log(`Images for ${asset.assetName} - Framing Row ${rowIndex}:`, files)
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
                      <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                    </div>
                    <div>
                      <Label>Takeoff (PDF/JPG/PNG/DOCX)</Label>
                      <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
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
                  <Button type="submit" disabled={isLoadingJobs} className="w-full md:w-auto">
                    Submit Form
                  </Button>
                  <PDFExportButton formData={formData} />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
      <HelpPanel />
    </div>
  )
}

export default PreWorksForm
