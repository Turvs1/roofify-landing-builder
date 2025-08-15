import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Star, Shield, Users, Award, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';

const BrisbaneLocation = () => {
  const brisbaneData = {
    name: 'Brisbane',
    title: 'Brisbane Roofing Services',
    description: 'Professional roofing services across Greater Brisbane and surrounding suburbs. We understand the unique challenges of Brisbane\'s subtropical climate and provide expert solutions for all your roofing needs.',
    longDescription: 'Brisbane\'s subtropical climate presents unique challenges for roofing, from intense summer storms to high humidity. Our local expertise ensures your roof is built to withstand these conditions while maintaining energy efficiency and aesthetic appeal. With over 15 years of experience serving Brisbane, we know the local building codes, weather patterns, and architectural styles that make our city unique.',
    services: [
      { 
        name: 'Roof Installation', 
        description: 'Complete roof installation for new builds and replacements',
        features: ['New construction roofing', 'Roof replacement', 'Commercial roofing', 'Residential roofing']
      },
      { 
        name: 'Roof Repairs', 
        description: 'Emergency and scheduled roof repairs across Brisbane',
        features: ['Storm damage repair', 'Leak repairs', 'Emergency repairs', 'Preventive maintenance']
      },
      { 
        name: 'Roof Maintenance', 
        description: 'Preventive maintenance to extend roof lifespan',
        features: ['Regular inspections', 'Gutter cleaning', 'Moss removal', 'Sealant application']
      },
      { 
        name: 'New Construction', 
        description: 'Roofing for new residential and commercial buildings',
        features: ['Project management', 'Design consultation', 'Quality control', 'Timeline management']
      },
      { 
        name: 'Renovations', 
        description: 'Roof renovations and upgrades for existing properties',
        features: ['Heritage restoration', 'Modern upgrades', 'Energy efficiency', 'Aesthetic improvements']
      }
    ],
    contact: {
      phone: '1300 123 456',
      email: 'brisbane@arwconstruction.com.au',
      hours: 'Mon-Fri: 7:00 AM - 5:00 PM',
      emergency: '24/7 Emergency Service Available',
      address: 'Brisbane CBD, Queensland'
    },
    areas: [
      'CBD', 'North Brisbane', 'South Brisbane', 'East Brisbane', 'West Brisbane', 
      'Inner Suburbs', 'Outer Suburbs', 'Paddington', 'New Farm', 'West End',
      'Kangaroo Point', 'Bulimba', 'Hamilton', 'Ascot', 'Clayfield'
    ],
    features: [
      'Local Brisbane team with 15+ years experience',
      'Understanding of Brisbane City Council requirements',
      'Storm damage specialists for subtropical climate',
      'Energy-efficient roofing solutions',
      'Heritage property expertise',
      'Local supplier relationships for faster service',
      'Brisbane-specific building code knowledge',
      'Emergency response within 2 hours'
    ],
    testimonials: [
      {
        name: 'Sarah M.',
        location: 'Paddington',
        rating: 5,
        comment: 'ARW did an amazing job on our heritage roof restoration. They understood the local requirements perfectly and worked with the Brisbane City Council to ensure everything was compliant.',
        project: 'Heritage Roof Restoration'
      },
      {
        name: 'Michael T.',
        location: 'New Farm',
        rating: 5,
        comment: 'Fast response after the storm damage. Professional service and excellent workmanship. They really understand Brisbane weather challenges.',
        project: 'Storm Damage Repair'
      },
      {
        name: 'Jennifer L.',
        location: 'West End',
        rating: 5,
        comment: 'Great work on our commercial property. They managed the project efficiently and kept us informed throughout the process.',
        project: 'Commercial Roof Installation'
      }
    ],
    whyChoose: [
      {
        icon: MapPin,
        title: 'Local Brisbane Expertise',
        description: 'Deep knowledge of Brisbane\'s unique climate, building codes, and architectural heritage'
      },
      {
        icon: Clock,
        title: 'Fast Local Response',
        description: 'Emergency response within 2 hours across Greater Brisbane area'
      },
      {
        icon: Shield,
        title: 'Council Compliance',
        description: 'Full understanding of Brisbane City Council requirements and approval processes'
      },
      {
        icon: Users,
        title: 'Local Team',
        description: 'Brisbane-based team with intimate knowledge of local suppliers and conditions'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO page="location-brisbane" />
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-arw-navy to-arw-blue text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {brisbaneData.title}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
                {brisbaneData.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-arw-navy hover:bg-gray-100">
                  <Link to="/contact">Get Your Free Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-arw-navy">
                  <Link to="/projects">View Our Brisbane Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">About Our Brisbane Roofing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{brisbaneData.longDescription}</p>
                  <p className="text-gray-700 leading-relaxed">Our Brisbane team has been serving the local community for over 15 years, building strong relationships with local suppliers, council officials, and property owners. We understand the unique challenges that Brisbane properties face, from heritage homes in Paddington to modern developments in New Farm.</p>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Brisbane Roofing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {brisbaneData.services.map((service) => (
                      <div key={service.name} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-arw-navy text-lg mb-3">{service.name}</h4>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {service.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-arw-blue" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Brisbane Service Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">We provide comprehensive roofing services across all of Greater Brisbane and surrounding suburbs:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {brisbaneData.areas.map((area) => (
                      <div key={area} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm text-center">
                        {area}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose ARW in Brisbane */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Why Choose ARW Construction in Brisbane?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {brisbaneData.whyChoose.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-arw-blue rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-arw-navy mb-2">{item.title}</h4>
                          <p className="text-gray-700 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">What Our Brisbane Clients Say</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {brisbaneData.testimonials.map((testimonial, index) => (
                      <div key={index} className="p-6 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-3 text-lg italic">"{testimonial.comment}"</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-gray-600">
                            <strong className="text-arw-navy">{testimonial.name}</strong> - {testimonial.location}
                          </div>
                          <div className="text-sm text-arw-blue font-medium mt-2 sm:mt-0">
                            {testimonial.project}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-arw-navy">Brisbane Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{brisbaneData.contact.phone}</div>
                      <div className="text-sm text-gray-600">Brisbane Office</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{brisbaneData.contact.email}</div>
                      <div className="text-sm text-gray-600">Email Us</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{brisbaneData.contact.hours}</div>
                      <div className="text-sm text-gray-600">Business Hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{brisbaneData.contact.address}</div>
                      <div className="text-sm text-gray-600">Service Area</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button asChild className="w-full bg-arw-blue hover:bg-arw-navy">
                      <Link to="/contact">Get a Quote</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Service */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-xl text-red-800">24/7 Emergency Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 text-sm mb-4">{brisbaneData.contact.emergency}</p>
                  <p className="text-red-700 text-sm mb-4">Response time: Within 2 hours across Brisbane</p>
                  <Button variant="destructive" className="w-full">
                    Emergency Call Now
                  </Button>
                </CardContent>
              </Card>

              {/* Brisbane Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-arw-navy">Brisbane-Specific Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {brisbaneData.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-arw-blue mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/locations">
                      ← Back to All Locations
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/services">
                      View All Services
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/projects">
                      See Our Projects
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrisbaneLocation;
