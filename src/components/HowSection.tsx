
import React from 'react';
import AnimatedSection from './AnimatedSection';

const HowSection = () => {
  // List of how we deliver items with delays
  const deliveryItems = [
    { 
      title: "Integrity", 
      description: "Open, honest communication.", 
      delay: 100,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      title: "Design", 
      description: "Cutting-edge trends for all budgets.", 
      delay: 200,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      title: "Detail", 
      description: "Precision planning, no surprises.", 
      delay: 300,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      title: "Experience", 
      description: "Solving problems before they arise.", 
      delay: 400,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      title: "Quality", 
      description: "Built to exceed expectations.", 
      delay: 500,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  return (
    <section id="how" className="py-12 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white opacity-70 z-0"></div>
      
      <div className="section-container relative z-10">
        <AnimatedSection>
          <h2 className="section-heading text-center">HOW WE DELIVER</h2>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <p className="section-text text-center max-w-4xl mx-auto">
            We combine integrity, design, and detail to craft roofs that stand the test of time. Our process is transparent, our solutions are tailored, and our quality is unmatched—whether it's a cyclone-ready fix, a heritage restoration, or a modern cladding project.
          </p>
        </AnimatedSection>
        
        <div className="mt-16 max-w-4xl mx-auto">
          {deliveryItems.map((item, index) => (
            <AnimatedSection key={index} delay={item.delay} className="mb-6">
              <div className="glass-card hover:shadow-xl transition-shadow duration-300 flex items-start p-6 border-l-4 border-arw-navy">
                <div className="mr-4 text-arw-navy">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-arw-navy">{item.title}</h3>
                  <p className="text-arw-text">{item.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        
        <AnimatedSection delay={700} className="mt-16">
          <div className="glass-card max-w-4xl mx-auto border-l-4 border-arw-blue p-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-arw-blue mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium italic text-arw-navy">
                With Cyclone Alfred approaching Friday, March 7, 2025, we're ready to act fast—secure your roof today.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HowSection;
