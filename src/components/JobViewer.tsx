import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
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
import { Activity, BarChart3, DollarSign, Search, Filter, MapPin, Building, Calendar, Hash, X } from 'lucide-react'

// Types based on the updated Google Apps Script response
interface Job {
  // Basic Job Info
  jobId: string
  number: string
  description: string
  buildingType: string
  status: string
  
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
  
  // Task Information (for contract length calculation)
  tasks?: Array<{
    taskId: string
    taskName: string
    startDate: string
    endDate?: string
    sortOrder?: number
    note?: string
    estimatedCost?: number
    actualCost?: number
  }>
}

interface JobViewerProps {
  className?: string
}

const JobViewer: React.FC<JobViewerProps> = ({ className = "" }) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [buildingTypeFilter, setBuildingTypeFilter] = useState<string>('all')
  const [jobStatusFilter, setJobStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<keyof Job>('number')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch jobs from Google Sheets
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        
        // Test the API endpoint directly
        console.log('🔍 Testing API endpoint...')
        const response = await fetch('https://script.googleusercontent.com/a/macros/arwc.com.au/echo?user_content_key=AehSKLg4x3SdAd8vXyliq0RjdM51narpacCFKMcCHhFPZgy8Mn400VhQsVM4_r2cyU9yZbIYUl42Dgv6nM8aJ-S5w8uYWpMLKB4w5LG9U3ip6QwBmHJnyMeWkzhrezQ9GN8WvlpJxppFCulFwnAkvPF6IMTU601PHzr0Dmuez9vtQ3JG_kmdYmeG72lvBv2BiT1cHIW12FYhkDW5ugXa0I_FjqynR8idnbHE6jlDsSmfhQ_NcKnOEcuoV20MSc8otfBHJrjIKXOo1JyZyEB5QfQf1DAzUsdCzkPYhL322UaFLMPoQW-9hD8&lib=Mr_6vjm8FUyFK9RyrPAOaVwA6AJu5-yHf')
        
        console.log('📡 Response status:', response.status)
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
        
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📊 Raw API response:', data) // Debug log
        console.log('📊 Raw API response type:', typeof data)
        console.log('📊 Raw API response length:', Array.isArray(data) ? data.length : 'Not an array')
        
        // Check if data has the expected structure
        if (Array.isArray(data) && data.length > 0) {
          console.log('🏗️ First job structure:', Object.keys(data[0]))
          console.log('🏗️ First job sample:', data[0])
          
          // Check for tasks in the first job
          if (data[0].tasks !== undefined) {
            console.log('✅ Tasks property found:', data[0].tasks)
            console.log('✅ Tasks type:', typeof data[0].tasks)
            console.log('✅ Tasks is array:', Array.isArray(data[0].tasks))
          } else {
            console.log('❌ No tasks property found in first job')
          }
        }
        
        // Process the data to group tasks with their main jobs
        const processedJobs = processJobData(data)
        console.log('🔄 Processed jobs:', processedJobs) // Debug log
        
        setJobs(processedJobs)
        setFilteredJobs(processedJobs)
      } catch (error) {
        console.error('❌ Error fetching jobs:', error)
        // Set some sample data for development/testing
        setJobs([])
        setFilteredJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter and sort jobs
  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = 
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.worksLocationSuburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.worksLocationAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.buildingType.toLowerCase().includes(searchTerm.toLowerCase())

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

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, statusFilter, buildingTypeFilter, jobStatusFilter, sortField, sortDirection])

  // Get unique building types for filter
  const buildingTypes = ['all', ...Array.from(new Set(jobs.map(job => job.buildingType)))]

  // Handle column sorting
  const handleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Get status badge color
  const getStatusColor = (buildingType: string) => {
    if (buildingType === 'Blank Template') return 'bg-gray-100 text-gray-800'
    if (buildingType.includes('Roof Replacement')) return 'bg-blue-100 text-blue-800'
    if (buildingType.includes('Single storey')) return 'bg-green-100 text-green-800'
    if (buildingType.includes('Renovation')) return 'bg-purple-100 text-purple-800'
    if (buildingType.includes('Repairs')) return 'bg-orange-100 text-orange-800'
    return 'bg-slate-100 text-slate-800'
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  // Process raw API data with enhanced debugging and proper task grouping
  const processJobData = (rawData: any[]) => {
    console.log('Processing raw data:', rawData) // Debug log
    
    // Group rows by jobId - some rows are jobs, some are tasks
    const jobMap = new Map()
    
    rawData.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, {
        jobId: row.jobId,
        number: row.number,
        taskName: row.taskName,
        hasTaskData: !!(row.taskName && row.startDate),
        rowType: row.taskName ? 'TASK' : 'JOB'
      })
      
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
        console.log(`Added task "${row.taskName}" to job ${row.number}`)
      }
    })
    
    // Convert map to array and sort tasks by sortOrder
    const processedData = Array.from(jobMap.values()).map(job => {
      // Sort tasks by sortOrder
      job.tasks.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      
      console.log(`Job ${job.number}: Final result with ${job.tasks.length} tasks:`, job.tasks.map(t => t.taskName))
      
      return job
    })
    
    console.log('Final processed data:', processedData)
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
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            
            {/* Test API Button */}
            <Button
              variant="outline"
              onClick={async () => {
                console.log('🧪 Testing API manually...')
                try {
                  const response = await fetch('https://script.googleusercontent.com/a/macros/arwc.com.au/echo?user_content_key=AehSKLg4x3SdAd8vXyliq0RjdM51narpacCFKMcCHhFPZgy8Mn400VhQsVM4_r2cyU9yZbIYUl42Dgv6nM8aJ-S5w8uYWpMLKB4w5LG9U3ip6QwBmHJnyMeWkzhrezQ9GN8WvlpJxppFCulFwnAkvPF6IMTU601PHzr0Dmuez9vtQ3JG_kmdYmeG72lvBv2BiT1cHIW12FYhkDW5ugXa0I_FjqynR8idnbHE6jlDsSmfhQ_NcKnOEcuoV20MSc8otfBHJrjIKXOo1JyZyEB5QfQf1DAzUsdCzkPYhL322UaFLMPoQW-9hD8&lib=Mr_6vjm8FUyFK9RyrPAOaVwA6AJu5-yHf')
                  const data = await response.json()
                  console.log('🧪 Manual API test result:', data)
                  
                  // Check for task data
                  const hasTaskData = data.some(row => row.taskName && row.startDate)
                  const taskRows = data.filter(row => row.taskName && row.startDate)
                  
                  console.log('🔍 Task data analysis:')
                  console.log('- Has task data:', hasTaskData)
                  console.log('- Task rows found:', taskRows.length)
                  console.log('- Sample task row:', taskRows[0])
                  
                  alert(`API Test: ${Array.isArray(data) ? data.length : 'Not array'} items returned\nTask rows: ${taskRows.length}`)
                } catch (error) {
                  console.error('🧪 Manual API test failed:', error)
                  alert('API test failed - check console')
                }
              }}
              className="flex items-center gap-2"
            >
              🧪 Test API
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

                            {/* Task Timeline View */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Task Timeline</h3>
                  <span className="ml-2 text-sm text-gray-500">
                    {selectedJob.tasks && selectedJob.tasks.length > 0 ? `${selectedJob.tasks.length} tasks` : 'No tasks available'}
                  </span>
                </div>
                
                {/* Debug info - remove this in production */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <strong>Debug Info:</strong> Tasks data: {JSON.stringify(selectedJob.tasks, null, 2)}
                </div>
                
                {selectedJob.tasks && Array.isArray(selectedJob.tasks) && selectedJob.tasks.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedJob.tasks
                      .filter(task => task && task.taskName && task.startDate) // Filter out invalid tasks
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
