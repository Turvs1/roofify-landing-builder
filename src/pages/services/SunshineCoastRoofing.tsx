import React, { useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Award, Shield, Users, Phone, Wind, Droplets, Mountain } from 'lucide-react';

const SunshineCoastRoofing = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page="sunshineCoastRoofing" />
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-24 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Sunshine Coast Roofing Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Professional Roofing Solutions from Caloundra to Noosa
          </p>
          <Button size="lg" className="bg-arw-blue hover:bg-white hover:text-arw-navy">
            Get Sunshine Coast Quote
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Service Overview */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-arw-navy mb-6">Coastal & Hinterland Excellence</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            ARW Construction delivers exceptional roofing services across the Sunshine Coast, from the beautiful beaches of Caloundra 
            to the stunning landscapes of Noosa. Our local expertise ensures your roof thrives in the coastal environment.
          </p>
        </div>

        {/* Sunshine Coast Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-arw-navy mb-2">Coastal Areas</h3>
            <p className="text-gray-600">Caloundra, Mooloolaba, Maroochydore, Noosa with coastal roofing expertise.</p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-arw-navy mb-2">Hinterland Charm</h3>
            <p className="text-gray-600">Maleny, Montville heritage restoration and hinterland roofing solutions.</p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-arw-navy mb-2">Heritage Expertise</h3>
            <p className="text-gray-600">Historic building restoration and heritage compliance across all areas.</p>
          </Card>
        </div>

        {/* Dual Environment Expertise */}
        <div className="bg-gradient-to-r from-arw-navy to-arw-blue text-white rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Sunshine Coast Dual Environment Expertise</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                Coastal Protection
              </h3>
              <ul className="space-y-2">
                <li>• Salt air resistant materials</li>
                <li>• Coastal building compliance</li>
                <li>• Storm damage prevention</li>
                <li>• Tropical climate optimization</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                Hinterland Solutions
              </h3>
              <ul className="space-y-2">
                <li>• Heritage building restoration</li>
                <li>• Local council compliance</li>
                <li>• Hinterland weather protection</li>
                <li>• Traditional building techniques</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-8">Sunshine Coast Service Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Caloundra</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-blue border-arw-blue/300 p-3 text-center">Mooloolaba</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Maroochydore</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Noosa Heads</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Coolum Beach</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Maleny</Badge>
            <Badge variant="outline" className="bg-arw-blue/10 text-arw-navy border-arw-blue/300 p-3 text-center">Montville</Badge>
          </div>
        </div>

        {/* Services Offered */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Sunshine Coast Roofing Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-arw-navy mb-3">Coastal Roofing</h3>
              <p className="text-gray-600 mb-4">Salt-resistant materials and coastal environment protection for beachfront properties.</p>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Coastal Expert</Badge>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-arw-navy mb-3">Heritage Restoration</h3>
              <p className="text-gray-600 mb-4">Historic building restoration and heritage compliance in Maleny and Montville.</p>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Heritage</Badge>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-arw-navy mb-3">Tropical Climate</h3>
              <p className="text-gray-600 mb-4">Tropical weather optimization and storm protection for all Sunshine Coast areas.</p>
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">Tropical Ready</Badge>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-arw-navy to-arw-blue text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-6">Ready for Sunshine Coast Roofing Excellence?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get your free Sunshine Coast roofing assessment and quote today. 
            Our dual environment expertise ensures your roof thrives in both coastal and hinterland conditions.
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

export default SunshineCoastRoofing;
