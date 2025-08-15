import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const AboutUs = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page="about" />
      <Navigation />
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-20 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About ARW Construction</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Building excellence in roofing and construction across Australia
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Company Overview */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-arw-navy mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 mb-6">
              ARW Construction has been at the forefront of the Australian construction industry, 
              specializing in premium roofing solutions and comprehensive construction services. 
              Our journey began with a simple mission: to deliver exceptional quality and 
              reliability in every project we undertake.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              With decades of combined experience, our team has successfully completed 
              thousands of projects across residential, commercial, and industrial sectors, 
              earning a reputation for excellence, innovation, and customer satisfaction.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="text-arw-navy bg-arw-blue/20">
                Established Excellence
              </Badge>
              <Badge variant="secondary" className="text-arw-navy bg-arw-blue/20">
                Quality Focused
              </Badge>
              <Badge variant="secondary" className="text-arw-navy bg-arw-blue/20">
                Customer Driven
              </Badge>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/4507aff9-e454-4cb3-90f1-f6ff248c35ec.png" 
              alt="ARW Construction team at work" 
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-arw-navy font-semibold">Trusted by 1000+ clients</p>
            </div>
          </div>
        </div>

        <Separator className="my-16" />

        {/* Mission & Values */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-arw-navy mb-12">Our Mission & Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-arw-navy">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our work, from initial planning 
                  to final completion, ensuring the highest standards of quality and craftsmanship.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-arw-navy">Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We conduct our business with honesty, transparency, and ethical practices, 
                  building lasting relationships based on trust and mutual respect.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-arw-navy">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We embrace new technologies and innovative approaches to deliver 
                  superior solutions that meet the evolving needs of our clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>



        {/* Certifications & Awards */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-arw-navy mb-12">Certifications & Awards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg text-center p-6">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-arw-navy mb-2">ISO 9001</h3>
              <p className="text-sm text-gray-600">Quality Management</p>
            </Card>

            <Card className="border-0 shadow-lg text-center p-6">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-arw-navy mb-2">ISO 14001</h3>
              <p className="text-sm text-gray-600">Environmental Management</p>
            </Card>

            <Card className="border-0 shadow-lg text-center p-6">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-arw-navy mb-2">AS/NZS 4801</h3>
              <p className="text-sm text-gray-600">Safety Management</p>
            </Card>

            <Card className="border-0 shadow-lg text-center p-6">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-arw-navy mb-2">Master Builders</h3>
              <p className="text-sm text-gray-600">Association Member</p>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
