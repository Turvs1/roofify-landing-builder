
import React from 'react';
import AnimatedSection from './AnimatedSection';

const WhySection = () => {
  return (
    <section id="why" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1600&q=80')" }}
      ></div>
      
      <div className="section-container relative z-10">
        <AnimatedSection>
          <h2 className="section-heading text-center">WHY WE BUILD ROOFS THAT LAST</h2>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <div className="glass-card max-w-4xl mx-auto">
            <p className="section-text text-center">
              At ARW Construction, we believe a roof is more than just cover—it's the heart of a property's strength and longevity, second only to its foundation. For us, every roof is a promise to protect what matters most, no matter the storm, the history, or the budget. That's why we're here: to ensure your peace of mind for decades.
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={400} className="mt-16 flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="glass-card w-full md:w-80 h-64 group hover:scale-105 transition-all duration-500 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full bg-arw-navy text-white flex items-center justify-center mb-4 group-hover:bg-arw-blue transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-arw-navy">Protection</h3>
            <p className="text-arw-text">We protect what matters most to you, starting with your roof.</p>
          </div>
          
          <div className="glass-card w-full md:w-80 h-64 group hover:scale-105 transition-all duration-500 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full bg-arw-navy text-white flex items-center justify-center mb-4 group-hover:bg-arw-blue transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-arw-navy">Longevity</h3>
            <p className="text-arw-text">Our roofs stand the test of time, providing decades of security.</p>
          </div>
          
          <div className="glass-card w-full md:w-80 h-64 group hover:scale-105 transition-all duration-500 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full bg-arw-navy text-white flex items-center justify-center mb-4 group-hover:bg-arw-blue transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-arw-navy">Strength</h3>
            <p className="text-arw-text">Built to withstand the harshest conditions, no matter the challenge.</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhySection;
