import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select'
import { Activity, BarChart3, DollarSign, Search, Filter, MapPin, Building, Calendar, Hash, X, Download, RefreshCw } from 'lucide-react'

// Enhanced TypeScript interfaces
interface Task {
  taskId: string
  taskName: string
  startDate: string
  endDate?: string
  sortOrder?: number
  note?: string
  estimatedCost?: number
  actualCost?: number
}

interface Job {
  // Basic Job Info
  jobId: string
  number: string
  description: string
  buildingType: string
  status: 'Not Started' | 'In Progress' | 'Completed' | string
  
  // Client Information
  clientName: string
  clientAddress: string
  clientCityTown: string
  clientState: string
  clientPostCode: string
  clientPhone: string
  clientMobile: string
  clientEmail: string
  
  // Location Information
  worksLocationAddress: string
  worksLocationSuburb: string
  worksLocationState: string
  worksLocationPostcode: string | number
  
  // Dates
  creationDate: string
  targetDate: string
  completionDate: string
  
  // Financial Information
  contractTotal: number
  contractTotalIncTax: number
  paymentTotal: number
  paymentTotalIncTax: number
  actualTotal: number
  actualTotalIncTax: number
  progressPercent: number
  
  // Additional
  invoiceMethod: string
  isCompleted: boolean
  "Form 43 Created": string
  
  // Task Information
  tasks?: Task[]
}

interface JobFilters {
  search: string
  status: string
  buildingType: string
  jobStatus: string
}

type ViewMode = 'list' | 'calendar' | 'gantt'
type SortDirection = 'asc' | 'desc'

interface JobViewerProps {
  className?: string
}

// Custom hook for debouncing values
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Loading skeleton component
const JobTableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex space-x-4">
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-12 w-16" />
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-12 w-20" />
      </div>
    ))}
  </div>
)

