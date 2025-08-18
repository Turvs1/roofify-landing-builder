import React, { useState } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const PreWorksForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      <div className="p-2 sm:p-4 mt-24">
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">PreWorks Form</h1>
            <p className="text-center text-gray-600 mb-6">
              This is a simplified version to test loading.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter job description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter client name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notes"
                />
              </div>
              
              <button 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Submit Form'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default PreWorksForm
