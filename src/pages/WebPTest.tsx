import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/OptimizedImage';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const WebPTest: React.FC = () => {
  const testImages = [
    {
      original: '/lovable-uploads/11B.jpeg',
      webp: '/lovable-uploads/11B.webp',
      name: '11B.jpeg → 11B.webp',
      originalSize: '5.38MB',
      webpSize: '2.86MB',
      savings: '46.9%'
    },
    {
      original: '/lovable-uploads/3ee46c44-f951-4697-8c7f-201d5b6d0708.png',
      webp: '/lovable-uploads/3ee46c44-f951-4697-8c7f-201d5b6d0708.webp',
      name: '3ee46c44-f951-4697-8c7f-201d5b6d0708.png → .webp',
      originalSize: '2.88MB',
      webpSize: '0.46MB',
      savings: '84.1%'
    },
    {
      original: '/lovable-uploads/fb563d81-45ca-4e5c-897c-7e75e4b99205.png',
      webp: '/lovable-uploads/fb563d81-45ca-4e5c-897c-7e75e4b99205.webp',
      name: 'fb563d81-45ca-4e5c-897c-7e75e4b99205.png → .webp',
      originalSize: '2.89MB',
      webpSize: '0.33MB',
      savings: '88.5%'
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="section-container">
          <h1 className="section-heading">WebP Image Test</h1>
          <p className="section-subheading">Testing WebP conversion and optimization</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testImages.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-sm">{image.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Original: {image.originalSize}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-green-600">
                      WebP: {image.webpSize}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {image.savings} smaller
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Original Image:</h4>
                    <img 
                      src={image.original} 
                      alt={`Original ${image.name}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">WebP Version:</h4>
                    <OptimizedImage 
                      src={image.original}
                      webpSrc={image.webp}
                      alt={`WebP ${image.name}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">WebP Conversion Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-green-600">✅ Benefits:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>64.8% average size reduction</li>
                  <li>13.23MB total space savings</li>
                  <li>Better Core Web Vitals scores</li>
                  <li>Faster page loading</li>
                  <li>Automatic fallback for older browsers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-600">🔧 Technical Details:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>WebP quality: 85% (optimal balance)</li>
                  <li>Automatic format detection</li>
                  <li>Picture element with fallbacks</li>
                  <li>Lazy loading support</li>
                  <li>Responsive image handling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WebPTest;
