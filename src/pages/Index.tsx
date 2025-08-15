
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';

const Index: React.FC = () => {
  return (
    <>
      <SEO page="home" />
      <Navigation />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section with Gradient */}
        <section className="bg-gradient-to-r from-arw-navy to-arw-blue text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ARW Construction
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Premium Roofing & Construction Services Across Queensland
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-arw-navy hover:bg-gray-100">
                <Link to="/contact">Get Your Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-arw-navy">
                <Link to="/services">Our Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-arw-navy mb-8">
              Welcome to ARW Construction
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              We are a leading construction company specializing in premium roofing solutions, 
              new construction, renovations, and maintenance services across Queensland.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-arw-navy mb-4">Roofing Services</h3>
                <p className="text-gray-600">
                  Professional roof installation, repairs, and maintenance for residential and commercial properties.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-arw-navy mb-4">New Construction</h3>
                <p className="text-gray-600">
                  Complete construction services from foundation to finish, ensuring quality and durability.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-arw-navy mb-4">Renovations</h3>
                <p className="text-gray-600">
                  Transform your existing space with our expert renovation and extension services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
