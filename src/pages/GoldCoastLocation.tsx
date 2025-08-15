import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Star, Shield, Users, Award, CheckCircle, Wind, Droplets, Sun } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';

const GoldCoastLocation = () => {
  const goldCoastData = {
    name: 'Gold Coast',
    title: 'Gold Coast Roofing Services',
    description: 'Expert coastal roofing solutions for the Gold Coast region, from Surfers Paradise to Coolangatta. Coastal roofing specialists who understand the unique challenges of beachside properties.',
    longDescription: 'The Gold Coast\'s coastal environment requires specialized roofing solutions that can withstand salt air, high winds, and tropical weather. Our team has extensive experience in coastal roofing and uses materials specifically designed for these conditions. We understand the unique challenges that Gold Coast properties face, from beachfront homes in Surfers Paradise to hinterland properties in Currumbin.',
    services: [
      { 
        name: 'Coastal Roofing', 
        description: 'Specialized roofing for beachside properties with enhanced protection',
        features: ['Salt-resistant materials', 'Wind-rated installation', 'Coastal building codes', 'Beachfront expertise']
      },
      { 
        name: 'Storm Protection', 
        description: 'Enhanced protection against cyclonic conditions and severe weather',
        features: ['Cyclone-rated materials', 'Wind uplift protection', 'Impact resistance', 'Emergency preparedness']
      },
      { 
        name: 'Roof Installation', 
        description: 'Complete roof installation and replacement for coastal properties',
        features: ['New construction', 'Roof replacement', 'Commercial roofing', 'Residential roofing']
      },
      { 
        name: 'Roof Repairs', 
        description: 'Emergency and scheduled repairs for coastal conditions',
        features: ['Storm damage repair', 'Salt corrosion repair', 'Emergency repairs', 'Preventive maintenance']
      },
      { 
        name: 'Maintenance', 
        description: 'Preventive maintenance for coastal properties',
        features: ['Salt corrosion prevention', 'Regular inspections', 'Gutter maintenance', 'Sealant application']
      }
    ],
    contact: {
      phone: '1300 123 457',
      email: 'goldcoast@arwconstruction.com.au',
      hours: 'Mon-Fri: 7:00 AM - 5:00 PM',
      emergency: '24/7 Emergency Service Available',
      address: 'Gold Coast, Queensland'
    },
    areas: [
      'Surfers Paradise', 'Broadbeach', 'Mermaid Beach', 'Burleigh Heads', 'Coolangatta', 
      'Tweed Heads', 'Palm Beach', 'Currumbin', 'Elanora', 'Tallebudgera',
      'Nobby Beach', 'Kirra', 'Bilinga', 'Tugun', 'Bundall'
    ],
    features: [
      'Coastal roofing specialists with 15+ years experience',
      'Cyclone-rated materials and installation methods',
      'Salt-resistant roofing solutions for beachfront properties',
      'Local Gold Coast team with regional expertise',
      'Understanding of coastal building codes and regulations',
      'Storm damage specialists for tropical weather',
      'Local supplier relationships for faster service',
      'Emergency response within 1 hour across Gold Coast'
    ],
    testimonials: [
      {
        name: 'David L.',
        location: 'Surfers Paradise',
        rating: 5,
        comment: 'Perfect for our beachfront property. They used the right materials for the coastal environment and the installation was flawless. Great understanding of Gold Coast weather challenges.',
        project: 'Beachfront Roof Installation'
      },
      {
        name: 'Lisa R.',
        location: 'Burleigh Heads',
        rating: 5,
        comment: 'Excellent storm protection installation. We feel much safer during cyclone season. The team really knows coastal roofing requirements.',
        project: 'Storm Protection Upgrade'
      },
      {
        name: 'Mark T.',
        location: 'Coolangatta',
        rating: 5,
        comment: 'Fast response after storm damage. They understand the urgency of coastal property protection and got us sorted quickly.',
        project: 'Emergency Storm Repair'
      }
    ],
    whyChoose: [
      {
        icon: Wind,
        title: 'Coastal Weather Expertise',
        description: 'Deep understanding of Gold Coast\'s unique coastal climate and weather patterns'
      },
      {
        icon: Shield,
        title: 'Cyclone Protection',
        description: 'Specialized materials and installation for cyclonic conditions'
      },
      {
        icon: Droplets,
        title: 'Salt Resistance',
        description: 'Materials and treatments designed for salt air exposure'
      },
      {
        icon: Sun,
        title: 'Tropical Climate',
        description: 'Solutions optimized for Gold Coast\'s subtropical environment'
      }
    ],
    coastalChallenges: [
      'Salt air corrosion and degradation',
      'High winds and cyclonic conditions',
      'Intense UV exposure and heat',
      'Tropical storms and heavy rainfall',
      'Coastal building code requirements',
      'Beachfront property regulations'
    ],
    solutions: [
      'Anti-corrosive materials and coatings',
      'Wind-rated installation methods',
      'UV-resistant roofing materials',
      'Enhanced drainage and waterproofing',
      'Council compliance and approvals',
      'Local expertise and relationships'
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO page="location-gold-coast" />
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-arw-navy to-arw-blue text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {goldCoastData.title}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
                {goldCoastData.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-arw-navy hover:bg-gray-100">
                  <Link to="/contact">Get Your Free Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-arw-navy">
                  <Link to="/projects">View Our Gold Coast Projects</Link>
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
                  <CardTitle className="text-2xl text-arw-navy">About Our Gold Coast Roofing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{goldCoastData.longDescription}</p>
                  <p className="text-gray-700 leading-relaxed">Our Gold Coast team specializes in coastal roofing solutions, understanding the unique challenges that beachfront and coastal properties face. From Surfers Paradise to Coolangatta, we provide roofing that stands up to the Gold Coast\'s beautiful but challenging environment.</p>
                </CardContent>
              </Card>

              {/* Coastal Challenges & Solutions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Gold Coast Coastal Challenges & Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-red-600 text-lg mb-4">Coastal Challenges</h4>
                      <div className="space-y-3">
                        {goldCoastData.coastalChallenges.map((challenge, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600 text-lg mb-4">Our Solutions</h4>
                      <div className="space-y-3">
                        {goldCoastData.solutions.map((solution, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{solution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Gold Coast Roofing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {goldCoastData.services.map((service) => (
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
                  <CardTitle className="text-2xl text-arw-navy">Gold Coast Service Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">We provide comprehensive coastal roofing services across the entire Gold Coast region:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goldCoastData.areas.map((area) => (
                      <div key={area} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm text-center">
                        {area}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose ARW in Gold Coast */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Why Choose ARW Construction on the Gold Coast?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goldCoastData.whyChoose.map((item, index) => (
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
                  <CardTitle className="text-2xl text-arw-navy">What Our Gold Coast Clients Say</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {goldCoastData.testimonials.map((testimonial, index) => (
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
                  <CardTitle className="text-xl text-arw-navy">Gold Coast Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{goldCoastData.contact.phone}</div>
                      <div className="text-sm text-gray-600">Gold Coast Office</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{goldCoastData.contact.email}</div>
                      <div className="text-sm text-gray-600">Email Us</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{goldCoastData.contact.hours}</div>
                      <div className="text-sm text-gray-600">Business Hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{goldCoastData.contact.address}</div>
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
                  <p className="text-red-700 text-sm mb-4">{goldCoastData.contact.emergency}</p>
                  <p className="text-red-700 text-sm mb-4">Response time: Within 1 hour across Gold Coast</p>
                  <Button variant="destructive" className="w-full">
                    Emergency Call Now
                  </Button>
                </CardContent>
              </Card>

              {/* Gold Coast Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-arw-navy">Gold Coast-Specific Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {goldCoastData.features.map((feature, index) => (
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

export default GoldCoastLocation;
