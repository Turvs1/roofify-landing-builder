import React from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const PreWorksFormTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      <div className="p-2 sm:p-4 mt-24">
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">PreWorks Form Test</h1>
            <p className="text-center text-gray-600">
              This is a test version to check if the basic component loads.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold text-blue-800">Component Status:</h2>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>✅ Navigation component loaded</li>
                <li>✅ Basic structure rendered</li>
                <li>✅ Tailwind CSS working</li>
                <li>✅ Component mounted successfully</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default PreWorksFormTest
