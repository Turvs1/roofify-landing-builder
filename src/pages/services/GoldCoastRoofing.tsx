import React, { useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Award, Shield, Users, Phone, Wind, Droplets } from 'lucide-react';

const GoldCoastRoofing = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page="goldCoastRoofing" />
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-24 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Gold Coast Roofing Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Expert Roofing Solutions Across the Gold Coast & Hinterland
          </p>
          <Button size="lg" className="bg-arw-blue hover:bg-white hover:text-arw-navy">
            Get Gold Coast Quote
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Service Overview */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-arw-navy mb-6">Coastal Roofing Excellence</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            ARW Construction provides premium roofing services throughout the Gold Coast, from Surfers Paradise to the hinterland. 
            Our coastal expertise ensures your roof withstands salt air, humidity, and tropical storms.
          </p>
        </div>

        {/* Gold Coast Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-arw-navy mb-2">Beachfront Areas</h3>
            <p className="text-gray-600">Surfers Paradise, Broadbeach, Burleigh Heads with salt-resistant roofing solutions.</p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Wind className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-arw-navy mb-2">Storm Protection</h3>
            <p className="text-gray-600">High wind resistance and tropical storm protection for all coastal properties.</p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-arw-navy mb-2">Hinterland Heritage</h3>
            <p className="text-gray-600">Tamborine Mountain, Nerang heritage restoration and hinterland expertise.</p>
          </Card>
        </div>

        {/* Coastal Expertise */}
        <div className="bg-gradient-to-r from-arw-navy to-arw-blue text-white rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Gold Coast Coastal Expertise</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                Salt Air Protection
              </h3>
              <ul className="space-y-2">
                <li>• Marine-grade roofing materials</li>
                <li>• Advanced corrosion protection</li>
                <li>• Salt spray resistant coatings</li>
                <li>• Coastal building compliance</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wind className="w-5 h-5" />
                Storm Resistance
              </h3>
              <ul className="space-y-2">
                <li>• High wind resistance systems</li>
                <li>• Tropical storm preparation</li>
                <li>• Emergency response services</li>
                <li>• Coastal weather optimization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-8">Gold Coast Service Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Surfers Paradise</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Broadbeach</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Burleigh Heads</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Coolangatta</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Palm Beach</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Tamborine Mountain</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Helensvale</Badge>
          </div>
        </div>

        {/* Services Offered */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Gold Coast Roofing Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-arw-navy mb-3">Coastal Roofing</h3>
              <p className="text-gray-600 mb-4">Salt-resistant materials and corrosion protection for beachfront properties.</p>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Coastal Expert</Badge>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-arw-navy mb-3">Storm Protection</h3>
              <p className="text-gray-600 mb-4">High wind resistance and tropical storm damage prevention systems.</p>
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">Storm Ready</Badge>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-arw-navy mb-3">Hinterland Heritage</h3>
              <p className="text-gray-600 mb-4">Heritage restoration in Tamborine Mountain and hinterland areas.</p>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Heritage</Badge>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-arw-navy to-arw-blue text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-6">Ready for Gold Coast Roofing Excellence?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get your free Gold Coast roofing assessment and quote today. 
            Our coastal expertise ensures your roof withstands the Gold Coast environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-arw-navy hover:bg-gray-100">
              Get Free Quote
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-arw-navy">
              Call Now: 0423 736 921
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GoldCoastRoofing;
