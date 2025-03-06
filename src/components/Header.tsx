
import React, { useEffect, useState } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return <header className="relative w-full h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white bg-opacity-90 backdrop-blur-md shadow-md py-4' : 'bg-white bg-opacity-90 backdrop-blur-md py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="relative w-40 h-14 z-10">
            {/* ARW Logo */}
            <div className="absolute inset-0 flex items-center">
              <img alt="ARW Construction" className="h-full object-contain" src="/lovable-uploads/2ad4d34b-5d39-43bf-82db-a8d5a53727a5.png" />
            </div>
          </div>
          
          {/* Navigation links - visible on all screen sizes */}
          <div className="flex space-x-4 md:space-x-8 z-10">
            <button onClick={() => scrollToSection('why')} className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-xs md:text-base">
              Why
            </button>
            <button onClick={() => scrollToSection('how')} className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-xs md:text-base">
              How
            </button>
            <button onClick={() => scrollToSection('what')} className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-xs md:text-base">
              What
            </button>
            <button onClick={() => scrollToSection('enquiry')} className="button-primary py-1 px-2 md:py-2 md:px-4 text-xs md:text-sm z-10">
              BOOK INSPECTION
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <div className="hero-parallax mt-16">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
          <img 
            src="/lovable-uploads/4507aff9-e454-4cb3-90f1-f6ff248c35ec.png" 
            alt="Roof construction aerial view" 
            className="absolute w-full h-full object-cover"
          />
        </div>
        
        <div className="parallax-content text-center px-6 relative z-20">
          <div className="bg-black bg-opacity-30 px-6 py-0 rounded-lg backdrop-blur-sm inline-block">
            <h1 className="section-heading text-white mb-0 animate-fade-in">
              WE BELIEVE EVERY PROPERTY<br />DESERVES A STRONG ROOF
            </h1>
            <p className="section-subheading text-arw-blue animate-fade-in mb-0">
              Protect what matters most—starting with the roof.
            </p>
          </div>
          
          <button onClick={() => scrollToSection('enquiry')} className="button-primary mt-8 animate-fade-in" style={{
            animationDelay: '400ms'
          }}>
            BOOK IN YOUR INSPECTION
          </button>
        </div>
      </div>
    </header>;
};

export default Header;