// Helper function to format dates
const formatDate = (dateString: string | Date) => {
  if (!dateString) return 'N/A'
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

// Calendar View Component
const CalendarView: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  // Group tasks by month
  const tasksByMonth = tasks.reduce((acc: Record<string, Task[]>, task: Task) => {
    if (task.startDate) {
      const date = new Date(task.startDate)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      if (!acc[monthKey]) {
        acc[monthKey] = []
      }
      acc[monthKey].push(task)
    }
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(tasksByMonth).map(([monthKey, monthTasks]) => {
        const [year, month] = monthKey.split('-')
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
        
        return (
          <div key={monthKey} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{monthName}</h4>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {(() => {
                const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1)
                const lastDay = new Date(parseInt(year), parseInt(month), 0)
                const startDate = new Date(firstDay)
                startDate.setDate(startDate.getDate() - firstDay.getDay())
                
                const days = []
                for (let i = 0; i < 42; i++) {
                  const currentDate = new Date(startDate)
                  currentDate.setDate(startDate.getDate() + i)
                  
                  if (currentDate.getMonth() === parseInt(month) - 1) {
                    const dayTasks = monthTasks.filter((task: Task) => {
                      const taskDate = new Date(task.startDate)
                      return taskDate.getDate() === currentDate.getDate() && 
                             taskDate.getMonth() === currentDate.getMonth() &&
                             taskDate.getFullYear() === currentDate.getFullYear()
                    })
                    
                    days.push(
                      <div key={i} className="min-h-[60px] border border-gray-100 p-1">
                        <div className="text-right text-gray-400 text-xs mb-1">
                          {currentDate.getDate()}
                        </div>
                        {dayTasks.map((task: Task, taskIndex: number) => (
                          <div key={taskIndex} className="text-xs bg-blue-100 text-blue-800 p-1 rounded mb-1 truncate">
                            {task.taskName}
                          </div>
                        ))}
                      </div>
                    )
                  } else {
                    days.push(<div key={i} className="min-h-[60px] border border-gray-100 p-1 bg-gray-50"></div>)
                  }
                }
                return days
              })()}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Gantt View Component
const GanttView: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const sortedTasks = tasks
    .filter((task: Task) => task.startDate)
    .sort((a: Task, b: Task) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  if (sortedTasks.length === 0) return <div className="text-center text-gray-500">No tasks with dates</div>

  const earliestDate = new Date(sortedTasks[0].startDate)
  const latestDate = new Date(sortedTasks[sortedTasks.length - 1].endDate || sortedTasks[sortedTasks.length - 1].startDate)
  const totalDays = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 3600 * 24)) + 1

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-4">
        Timeline: {formatDate(earliestDate.toISOString())} to {formatDate(latestDate.toISOString())} ({totalDays} days)
      </div>
      
      {sortedTasks.map((task: Task, index: number) => {
        const startDate = new Date(task.startDate)
        const endDate = new Date(task.endDate || task.startDate)
        const daysFromStart = Math.ceil((startDate.getTime() - earliestDate.getTime()) / (1000 * 3600 * 24))
        const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1
        
        return (
          <div key={task.taskId || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-32 text-sm font-medium text-gray-900 truncate">
              {task.taskName}
            </div>
            
            <div className="flex-1 relative">
              <div className="h-8 bg-gray-200 rounded relative">
                <div 
                  className="h-full bg-blue-500 rounded absolute top-0 left-0 transition-all duration-300"
                  style={{
                    left: `${(daysFromStart / totalDays) * 100}%`,
                    width: `${(duration / totalDays) * 100}%`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                    {duration === 1 ? '1 day' : `${duration} days`}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-24 text-xs text-gray-600 text-right">
              {formatDate(startDate.toISOString())}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const JobViewer: React.FC<JobViewerProps> = ({ className = "" }) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [buildingTypeFilter, setBuildingTypeFilter] = useState<string>('all')
  const [jobStatusFilter, setJobStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<keyof Job>('number')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Fetch jobs from Google Sheets with improved error handling
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('https://script.googleusercontent.com/a/macros/arwc.com.au/echo?user_content_key=AehSKLg4x3SdAd8vXyliq0RjdM51narpacCFKMcCHhFPZgy8Mn400VhQsVM4_r2cyU9yZbIYUl42Dgv6nM8aJ-S5w8uYWpMLKB4w5LG9U3ip6QwBmHJnyMeWkzhrezQ9GN8WvlpJxppFCulFwnAkvPF6IMTU601PHzr0Dmuez9vtQ3JG_kmdYmeG72lvBv2BiT1cHIW12FYhkDW5ugXa0I_FjqynR8idnbHE6jlDsSmfhQ_NcKnOEcuoV20MSc8otfBHJrjIKXOo1JyZyEB5QfQf1DAzUsdCzkPYhL322UaFLMPoQW-9hD8&lib=Mr_6vjm8FUyFK9RyrPAOaVwA6AJu5-yHf')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Extract the actual rows from the sheets structure
      let rawRows: any[] = []
      if (data.sheets && data.sheets.length > 0 && data.sheets[0].rows) {
        rawRows = data.sheets[0].rows
      } else if (Array.isArray(data)) {
        rawRows = data
      } else {
        throw new Error('Unexpected API response structure')
      }
      
      // Process the data to group tasks with their main jobs
      const processedJobs = processJobData(rawRows)
      
      setJobs(processedJobs)
      setFilteredJobs(processedJobs)
    } catch (error) {
      console.error('❌ Error fetching jobs:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch jobs')
      setJobs([])
      setFilteredJobs([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [])

  // Filter and sort jobs with debounced search
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = 
        job.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.number.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.clientName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.worksLocationSuburb.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.worksLocationAddress.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.status.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.buildingType.toLowerCase().includes(debouncedSearchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && job.status !== 'Completed' && job.buildingType !== 'Blank Template') ||
        (statusFilter === 'template' && job.buildingType === 'Blank Template')

      const matchesBuildingType = buildingTypeFilter === 'all' || 
        job.buildingType === buildingTypeFilter

      const matchesJobStatus = jobStatusFilter === 'all' || 
        job.status === jobStatusFilter

      return matchesSearch && matchesStatus && matchesBuildingType && matchesJobStatus
    })

    // Sort jobs
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [jobs, debouncedSearchTerm, statusFilter, buildingTypeFilter, jobStatusFilter, sortField, sortDirection])

  // Update filtered jobs when the memoized value changes
  useEffect(() => {
    setFilteredJobs(filteredAndSortedJobs)
  }, [filteredAndSortedJobs])

  // Get unique building types for filter
  const buildingTypes = useMemo(() => 
    ['all', ...Array.from(new Set(jobs.map(job => job.buildingType)))], 
    [jobs]
  )

  // Handle column sorting
  const handleSort = useCallback((field: keyof Job) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField, sortDirection])

  // Export functionality
  const exportToCSV = useCallback(() => {
    const headers = ['Job Number', 'Description', 'Client', 'Location', 'Type', 'Status', 'Progress', 'Contract Value', 'Created Date']
    const csvData = [
      headers.join(','),
      ...filteredJobs.map(job => [
        job.number,
        `"${job.description}"`,
        `"${job.clientName}"`,
        `"${job.worksLocationSuburb}"`,
        `"${job.buildingType}"`,
        job.status,
        `${job.progressPercent || 0}%`,
        job.contractTotal || 0,
        job.creationDate
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jobs-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }, [filteredJobs])

  // Get status badge color
  const getStatusColor = (buildingType: string) => {
    if (buildingType === 'Blank Template') return 'bg-gray-100 text-gray-800'
    if (buildingType.includes('Roof Replacement')) return 'bg-blue-100 text-blue-800'
    if (buildingType.includes('Single storey')) return 'bg-green-100 text-green-800'
    if (buildingType.includes('Renovation')) return 'bg-purple-100 text-purple-800'
    if (buildingType.includes('Repairs')) return 'bg-orange-100 text-orange-800'
    return 'bg-slate-100 text-slate-800'
  }



  // Process raw API data with proper task grouping
  const processJobData = (rawData: any[]) => {
    // Group rows by jobId - some rows are jobs, some are tasks
    const jobMap = new Map()
    
    rawData.forEach((row) => {
      const jobId = row.jobId
      
      if (!jobMap.has(jobId)) {
        // Initialize job entry
        jobMap.set(jobId, {
          ...row,
          tasks: []
        })
      }
      
      // If this row has task data, add it to the job's tasks array
      if (row.taskName && row.startDate) {
        const existingJob = jobMap.get(jobId)
        const task = {
          taskId: row.jobTaskId || `task-${Math.random().toString(36).substr(2, 9)}`,
          taskName: row.taskName,
          startDate: row.startDate,
          endDate: row.endDate || row.startDate,
          sortOrder: row.sortOrder || 0,
          note: row.note || '',
          estimatedCost: row.estimatedCost || 0,
          actualCost: row.actualCost || 0
        }
        
        existingJob.tasks.push(task)
      }
    })
    
    // Convert map to array and sort tasks by sortOrder
    const processedData = Array.from(jobMap.values()).map(job => {
      // Sort tasks by sortOrder
      job.tasks.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      
      return job
    })
    
    return processedData
  }

  // Calculate contract length based on available dates
  const calculateContractLength = (job: Job) => {
    try {
      // Try to use target date first, then completion date, then creation date
      let startDate = new Date(job.creationDate)
      let endDate = null
      
      if (job.targetDate) {
        endDate = new Date(job.targetDate)
      } else if (job.completionDate) {
        endDate = new Date(job.completionDate)
      } else {
        // If no target or completion date, use creation date as both
        endDate = startDate
      }
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'Invalid dates'
      }
      
      // Calculate difference in days
      const timeDiff = endDate.getTime() - startDate.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      
      if (daysDiff === 0) return 'Same day'
      if (daysDiff === 1) return '1 day'
      return `${daysDiff} days`
    } catch (error) {
      console.error('Error calculating contract length:', error)
      return 'Error calculating'
    }
  }

  // Open modal with selected job
  const openJobModal = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  // Close modal
  const closeJobModal = () => {
    setSelectedJob(null)
    setIsModalOpen(false)
  }

  // Get date range for display
  const getDateRange = (job: Job) => {
    try {
      const startDate = new Date(job.creationDate)
      let endDate = null
      
      if (job.targetDate) {
        endDate = new Date(job.targetDate)
      } else if (job.completionDate) {
        endDate = new Date(job.completionDate)
      } else {
        endDate = startDate
      }
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'Invalid dates'
      }
      
      const startFormatted = formatDate(startDate.toISOString())
      const endFormatted = formatDate(endDate.toISOString())
      
      if (startFormatted === endFormatted) {
        return startFormatted
      }
      
      return `${startFormatted} - ${endFormatted}`
    } catch (error) {
      return 'Error parsing dates'
    }
  }

  // Format postcode
  const formatPostcode = (postcode: string | number) => {
    if (!postcode) return '-'
    return postcode.toString()
  }

  // Get location display
  const getLocationDisplay = (job: Job) => {
    const lines = []
    
    // First line: Full address
    if (job.worksLocationAddress) {
      lines.push(job.worksLocationAddress)
    }
    
    // Second line: Suburb, State Postcode
    const locationParts = [
      job.worksLocationSuburb,
      job.worksLocationState,
      formatPostcode(job.worksLocationPostcode)
    ].filter(Boolean)
    
    if (locationParts.length > 0) {
      lines.push(locationParts.join(', '))
    }
    
    // If no address but we have suburb info, show it on first line
    if (lines.length === 0 && job.worksLocationSuburb) {
      lines.push(job.worksLocationSuburb)
    }
    
    return lines.length > 0 ? lines : ['Location not specified']
  }

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-20 ml-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0">
            <JobTableSkeleton />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Jobs</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <Button onClick={fetchJobs} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Job Viewer
            <Badge variant="secondary" className="ml-2">
              {filteredJobs.length} of {jobs.length} jobs
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Jobs</SelectItem>
                <SelectItem value="template">Templates</SelectItem>
              </SelectContent>
            </Select>

            {/* Building Type Filter */}
            <Select value={buildingTypeFilter} onValueChange={setBuildingTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {buildingTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Job Status Filter */}
            <Select value={jobStatusFilter} onValueChange={setJobStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by job status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Statuses</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setBuildingTypeFilter('all')
                setJobStatusFilter('all')
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
            
            {/* Export Button */}
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="flex items-center gap-2"
              disabled={filteredJobs.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            

          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('number')}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Job Code
                      {sortField === 'number' && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Job Description
                      {sortField === 'description' && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('clientName')}
                  >
                    Client
                    {sortField === 'clientName' && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('buildingType')}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Type
                      {sortField === 'buildingType' && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Status
                      {sortField === 'status' && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('progressPercent')}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Progress
                      {sortField === 'progressPercent' && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('contractTotal')}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Contract Value
                      {sortField === 'contractTotal' && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Contract Length
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                      No jobs found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job) => (
                    <TableRow key={job.jobId} className="hover:bg-gray-50">
                      <TableCell className="font-mono font-medium">
                        <Badge variant="outline" className="font-mono">
                          {job.number}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-40">
                        <div className="space-y-1">
                          <p className="font-medium text-sm leading-tight">
                            {job.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {job.jobId.slice(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-32">
                        <div className="min-w-0">
                          <div className="text-sm font-medium leading-tight">
                            {job.clientName}
                          </div>
                          {job.clientCityTown && (
                            <div className="text-xs text-gray-500 leading-tight">
                              {job.clientCityTown}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-40">
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            {getLocationDisplay(job).map((line, index) => (
                              <div key={index} className="leading-tight">
                                {line}
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.buildingType)}>
                          {job.buildingType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={job.status === 'Not Started' ? 'secondary' : job.status === 'In Progress' ? 'default' : 'destructive'}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progressPercent || 0}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 min-w-[3rem]">
                            {job.progressPercent || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          ${(job.contractTotal || 0).toLocaleString()}
                        </div>
                        {job.contractTotalIncTax && job.contractTotalIncTax !== job.contractTotal && (
                          <div className="text-xs text-gray-500">
                            +GST: ${job.contractTotalIncTax.toLocaleString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-blue-600">
                            {calculateContractLength(job)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getDateRange(job)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openJobModal(job)}
                          >
                            View
                          </Button>
                          {job.tasks && job.tasks.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {job.tasks.length} task{job.tasks.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
              <p className="text-sm text-gray-600">Total Jobs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {jobs.filter(j => j.buildingType !== 'Blank Template').length}
              </p>
              <p className="text-sm text-gray-600">Active Jobs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {jobs.filter(j => j.buildingType === 'Blank Template').length}
              </p>
              <p className="text-sm text-gray-600">Templates</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {Array.from(new Set(jobs.map(j => j.buildingType))).length}
              </p>
              <p className="text-sm text-gray-600">Job Types</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                ${jobs.reduce((sum, j) => sum + (j.contractTotal || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Contract Value</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {jobs.filter(j => j.status === 'Not Started').length}
              </p>
              <p className="text-sm text-gray-600">Not Started</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                {(() => {
                  const jobsWithDates = jobs.filter(j => j.creationDate && (j.targetDate || j.completionDate))
                  if (jobsWithDates.length === 0) return 'N/A'
                  
                  const totalDays = jobsWithDates.reduce((sum, job) => {
                    try {
                      const startDate = new Date(job.creationDate)
                      let endDate = new Date(job.targetDate || job.completionDate || job.creationDate)
                      
                      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                        const timeDiff = endDate.getTime() - startDate.getTime()
                        return sum + Math.ceil(timeDiff / (1000 * 3600 * 24))
                      }
                      return sum
                    } catch {
                      return sum
                    }
                  }, 0)
                  
                  return `${Math.round(totalDays / jobsWithDates.length)}d avg`
                })()}
              </p>
              <p className="text-sm text-gray-600">Avg Contract Length</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Calendar Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedJob.number} - {selectedJob.description}
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedJob.clientName} • {selectedJob.buildingType}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeJobModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Job Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Job Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Status:</span> {selectedJob.status}</p>
                    <p><span className="font-medium">Progress:</span> {selectedJob.progressPercent || 0}%</p>
                    <p><span className="font-medium">Contract Value:</span> ${(selectedJob.contractTotal || 0).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <div className="space-y-1 text-sm">
                    <p>{selectedJob.worksLocationAddress}</p>
                    <p>{selectedJob.worksLocationSuburb}, {selectedJob.worksLocationState} {selectedJob.worksLocationPostcode}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Created:</span> {formatDate(selectedJob.creationDate)}</p>
                    <p><span className="font-medium">Target:</span> {selectedJob.targetDate ? formatDate(selectedJob.targetDate) : 'Not set'}</p>
                    <p><span className="font-medium">Contract Length:</span> {calculateContractLength(selectedJob)}</p>
                    <p><span className="font-medium">Tasks:</span> {selectedJob.tasks ? selectedJob.tasks.length : 0} task{selectedJob.tasks && selectedJob.tasks.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

                            {/* Dynamic Task Timeline View */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Task Timeline</h3>
                    <span className="ml-2 text-sm text-gray-500">
                      {selectedJob.tasks && selectedJob.tasks.length > 0 ? `${selectedJob.tasks.length} tasks` : 'No tasks available'}
                    </span>
                  </div>
                  
                  {/* View Toggle Buttons */}
                  {selectedJob.tasks && selectedJob.tasks.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        onClick={() => setViewMode('list')}
                        className="text-xs"
                      >
                        📋 List
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'calendar' ? 'default' : 'outline'}
                        onClick={() => setViewMode('calendar')}
                        className="text-xs"
                      >
                        📅 Calendar
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'gantt' ? 'default' : 'outline'}
                        onClick={() => setViewMode('gantt')}
                        className="text-xs"
                      >
                        📊 Gantt
                      </Button>
                    </div>
                  )}
                </div>
                

                
                {/* Dynamic Content Based on View Mode */}
                {selectedJob.tasks && Array.isArray(selectedJob.tasks) && selectedJob.tasks.length > 0 ? (
                  <>
                    {/* List View */}
                    {viewMode === 'list' && (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedJob.tasks
                          .filter(task => task && task.taskName && task.startDate)
                          .sort((a, b) => {
                            try {
                              const dateA = new Date(a.startDate).getTime()
                              const dateB = new Date(b.startDate).getTime()
                              return dateA - dateB
                            } catch {
                              return 0
                            }
                          })
                          .map((task, index) => (
                            <div key={`${task.taskId || index}-${task.taskName}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {task.taskName || 'Unnamed Task'}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {task.startDate ? formatDate(task.startDate) : 'No start date'}
                                  {task.endDate && task.endDate !== task.startDate && (
                                    <span> - {formatDate(task.endDate)}</span>
                                  )}
                                </div>
                                {task.note && (
                                  <div className="text-xs text-gray-500 mt-1 italic">
                                    {task.note}
                                  </div>
                                )}
                              </div>
                              <div className="text-right text-xs text-gray-500 flex-shrink-0">
                                <div>
                                  {(() => {
                                    try {
                                      if (!task.startDate) return 'No date'
                                      const start = new Date(task.startDate)
                                      const end = new Date(task.endDate || task.startDate)
                                      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Invalid date'
                                      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
                                      return days === 0 ? 'Same day' : days === 1 ? '1 day' : `${days} days`
                                    } catch {
                                      return 'Date error'
                                    }
                                  })()}
                                </div>
                                {task.sortOrder > 0 && (
                                  <div className="text-gray-400">Order: {task.sortOrder}</div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                    
                    {/* Calendar View */}
                    {viewMode === 'calendar' && (
                      <div className="max-h-96 overflow-y-auto">
                        <CalendarView tasks={selectedJob.tasks} />
                      </div>
                    )}
                    
                    {/* Gantt View */}
                    {viewMode === 'gantt' && (
                      <div className="max-h-96 overflow-y-auto">
                        <GanttView tasks={selectedJob.tasks} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks available for this job</p>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedJob.tasks ? 
                        (Array.isArray(selectedJob.tasks) ? 
                          'Tasks array is empty' : 
                          `Tasks data type: ${typeof selectedJob.tasks}`
                        ) : 
                        'No tasks property found'
                      }
                    </p>
                    <p className="text-xs text-gray-400">
                      Expected format: Array of objects with taskName, startDate, endDate
                    </p>
                  </div>
                )}
                
                {/* Contract Length Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Project Duration</span>
                    <span className="text-sm text-gray-600">{calculateContractLength(selectedJob)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: selectedJob.progressPercent ? `${selectedJob.progressPercent}%` : '0%' 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="font-medium">Name:</span> {selectedJob.clientName}</p>
                    <p><span className="font-medium">City:</span> {selectedJob.clientCityTown}</p>
                    <p><span className="font-medium">State:</span> {selectedJob.clientState}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Phone:</span> {selectedJob.clientPhone || 'Not provided'}</p>
                    <p><span className="font-medium">Mobile:</span> {selectedJob.clientMobile || 'Not provided'}</p>
                    <p><span className="font-medium">Email:</span> {selectedJob.clientEmail || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobViewer
