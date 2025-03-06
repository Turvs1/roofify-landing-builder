
import React from 'react';
import AnimatedSection from './AnimatedSection';

const WhatSection = () => {
  // Services offered by ARW
  const services = [
    {
      title: "Insurance Repairs",
      description: "Fast, reliable recovery.",
      image: "https://images.unsplash.com/photo-1543323769-452ee6666af9?auto=format&fit=crop&w=600&q=80", // Updated image - damaged roof after storm
      delay: 100
    },
    {
      title: "Heritage Restoration",
      description: "Preserving history with care.",
      image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=600&q=80",
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
      image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=600&q=80", // Low angle photography of building
      delay: 400
    },
    {
      title: "Residential Roofing",
      description: "Homes that last.",
      image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=600&q=80", // Updated image - house with damaged roof
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
