import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Star, Shield, Users, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';

const LocationDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const locationData = {
    'brisbane': {
      name: 'Brisbane',
      title: 'Brisbane Roofing Services',
      description: 'Professional roofing services across Greater Brisbane and surrounding suburbs. We understand the unique challenges of Brisbane\'s subtropical climate and provide expert solutions for all your roofing needs.',
      longDescription: 'Brisbane\'s subtropical climate presents unique challenges for roofing, from intense summer storms to high humidity. Our local expertise ensures your roof is built to withstand these conditions while maintaining energy efficiency and aesthetic appeal.',
      image: '/public/lovable-uploads/brisbane-skyline.jpg',
      services: [
        { name: 'Roof Installation', description: 'Complete roof installation for new builds and replacements' },
        { name: 'Roof Repairs', description: 'Emergency and scheduled roof repairs across Brisbane' },
        { name: 'Roof Maintenance', description: 'Preventive maintenance to extend roof lifespan' },
        { name: 'New Construction', description: 'Roofing for new residential and commercial buildings' },
        { name: 'Renovations', description: 'Roof renovations and upgrades for existing properties' }
      ],
      contact: {
        phone: '1300 123 456',
        email: 'brisbane@arwconstruction.com.au',
        hours: 'Mon-Fri: 7:00 AM - 5:00 PM',
        emergency: '24/7 Emergency Service Available'
      },
      areas: ['CBD', 'North Brisbane', 'South Brisbane', 'East Brisbane', 'West Brisbane', 'Inner Suburbs', 'Outer Suburbs'],
      features: [
        'Local Brisbane team with 15+ years experience',
        'Understanding of Brisbane City Council requirements',
        'Storm damage specialists',
        'Energy-efficient roofing solutions',
        'Heritage property expertise'
      ],
      testimonials: [
        {
          name: 'Sarah M.',
          location: 'Paddington',
          rating: 5,
          comment: 'ARW did an amazing job on our heritage roof restoration. They understood the local requirements perfectly.'
        },
        {
          name: 'Michael T.',
          location: 'New Farm',
          rating: 5,
          comment: 'Fast response after the storm damage. Professional service and excellent workmanship.'
        }
      ]
    },
    'gold-coast': {
      name: 'Gold Coast',
      title: 'Gold Coast Roofing Services',
      description: 'Expert roofing solutions for the Gold Coast region, from Surfers Paradise to Coolangatta. Coastal roofing specialists who understand the unique challenges of beachside properties.',
      longDescription: 'The Gold Coast\'s coastal environment requires specialized roofing solutions that can withstand salt air, high winds, and tropical weather. Our team has extensive experience in coastal roofing and uses materials specifically designed for these conditions.',
      image: '/public/lovable-uploads/gold-coast-beach.jpg',
      services: [
        { name: 'Coastal Roofing', description: 'Specialized roofing for beachside properties' },
        { name: 'Storm Protection', description: 'Enhanced protection against cyclonic conditions' },
        { name: 'Roof Installation', description: 'Complete roof installation and replacement' },
        { name: 'Roof Repairs', description: 'Emergency and scheduled repairs' },
        { name: 'Maintenance', description: 'Preventive maintenance for coastal properties' }
      ],
      contact: {
        phone: '1300 123 457',
        email: 'goldcoast@arwconstruction.com.au',
        hours: 'Mon-Fri: 7:00 AM - 5:00 PM',
        emergency: '24/7 Emergency Service Available'
      },
      areas: ['Surfers Paradise', 'Broadbeach', 'Mermaid Beach', 'Burleigh Heads', 'Coolangatta', 'Tweed Heads', 'Palm Beach', 'Currumbin'],
      features: [
        'Coastal roofing specialists',
        'Cyclone-rated materials and installation',
        'Salt-resistant roofing solutions',
        'Local Gold Coast team',
        'Understanding of coastal building codes'
      ],
      testimonials: [
        {
          name: 'David L.',
          location: 'Surfers Paradise',
          rating: 5,
          comment: 'Perfect for our beachfront property. They used the right materials for the coastal environment.'
        },
        {
          name: 'Lisa R.',
          location: 'Burleigh Heads',
          rating: 5,
          comment: 'Excellent storm protection installation. We feel much safer during cyclone season.'
        }
      ]
    },
    'sunshine-coast': {
      name: 'Sunshine Coast',
      title: 'Sunshine Coast Roofing Services',
      description: 'Reliable roofing services throughout the beautiful Sunshine Coast region. From Caloundra to Noosa, we provide expert roofing solutions for this unique coastal area.',
      longDescription: 'The Sunshine Coast combines coastal beauty with hinterland charm, requiring versatile roofing solutions. Our team understands the local climate variations and provides roofing that enhances the natural beauty of your property.',
      image: '/public/lovable-uploads/sunshine-coast-mountains.jpg',
      services: [
        { name: 'Coastal Roofing', description: 'Roofing solutions for beachside properties' },
        { name: 'Hinterland Roofing', description: 'Specialized solutions for mountain and hinterland areas' },
        { name: 'Roof Installation', description: 'Complete installation and replacement services' },
        { name: 'Roof Repairs', description: 'Comprehensive repair services' },
        { name: 'Maintenance', description: 'Preventive maintenance programs' }
      ],
      contact: {
        phone: '1300 123 458',
        email: 'sunshinecoast@arwconstruction.com.au',
        hours: 'Mon-Fri: 7:00 AM - 5:00 PM',
        emergency: '24/7 Emergency Service Available'
      },
      areas: ['Caloundra', 'Mooloolaba', 'Maroochydore', 'Noosa', 'Coolum', 'Peregian Beach', 'Buderim', 'Maleny'],
      features: [
        'Coastal and hinterland expertise',
        'Local Sunshine Coast team',
        'Understanding of regional variations',
        'Eco-friendly roofing options',
        'Heritage and modern property specialists'
      ],
      testimonials: [
        {
          name: 'John P.',
          location: 'Noosa',
          rating: 5,
          comment: 'Beautiful work on our coastal property. They really understand the local environment.'
        },
        {
          name: 'Emma W.',
          location: 'Maleny',
          rating: 5,
          comment: 'Perfect roofing solution for our hinterland property. Professional and reliable service.'
        }
      ]
    }
  };

  const location = locationData[slug as keyof typeof locationData];

  if (!location) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 text-center">
          <h1 className="text-4xl font-bold text-arw-navy mb-4">Location Not Found</h1>
          <p className="text-gray-600 mb-8">The requested location could not be found.</p>
          <Button asChild>
            <Link to="/locations">View All Locations</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO page={`location-${slug}`} />
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-arw-navy to-arw-blue text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {location.title}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                {location.description}
              </p>
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
                  <CardTitle className="text-2xl text-arw-navy">About Our {location.name} Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{location.longDescription}</p>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Services in {location.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {location.services.map((service) => (
                      <div key={service.name} className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold text-arw-navy mb-2">{service.name}</h4>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Service Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {location.areas.map((area) => (
                      <span key={area} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">Why Choose ARW in {location.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {location.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-arw-blue mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-arw-navy">What Our {location.name} Clients Say</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {location.testimonials.map((testimonial, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-2">"{testimonial.comment}"</p>
                        <div className="text-sm text-gray-600">
                          <strong>{testimonial.name}</strong> - {testimonial.location}
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
                  <CardTitle className="text-xl text-arw-navy">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{location.contact.phone}</div>
                      <div className="text-sm text-gray-600">Main Office</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{location.contact.email}</div>
                      <div className="text-sm text-gray-600">Email Us</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-arw-blue" />
                    <div>
                      <div className="font-semibold">{location.contact.hours}</div>
                      <div className="text-sm text-gray-600">Business Hours</div>
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
                  <CardTitle className="text-xl text-red-800">Emergency Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 text-sm mb-4">{location.contact.emergency}</p>
                  <Button variant="destructive" className="w-full">
                    Emergency Call
                  </Button>
                </CardContent>
              </Card>

              {/* Back to Locations */}
              <Card>
                <CardContent className="pt-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/locations">
                      ← Back to All Locations
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

export default LocationDetail;
