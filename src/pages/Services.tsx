import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      category: "Roofing Services",
      icon: "🏠",
      services: [
        {
          title: "Roof Installation",
          description: "Complete roof installation for residential and commercial properties",
          features: ["Metal roofing", "Tile roofing", "Shingle roofing", "Flat roof systems"],
          image: "/lovable-uploads/d89d330e-42bb-4ce6-9501-7dc621d40ab6.png",
          link: "/services/roof-installation"
        },
        {
          title: "Roof Repairs",
          description: "Expert repair services for all types of roof damage",
          features: ["Leak repairs", "Storm damage", "Wear and tear", "Emergency repairs"],
          image: "/lovable-uploads/4507aff9-e454-4cb3-90f1-f6ff248c35ec.png",
          link: "/services/roof-repairs"
        },
        {
          title: "Roof Maintenance",
          description: "Preventive maintenance to extend roof lifespan",
          features: ["Regular inspections", "Gutter cleaning", "Moss removal", "Coating applications"],
          image: "/lovable-uploads/fb563d81-45ca-4e5c-897c-7e75e4b99205.png",
          link: "/services/roof-maintenance"
        }
      ]
    },
    {
      category: "Construction Services",
      icon: "🏗️",
      services: [
        {
          title: "New Construction",
          description: "Full-service construction for commercial and industrial projects",
          features: ["Project management", "Design consultation", "Quality control", "Timeline management"],
          image: "/lovable-uploads/2eee6bc1-5f38-4972-b44f-31b7cb5d3213.png",
          link: "/services/new-construction"
        },
        {
          title: "Renovations",
          description: "Comprehensive renovation and upgrade services",
          features: ["Structural upgrades", "Modernization", "Energy efficiency", "Code compliance"],
          image: "/lovable-uploads/a8bff364-8251-4d33-98a6-e031c892c79d.png",
          link: "/services/renovations"
        },
        {
          title: "Extensions",
          description: "Professional building extensions and additions",
          features: ["Design planning", "Permit assistance", "Seamless integration", "Quality finishes"],
          image: "/lovable-uploads/cba15185-88a7-4963-951d-cfe66b0c72c3.png",
          link: "/services/extensions"
        }
      ]
    },
    {
      category: "Specialised Services",
      icon: "⚡",
      services: [
        {
          title: "Insurance Services",
          description: "Expert insurance claim support and documentation",
          features: ["Damage assessment", "Claim preparation", "Insurance liaison", "Settlement support"],
          image: "/lovable-uploads/fb563d81-45ca-4e5c-897c-7e75e4b99205.png",
          link: "/services/insurance"
        },
        {
          title: "Insulation Services",
          description: "Energy-efficient insulation solutions",
          features: ["Ceiling insulation", "Wall insulation", "Underfloor insulation", "Vapor barriers"],
          image: "/lovable-uploads/f0a7bbfd-220d-4009-9574-ef3579097d62.png",
          link: "/services/insulation-services"
        },
        {
          title: "Gutter Systems",
          description: "Complete gutter and drainage solutions",
          features: ["Gutter installation", "Downpipe systems", "Leaf guards", "Maintenance"],
          image: "/lovable-uploads/b9e0657b-12a3-491f-b43f-2fd63b41aefa.png",
          link: "/services/gutter-systems"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page="services" />
      <Navigation />
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-20 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Comprehensive construction and roofing solutions tailored to your needs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Service Categories */}
        {services.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-20">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">{category.icon}</div>
              <h2 className="text-3xl font-bold text-arw-navy mb-4">{category.category}</h2>
              <Separator className="w-24 mx-auto" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {category.services.map((service, serviceIndex) => (
                <Card key={serviceIndex} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-arw-navy text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-arw-navy">Key Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-arw-blue rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Link to={service.link}>
                        <Button className="w-full mt-6 bg-arw-navy hover:bg-arw-blue transition-colors">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Separator className="my-16" />

        {/* Why Choose Our Services */}
        <div className="bg-arw-navy text-white rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Services?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Quick Turnaround</h3>
              <p className="text-sm text-gray-300">Efficient project completion without compromising quality</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-sm text-gray-300">All work backed by comprehensive warranties</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Expert Team</h3>
              <p className="text-sm text-gray-300">Skilled professionals with years of experience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Competitive Pricing</h3>
              <p className="text-sm text-gray-300">Fair and transparent pricing for all services</p>
            </div>
          </div>
        </div>

        {/* Service Process */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-arw-navy mb-12">Our Service Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="w-20 h-20 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-arw-navy mb-2">Consultation</h3>
              <p className="text-gray-600">Initial meeting to understand your requirements</p>
            </div>

            <div className="relative">
              <div className="w-20 h-20 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-arw-navy mb-2">Planning</h3>
              <p className="text-gray-600">Detailed project planning and design</p>
            </div>

            <div className="relative">
              <div className="w-20 h-20 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-arw-navy mb-2">Execution</h3>
              <p className="text-gray-600">Professional implementation of your project</p>
            </div>

            <div className="relative">
              <div className="w-20 h-20 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-arw-navy mb-2">Completion</h3>
              <p className="text-gray-600">Final inspection and handover</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-arw-navy mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your project requirements and get a free consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-arw-navy hover:bg-arw-blue">
              Get Free Quote
            </Button>
            <Button size="lg" variant="outline" className="border-arw-navy text-arw-navy hover:bg-arw-navy hover:text-white">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
