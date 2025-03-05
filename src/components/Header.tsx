
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative w-full h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white bg-opacity-90 backdrop-blur-md shadow-md py-4' 
          : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="relative w-40 h-14 z-10">
            {/* ARW Logo */}
            <div className="absolute inset-0 flex items-center">
              <img 
                src="/lovable-uploads/a8bff364-8251-4d33-98a6-e031c892c79d.png" 
                alt="ARW Construction" 
                className="h-full object-contain"
              />
            </div>
          </div>
          <div className="hidden md:flex space-x-8 z-10">
            <button 
              onClick={() => scrollToSection('why')} 
              className={`font-medium tracking-wide transition-colors duration-300 ${
                scrolled ? 'text-arw-navy hover:text-arw-blue' : 'text-white hover:text-arw-blue'
              }`}
            >
              Why
            </button>
            <button 
              onClick={() => scrollToSection('how')} 
              className={`font-medium tracking-wide transition-colors duration-300 ${
                scrolled ? 'text-arw-navy hover:text-arw-blue' : 'text-white hover:text-arw-blue'
              }`}
            >
              How
            </button>
            <button 
              onClick={() => scrollToSection('what')} 
              className={`font-medium tracking-wide transition-colors duration-300 ${
                scrolled ? 'text-arw-navy hover:text-arw-blue' : 'text-white hover:text-arw-blue'
              }`}
            >
              What
            </button>
            <button 
              onClick={() => scrollToSection('enquiry')} 
              className={`button-primary py-2 px-4 text-sm z-10`}
            >
              BOOK IN YOUR INSPECTION
            </button>
          </div>
          <button className="md:hidden text-arw-navy z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-parallax mt-16">
        <div 
          className="parallax-bg" 
          style={{ 
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="parallax-content text-center px-6">
          <h1 className="section-heading text-white mb-6 animate-fade-in">
            WE BELIEVE EVERY PROPERTY<br />DESERVES A STRONG ROOF
          </h1>
          <p className="section-subheading text-arw-blue animate-fade-in">
            Protect what matters most—starting with the roof.
          </p>
          <button 
            onClick={() => scrollToSection('enquiry')} 
            className="button-primary mt-8 animate-fade-in"
            style={{ animationDelay: '400ms' }}
          >
            BOOK IN YOUR INSPECTION
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
