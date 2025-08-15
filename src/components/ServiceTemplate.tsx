import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import SEO from './SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award } from 'lucide-react';

interface ServiceTemplateProps {
  seoPage: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  overview: string;
  features: string[];
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  benefits: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  certifications: string[];
  relatedServices: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  ctaText: string;
  ctaLink: string;
}

const ServiceTemplate: React.FC<ServiceTemplateProps> = ({
  seoPage,
  title,
  subtitle,
  description,
  heroImage,
  overview,
  features,
  process,
  benefits,
  certifications,
  relatedServices,
  ctaText,
  ctaLink
}) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page={seoPage} />
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-20 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-arw-blue text-white border-0 mb-4">Our Services</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-xl text-gray-200 mb-6">{subtitle}</p>
              <p className="text-lg text-gray-300 mb-8">{description}</p>
              <Button 
                size="lg" 
                className="bg-arw-blue hover:bg-blue-600 text-white px-8 py-3 text-lg"
                onClick={() => document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {ctaText}
              </Button>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt={title}
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-arw-navy mb-4">Service Overview</h2>
            <Separator className="w-24 mx-auto bg-arw-blue" />
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed text-center">{overview}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-arw-navy mb-4">What We Offer</h2>
            <Separator className="w-24 mx-auto bg-arw-blue" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <CheckCircle className="w-8 h-8 text-arw-blue mb-4" />
                  <p className="text-gray-700">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-arw-navy mb-4">Our Process</h2>
            <Separator className="w-24 mx-auto bg-arw-blue" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-arw-navy mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-arw-navy mb-4">Why Choose ARW</h2>
            <Separator className="w-24 mx-auto bg-arw-blue" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-arw-navy mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-arw-navy mb-4">Certifications & Standards</h2>
            <Separator className="w-24 mx-auto bg-arw-blue" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, index) => (
              <Badge key={index} className="bg-white text-arw-navy border-2 border-arw-blue px-4 py-2 text-base">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-arw-navy mb-4">Related Services</h2>
            <Separator className="w-24 mx-auto bg-arw-blue" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((service, index) => (
              <Card key={index} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-arw-navy mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link to={service.link}>
                    <Button variant="outline" className="w-full border-arw-blue text-arw-blue hover:bg-arw-blue hover:text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-arw-navy">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8">Contact us today for a free consultation and quote</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-arw-blue hover:bg-blue-600 text-white px-8 py-3 text-lg"
              onClick={() => document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {ctaText}
            </Button>
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-arw-navy px-8 py-3 text-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceTemplate;
