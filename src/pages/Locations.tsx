import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Users } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';

const Locations = () => {
  const locations = [
    {
      id: 'brisbane',
      name: 'Brisbane',
      slug: 'brisbane',
      description: 'Professional roofing services across Greater Brisbane and surrounding suburbs',
      image: '/public/lovable-uploads/brisbane-skyline.jpg',
      services: ['Roof Installation', 'Roof Repairs', 'Roof Maintenance', 'New Construction', 'Renovations'],
      contact: {
        phone: '1300 123 456',
        email: 'brisbane@arwconstruction.com.au',
        hours: 'Mon-Fri: 7:00 AM - 5:00 PM'
      },
      areas: ['CBD', 'North Brisbane', 'South Brisbane', 'East Brisbane', 'West Brisbane', 'Inner Suburbs']
    },
    {
      id: 'gold-coast',
      name: 'Gold Coast',
      slug: 'gold-coast',
      description: 'Expert roofing solutions for the Gold Coast region, from Surfers Paradise to Coolangatta',
      image: '/public/lovable-uploads/gold-coast-beach.jpg',
      services: ['Roof Installation', 'Roof Repairs', 'Roof Maintenance', 'New Construction', 'Renovations'],
      contact: {
        phone: '1300 123 457',
        email: 'goldcoast@arwconstruction.com.au',
        hours: 'Mon-Fri: 7:00 AM - 5:00 PM'
      },
      areas: ['Surfers Paradise', 'Broadbeach', 'Mermaid Beach', 'Burleigh Heads', 'Coolangatta', 'Tweed Heads']
    },
    {
      id: 'sunshine-coast',
      name: 'Sunshine Coast',
      slug: 'sunshine-coast',
      description: 'Reliable roofing services throughout the beautiful Sunshine Coast region',
      image: '/public/lovable-uploads/sunshine-coast-mountains.jpg',
      services: ['Roof Installation', 'Roof Repairs', 'Roof Maintenance', 'New Construction', 'Renovations'],
      contact: {
        phone: '1300 123 458',
        email: 'sunshinecoast@arwconstruction.com.au',
        hours: 'Mon-Fri: 7:00 AM - 5:00 PM'
      },
      areas: ['Caloundra', 'Mooloolaba', 'Maroochydore', 'Noosa', 'Coolum', 'Peregian Beach']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO page="locations" />
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-arw-navy to-arw-blue text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Our Service Locations
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Professional roofing services across Queensland's most beautiful regions
              </p>
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location) => (
              <Card key={location.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-gray-400" />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">{location.name}</CardTitle>
                  <p className="text-gray-600">{location.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Services */}
                  <div>
                    <h4 className="font-semibold text-arw-navy mb-2">Services Available</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map((service) => (
                        <span key={service} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div>
                    <h4 className="font-semibold text-arw-navy mb-2">Service Areas</h4>
                    <div className="text-sm text-gray-600">
                      {location.areas.join(', ')}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-arw-blue" />
                      <span>{location.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-arw-blue" />
                      <span>{location.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-arw-blue" />
                      <span>{location.contact.hours}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="flex gap-2 pt-4">
                  <Button asChild className="flex-1 bg-arw-blue hover:bg-arw-navy">
                    <Link to={`/locations/${location.slug}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/contact">
                      Get Quote
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Why Choose ARW Section */}
          <section className="py-16 bg-gray-50">
            <div className="section-container">
              <h2 className="text-3xl md:text-4xl font-bold text-arw-navy mb-8">
                Why Choose ARW Construction?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-arw-navy mb-2">Local Expertise</h3>
                  <p className="text-gray-600">Deep knowledge of local building codes, weather conditions, and architectural styles</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-arw-navy mb-2">Quick Response</h3>
                  <p className="text-gray-600">Fast local response times for emergencies and urgent repairs</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-arw-navy mb-2">Local Support</h3>
                  <p className="text-gray-600">Dedicated local teams and support for ongoing maintenance</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Locations;
