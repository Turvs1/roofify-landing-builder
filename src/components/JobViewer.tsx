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
import { Search, Filter, MapPin, Building, Calendar, Hash } from 'lucide-react'

// Types based on the updated Google Apps Script response
interface Job {
  description: string
  number: string
  clientName: string
  worksLocationAddress: string
  worksLocationSuburb: string
  worksLocationState: string
  worksLocationPostcode: string | number
  buildingType: string
  jobId: string
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
  const [sortField, setSortField] = useState<keyof Job>('number')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Fetch jobs from Google Sheets
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('https://script.google.com/macros/s/AKfycbxAeT0tXnBGwhw7NaoAvgdhUHz412L4ESPi62gtx0SUruZnEdUOn6nUi6APrOWxlrlekg/exec')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`)
        }
        
        const data = await response.json()
        setJobs(data)
        setFilteredJobs(data)
      } catch (error) {
        console.error('Error fetching jobs:', error)
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
        job.worksLocationAddress.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && job.buildingType !== 'Blank Template') ||
        (statusFilter === 'template' && job.buildingType === 'Blank Template')

      const matchesBuildingType = buildingTypeFilter === 'all' || 
        job.buildingType === buildingTypeFilter

      return matchesSearch && matchesStatus && matchesBuildingType
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
  }, [jobs, searchTerm, statusFilter, buildingTypeFilter, sortField, sortDirection])

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

  // Format postcode
  const formatPostcode = (postcode: string | number) => {
    if (!postcode) return '-'
    return postcode.toString()
  }

  // Get location display
  const getLocationDisplay = (job: Job) => {
    const parts = [
      job.worksLocationAddress,
      job.worksLocationSuburb,
      job.worksLocationState,
      formatPostcode(job.worksLocationPostcode)
    ].filter(Boolean)
    
    return parts.length > 0 ? parts.join(', ') : 'Location not specified'
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setBuildingTypeFilter('all')
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
                      <TableCell className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium text-sm leading-tight">
                            {job.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {job.jobId.slice(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32">
                          <p className="text-sm font-medium truncate" title={job.clientName}>
                            {job.clientName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate" title={getLocationDisplay(job)}>
                            {getLocationDisplay(job)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.buildingType)}>
                          {job.buildingType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default JobViewer
