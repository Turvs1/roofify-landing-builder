import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

// Mobile menu styles
const mobileMenuStyles = `
  .mobile-menu-container {
    position: relative;
  }
  
  .mobile-menu-dropdown {
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
  
  /* Dark mode mobile menu styling - DISABLED FOR NOW (can be re-enabled later) */
  /*
  .dark .mobile-menu-overlay {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  .dark .mobile-dropdown-toggle {
    color: #93c5fd;
  }
  
  .dark .mobile-dropdown-toggle:hover {
    color: #60a5fa;
  }
  
  .dark .mobile-menu-dropdown {
    background-color: #1f2937;
    border: 1px solid #374151;
  }
  
  .dark .mobile-menu-dropdown a {
    color: #d1d5db;
    border-bottom: 1px solid #374151;
  }
  
  .dark .mobile-menu-dropdown a:hover {
    background-color: #374151;
    color: #f9fafb;
  }
  
  .dark .mobile-menu-dropdown button {
    color: #93c5fd;
    border-bottom: 1px solid #374151;
  }
  
  .dark .mobile-menu-dropdown button:hover {
    background-color: #374151;
    color: #f9fafb;
  }
  */
  
  .mobile-dropdown-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 0;
    font-weight: 600;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.875rem;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .mobile-dropdown-toggle:hover {
    color: #2563eb;
  }
  
  .mobile-dropdown-toggle .chevron {
    transition: transform 0.2s ease;
  }
  
  .mobile-dropdown-toggle .chevron.open {
    transform: rotate(180deg);
  }
  
  .mobile-dropdown-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
  }
  
  .mobile-dropdown-content.open {
    max-height: 500px;
  }
  
  .mobile-dropdown-content .pl-4 {
    padding-left: 1rem;
  }
  
  .mobile-dropdown-content .pl-2 {
    padding-left: 0.5rem;
  }
`;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      
      // Set scrolled state for navigation bar
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Reset dropdown states when menu closes
    setMobileServicesOpen(false);
    setMobileLocationsOpen(false);
    setMobileProjectsOpen(false);
  }, [window.location.pathname]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Reset dropdown states when opening menu
    if (!isMobileMenuOpen) {
      setMobileServicesOpen(false);
      setMobileLocationsOpen(false);
      setMobileProjectsOpen(false);
    }
  };

  const toggleMobileServices = () => {
    setMobileServicesOpen(!mobileServicesOpen);
  };

  const toggleMobileLocations = () => {
    setMobileLocationsOpen(!mobileLocationsOpen);
  };

  const toggleMobileProjects = () => {
    setMobileProjectsOpen(!mobileProjectsOpen);
  };

  return (
    <>
      {/* Inject mobile menu styles */}
      <style>{mobileMenuStyles}</style>
      
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white bg-opacity-90 backdrop-blur-md shadow-md py-4' : 'bg-white bg-opacity-90 backdrop-blur-md py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="relative w-40 h-14 z-10">
            {/* ARW Logo */}
            <div className="absolute inset-0 flex items-center">
              <img alt="ARW Construction" className="h-full object-contain" src="/lovable-uploads/2ad4d34b-5d39-43bf-82db-a8d5a53727a5.png" />
            </div>
          </div>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8 z-10">
            <Link to="/" className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-base">
              Home
            </Link>
            <Link to="/about" className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-base">
              About
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative group">
              <button className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-base flex items-center">
                Services
                <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <Link to="/services" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    All Services Overview
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Link to="/services/roof-installation" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Roof Installation
                  </Link>
                  <Link to="/services/roof-repairs" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Roof Repairs
                  </Link>
                  <Link to="/services/roof-maintenance" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Roof Maintenance
                  </Link>
                  <Link to="/services/new-construction" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    New Construction
                  </Link>
                  <Link to="/services/renovations" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Renovations
                  </Link>
                  <Link to="/services/extensions" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Extensions
                  </Link>
                  <Link to="/services/insurance" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Insurance
                  </Link>
                  <Link to="/services/insulation-services" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Insulation Services
                  </Link>
                  <Link to="/services/gutter-systems" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Gutter Systems
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Locations Dropdown */}
            <div className="relative group">
              <button className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-base flex items-center">
                Locations
                <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <Link to="/locations" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    All Locations Overview
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Link to="/locations/brisbane" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Brisbane Roofing
                  </Link>
                  <Link to="/locations/gold-coast" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Gold Coast Roofing
                  </Link>
                  <Link to="/locations/sunshine-coast" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Sunshine Coast Roofing
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Projects Dropdown */}
            <div className="relative group">
              <button className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-base flex items-center">
                Projects
                <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <Link to="/projects" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    All Projects
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Link to="/projects?category=residential" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Residential
                  </Link>
                  <Link to="/projects?category=commercial" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Commercial
                  </Link>
                  <Link to="/projects?category=industrial" className="block px-4 py-2 text-sm text-arw-navy hover:bg-arw-blue hover:text-white transition-colors">
                    Industrial
                  </Link>
                </div>
              </div>
            </div>
            
            <Link to="/team" className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-base">
              Team
            </Link>
            <Link to="/contact" className="font-medium tracking-wide transition-colors duration-300 text-arw-navy hover:text-arw-blue text-base">
              Contact
            </Link>
            <Button asChild className="bg-arw-blue hover:bg-arw-navy text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link to="/contact">Get Your Quote Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <div className="md:hidden mobile-menu-container">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-arw-navy hover:text-arw-blue transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="mobile-menu-overlay md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile menu content */}
            <div className="md:hidden mobile-menu-container mobile-menu-dropdown">
              <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                <div className="px-6 py-4 space-y-4">
                  {/* Main Navigation Links */}
                  <Link to="/" className="block py-2 text-arw-navy hover:text-arw-blue font-medium transition-colors">
                    Home
                  </Link>
                  <Link to="/about" className="block py-2 text-arw-navy hover:text-arw-blue font-medium transition-colors">
                    About
                  </Link>
                  
                  {/* Services Section */}
                  <div className="space-y-2">
                    <button 
                      onClick={toggleMobileServices}
                      className="mobile-dropdown-toggle"
                    >
                      <span>Services</span>
                      <ChevronDown className={`w-4 h-4 chevron ${mobileServicesOpen ? 'open' : ''}`} />
                    </button>
                    <div className={`mobile-dropdown-content ${mobileServicesOpen ? 'open' : ''}`}>
                      <div className="pl-4 space-y-2">
                        <Link to="/services" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          All Services Overview
                        </Link>
                        <Link to="/services/roof-installation" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Roof Installation
                        </Link>
                        <Link to="/services/roof-repairs" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Roof Repairs
                        </Link>
                        <Link to="/services/roof-maintenance" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Roof Maintenance
                        </Link>
                        <Link to="/services/new-construction" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          New Construction
                        </Link>
                        <Link to="/services/renovations" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Renovations
                        </Link>
                        <Link to="/services/extensions" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Extensions
                        </Link>
                        <Link to="/services/insurance" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Insurance
                        </Link>
                        <Link to="/services/insulation-services" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Insulation Services
                        </Link>
                        <Link to="/services/gutter-systems" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Gutter Systems
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Locations Section */}
                  <div className="space-y-2">
                    <button 
                      onClick={toggleMobileLocations}
                      className="mobile-dropdown-toggle"
                    >
                      <span>Locations</span>
                      <ChevronDown className={`w-4 h-4 chevron ${mobileLocationsOpen ? 'open' : ''}`} />
                    </button>
                    <div className={`mobile-dropdown-content ${mobileLocationsOpen ? 'open' : ''}`}>
                      <div className="pl-4 space-y-2">
                        <Link to="/locations" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          All Locations Overview
                        </Link>
                        <Link to="/locations/brisbane" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Brisbane Roofing
                        </Link>
                        <Link to="/locations/gold-coast" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Gold Coast Roofing
                        </Link>
                        <Link to="/locations/sunshine-coast" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Sunshine Coast Roofing
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Projects Section */}
                  <div className="space-y-2">
                    <button 
                      onClick={toggleMobileProjects}
                      className="mobile-dropdown-toggle"
                    >
                      <span>Projects</span>
                      <ChevronDown className={`w-4 h-4 chevron ${mobileProjectsOpen ? 'open' : ''}`} />
                    </button>
                    <div className={`mobile-dropdown-content ${mobileProjectsOpen ? 'open' : ''}`}>
                      <div className="pl-4 space-y-2">
                        <Link to="/projects" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          All Projects
                        </Link>
                        <Link to="/projects?category=residential" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Residential
                        </Link>
                        <Link to="/projects?category=commercial" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Commercial
                        </Link>
                        <Link to="/projects?category=industrial" className="block py-2 text-arw-navy hover:text-arw-blue transition-colors">
                          Industrial
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/team" className="block py-2 text-arw-navy hover:text-arw-blue font-medium transition-colors">
                    Team
                  </Link>
                  <Link to="/contact" className="block py-2 text-arw-navy hover:text-arw-blue font-medium transition-colors">
                    Contact
                  </Link>
                  
                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button asChild className="w-full bg-arw-blue hover:bg-arw-navy text-white font-semibold py-3">
                      <Link to="/contact">Get Your Quote Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navigation;
