
import React from 'react';
import AnimatedSection from './AnimatedSection';

const WhatSection = () => {
  // Services offered by ARW
  const services = [
    {
      title: "Insurance Repairs",
      description: "Fast, reliable recovery.",
      image: "/lovable-uploads/3ee46c44-f951-4697-8c7f-201d5b6d0708.png", // Image for Insurance Repairs
      delay: 100
    },
    {
      title: "Heritage Restoration",
      description: "Preserving history with care.",
      image: "/lovable-uploads/f0a7bbfd-220d-4009-9574-ef3579097d62.png", // Updated image for Heritage Restoration
      delay: 200
    },
    {
      title: "Architectural Cladding",
      description: "Modern, durable designs.",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=600&q=80",
      delay: 300
    },
    {
      title: "Industrial & Commercial",
      description: "Built for strength.",
      image: "/lovable-uploads/a367a18e-7a29-461c-9437-c9bc50124e33.png", // Updated image for Industrial & Commercial
      delay: 400
    },
    {
      title: "Residential Roofing",
      description: "Homes that last.",
      image: "/lovable-uploads/cba15185-88a7-4963-951d-cfe66b0c72c3.png", // Updated image for Residential Roofing
      delay: 500
    }
  ];

  return (
    <section id="what" className="py-12 bg-white relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?auto=format&fit=crop&w=1600&q=80')" }}
      ></div>
      
      <div className="section-container relative z-10">
        <AnimatedSection>
          <h2 className="section-heading text-center">WHAT WE OFFER</h2>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <p className="section-text text-center mb-16">
            From small repairs to large-scale projects, we provide tailored roofing solutions for every need. No matter the size or budget, we make your vision reality.
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <AnimatedSection key={index} delay={service.delay} className="h-full">
              <div className="glass-card h-full group hover:scale-105 transition-all duration-500 overflow-hidden">
                <div className="relative h-48 mb-4 overflow-hidden">
                  <div className="absolute inset-0 bg-arw-navy opacity-30 group-hover:opacity-0 transition-opacity duration-300 z-10"></div>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-arw-navy mb-2">{service.title}</h3>
                  <p className="text-arw-text">{service.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        
        <AnimatedSection delay={700} className="mt-16 text-center">
          <p className="text-lg font-medium text-arw-text">
            No matter the size or budget, we make your vision reality.
          </p>
          <button 
            onClick={() => {
              const element = document.getElementById('enquiry');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="button-primary mt-8"
          >
            GET STARTED
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhatSection;
