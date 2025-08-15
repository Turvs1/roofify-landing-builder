import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Star, Shield, Users, Award, CheckCircle, Mountain, Leaf, Sun, CloudRainIcon } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';

const SunshineCoastLocation = () => {
  const sunshineCoastData = {
    name: 'Sunshine Coast',
    title: 'Sunshine Coast Roofing Services',
    description: 'Reliable roofing services throughout the beautiful Sunshine Coast region. From Caloundra to Noosa, we provide expert roofing solutions for this unique coastal and hinterland area.',
    longDescription: 'The Sunshine Coast combines coastal beauty with hinterland charm, requiring versatile roofing solutions. Our team understands the local climate variations and provides roofing that enhances the natural beauty of your property. From beachfront homes in Caloundra to mountain retreats in Maleny, we have the expertise to handle any roofing challenge.',
    services: [
      { 
        name: 'Coastal Roofing', 
        description: 'Roofing solutions for beachside properties with enhanced protection',
        features: ['Salt-resistant materials', 'Wind protection', 'Coastal building codes', 'Beachfront expertise']
      },
      { 
        name: 'Hinterland Roofing', 
        description: 'Specialized solutions for mountain and hinterland areas',
        features: ['Mountain weather protection', 'Bushfire resistance', 'Slope roofing', 'Natural environment integration']
      },
      { 
        name: 'Roof Installation', 
        description: 'Complete installation and replacement services',
        features: ['New construction', 'Roof replacement', 'Commercial roofing', 'Residential roofing']
      },
      { 
        name: 'Roof Repairs', 
        description: 'Comprehensive repair services for all conditions',
        features: ['Storm damage repair', 'Weather damage repair', 'Emergency repairs', 'Preventive maintenance']
      },
      { 
        name: 'Maintenance', 
        description: 'Preventive maintenance programs for all environments',
        features: ['Regular inspections', 'Gutter maintenance', 'Sealant application', 'Environmental protection']
      }
    ],
    contact: {
      phone: '1300 123 458',
      email: 'sunshinecoast@arwconstruction.com.au',
      hours: 'Mon-Fri: 7:00 AM - 5:00 PM',
      emergency: '24/7 Emergency Service Available',
      address: 'Sunshine Coast, Queensland'
    },
    areas: [
      'Caloundra', 'Mooloolaba', 'Maroochydore', 'Noosa', 'Coolum', 
      'Peregian Beach', 'Buderim', 'Maleny', 'Montville', 'Mapleton',
      'Nambour', 'Eumundi', 'Yandina', 'Palmwoods', 'Woombye'
    ],
    features: [
      'Coastal and hinterland roofing specialists with 15+ years experience',
      'Understanding of both coastal and mountain weather conditions',
      'Local Sunshine Coast team with regional expertise',
      'Eco-friendly roofing options for environmentally conscious areas',
      'Heritage and modern property specialists',
      'Local supplier relationships for faster service',
      'Understanding of Sunshine Coast Council requirements',
      'Emergency response within 1.5 hours across the region'
    ],
    testimonials: [
      {
        name: 'John P.',
        location: 'Noosa',
        rating: 5,
        comment: 'Beautiful work on our coastal property. They really understand the local environment and used the perfect materials for our beachfront location.',
        project: 'Beachfront Roof Installation'
      },
      {
        name: 'Emma W.',
        location: 'Maleny',
        rating: 5,
        comment: 'Perfect roofing solution for our hinterland property. They handled the mountain weather challenges expertly and the result is stunning.',
        project: 'Mountain Property Roofing'
      },
      {
        name: 'Robert M.',
        location: 'Caloundra',
        rating: 5,
        comment: 'Excellent service from start to finish. They understand the unique challenges of Sunshine Coast properties and delivered beyond our expectations.',
        project: 'Coastal Roof Renovation'
      }
    ],
    whyChoose: [
      {
        icon: Mountain,
        title: 'Dual Environment Expertise',
        description: 'Specialized knowledge of both coastal and hinterland roofing challenges'
      },
      {
        icon: Leaf,
        title: 'Environmental Awareness',
        description: 'Eco-friendly solutions that respect the natural beauty of the region'
      },
      {
        icon: Sun,
        title: 'Climate Adaptation',
        description: 'Solutions optimized for Sunshine Coast\'s unique climate variations'
      },
      {
        icon: CloudRainIcon,
        title: 'Weather Protection',
        description: 'Comprehensive protection against coastal storms and mountain weather'
      }
    ],
    coastalChallenges: [
      'Salt air corrosion and degradation',
      'High winds and coastal storms',
      'Intense UV exposure and heat',
      'Tropical weather conditions',
      'Coastal building code requirements',
      'Beachfront property regulations'
    ],
    hinterlandChallenges: [
      'Mountain weather and temperature variations',
      'Bushfire resistance requirements',
      'Slope and terrain challenges',
      'Natural environment integration',
      'Hinterland building codes',
      'Access and logistics considerations'
    ],
    solutions: [
      'Anti-corrosive materials for coastal areas',
      'Wind-rated installation methods',
      'UV-resistant and fire-resistant materials',
      'Enhanced drainage and waterproofing',
      'Council compliance and approvals',
      'Local expertise and relationships',
      'Eco-friendly material options',
      'Terrain-specific installation techniques'
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO page="location-sunshine-coast" />
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-arw-navy to-arw-blue text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {sunshineCoastData.title}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
                {sunshineCoastData.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-arw-navy hover:bg-gray-100">
                  <Link to="/contact">Get Your Free Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-arw-navy">
                  <Link to="/projects">View Our Sunshine Coast Projects</Link>
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
                  <CardTitle className="text-2xl text-arw-navy">About Our Sunshine Coast Roofing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{sunshineCoastData.longDescription}</p>
                  <p className="text-gray-700 leading-relaxed">Our Sunshine Coast team has the unique advantage of understanding both coastal and hinterland environments. From the pristine beaches of Noosa to the lush mountains of Maleny, we provide roofing solutions that are perfectly suited to each location\'s specific challenges and beauty.</p>
                </CardContent>
              </Card>

              {/* Environment Challenges & Solutions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Sunshine Coast Environment Challenges & Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Coastal Challenges */}
                    <div>
                      <h4 className="font-semibold text-blue-600 text-lg mb-4 flex items-center gap-2">
                        <Sun className="w-5 h-5" />
                        Coastal Challenges
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sunshineCoastData.coastalChallenges.map((challenge, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hinterland Challenges */}
                    <div>
                      <h4 className="font-semibold text-green-600 text-lg mb-4 flex items-center gap-2">
                        <Mountain className="w-5 h-5" />
                        Hinterland Challenges
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sunshineCoastData.hinterlandChallenges.map((challenge, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Solutions */}
                    <div>
                      <h4 className="font-semibold text-arw-blue text-lg mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Our Comprehensive Solutions
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sunshineCoastData.solutions.map((solution, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-arw-blue mt-0.5 flex-shrink-0" />
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
                  <CardTitle className="text-2xl text-arw-navy">Sunshine Coast Roofing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {sunshineCoastData.services.map((service) => (
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
                  <CardTitle className="text-2xl text-arw-navy">Sunshine Coast Service Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">We provide comprehensive roofing services across the entire Sunshine Coast region, from coastal areas to hinterland:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sunshineCoastData.areas.map((area) => (
                      <div key={area} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm text-center">
                        {area}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose ARW in Sunshine Coast */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Why Choose ARW Construction on the Sunshine Coast?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sunshineCoastData.whyChoose.map((item, index) => (
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
                  <CardTitle className="text-2xl text-arw-navy">What Our Sunshine Coast Clients Say</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {sunshineCoastData.testimonials.map((testimonial, index) => (
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
                  <CardTitle className="text-xl text-arw-navy">Sunshine Coast Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{sunshineCoastData.contact.phone}</div>
                      <div className="text-sm text-gray-600">Sunshine Coast Office</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{sunshineCoastData.contact.email}</div>
                      <div className="text-sm text-gray-600">Email Us</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{sunshineCoastData.contact.hours}</div>
                      <div className="text-sm text-gray-600">Business Hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{sunshineCoastData.contact.address}</div>
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
                  <p className="text-red-700 text-sm mb-4">{sunshineCoastData.contact.emergency}</p>
                  <p className="text-red-700 text-sm mb-4">Response time: Within 1.5 hours across Sunshine Coast</p>
                  <Button variant="destructive" className="w-full">
                    Emergency Call Now
                  </Button>
                </CardContent>
              </Card>

              {/* Sunshine Coast Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-arw-navy">Sunshine Coast-Specific Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sunshineCoastData.features.map((feature, index) => (
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

export default SunshineCoastLocation;
