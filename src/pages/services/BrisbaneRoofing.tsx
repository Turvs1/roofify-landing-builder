import React, { useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Award, Shield, Users, Phone } from 'lucide-react';

const BrisbaneRoofing = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page="brisbaneRoofing" />
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-24 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Brisbane Roofing Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Premium Roofing Solutions Across Brisbane & Surrounding Suburbs
          </p>
          <Button size="lg" className="bg-arw-blue hover:bg-white hover:text-arw-navy">
            Get Brisbane Quote
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Service Overview */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-arw-navy mb-6">Brisbane's Trusted Roofing Contractor</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            ARW Construction delivers exceptional roofing services throughout Brisbane, from the CBD to outer suburbs. 
            Our local expertise covers everything from heritage restoration in Paddington to modern installations in Chermside.
          </p>
        </div>

        {/* Brisbane Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-arw-navy mb-2">CBD & Inner City</h3>
            <p className="text-gray-600">Commercial roofing, heritage buildings, and modern installations in Brisbane's heart.</p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-arw-navy mb-2">Heritage Suburbs</h3>
            <p className="text-gray-600">Paddington, West End, and heritage restoration expertise with local council compliance.</p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-arw-navy mb-2">Northern Suburbs</h3>
            <p className="text-gray-600">Chermside, North Lakes, and modern residential roofing solutions.</p>
          </Card>
        </div>

        {/* Local Expertise */}
        <div className="bg-arw-navy text-white rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ARW for Brisbane Roofing?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Local Knowledge</h3>
              <ul className="space-y-2">
                <li>• Brisbane council compliance expertise</li>
                <li>• Heritage building regulations knowledge</li>
                <li>• Local climate considerations</li>
                <li>• Storm season preparation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Service Areas</h3>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">CBD</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">Paddington</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">West End</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">Chermside</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">North Lakes</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">Indooroopilly</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Services Offered */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Brisbane Roofing Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-arw-navy mb-3">Heritage Restoration</h3>
              <p className="text-gray-600 mb-4">Specialized heritage roofing in Paddington, West End, and historic Brisbane areas.</p>
              <Badge variant="outline" className="bg-arw-blue/10 text-arw-blue border-arw-blue/30">Heritage Expert</Badge>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-arw-navy mb-3">Storm Damage Repair</h3>
              <p className="text-gray-600 mb-4">Emergency storm damage repairs across all Brisbane suburbs with 2-hour response.</p>
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">Emergency Service</Badge>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-arw-navy mb-3">Commercial Roofing</h3>
              <p className="text-gray-600 mb-4">CBD commercial roofing, office buildings, and retail center solutions.</p>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Commercial</Badge>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-arw-navy to-arw-blue text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-6">Ready for Brisbane Roofing Excellence?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get your free Brisbane roofing assessment and quote today. 
            Our local team understands Brisbane's unique challenges.
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

export default BrisbaneRoofing;
