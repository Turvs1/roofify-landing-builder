import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ArrowLeft, Building } from 'lucide-react'
import JobViewer from '../components/JobViewer'

const JobViewerPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Job Viewer
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button
                onClick={() => navigate('/admin')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Admin Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobViewer />
      </div>
    </div>
  )
}

export default JobViewerPage
