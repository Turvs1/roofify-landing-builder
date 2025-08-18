
import React, { useEffect, useState, useRef } from 'react';
import Navigation from '../components/Navigation';
// import CriticalCSS from '../components/CriticalCSS';
import PerformanceMonitor from '../components/PerformanceMonitor';
import OptimizedImage from '../components/OptimizedImage';
import WhySection from '../components/WhySection';
import HowSection from '../components/HowSection';
import WhatSection from '../components/WhatSection';
import EnquiryForm from '../components/EnquiryForm';
import BookingCalendar from '../components/BookingCalendar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      
      // Set scrolled state for navigation bar
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Calculate transition progress based on scroll position
      // Make the transition happen much faster - almost immediately on scroll
      if (headerRef.current) {
        // Reduced the divisor from 0.5 to 0.1 to make transition happen much faster
        const scrollProgress = Math.min(offset / (headerRef.current.offsetHeight * 0.1), 1);
        setTransitionProgress(scrollProgress);
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

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          // Ensure the element stays visible even after scrolling away and back
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    document.querySelectorAll('.section-appear').forEach(section => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll('.section-appear').forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      <SEO page="home" />
      {/* <CriticalCSS /> */}
      <PerformanceMonitor />
      

      
      <div className="min-h-screen overflow-hidden">
        <Navigation />
        
        {/* Hero Section with Background Image Transition */}
        <header ref={headerRef} className="relative w-full h-screen">
          <div className="hero-parallax mt-24" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            {/* Background Images with Transition Effect */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
              
              {/* Construction Image (Fades out as user scrolls) - HIGH PRIORITY */}
              <OptimizedImage
                src="/lovable-uploads/4507aff9-e454-4cb3-90f1-f6ff248c35ec.png"
                alt="Roof construction aerial view"
                className="absolute w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                loading="eager"
                style={{ 
                  opacity: 1 - transitionProgress,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              
              {/* Completed Roof Image (Fades in as user scrolls) */}
              <OptimizedImage
                src="/lovable-uploads/d89d330e-42bb-4ce6-9501-7dc621d40ab6.png"
                alt="Completed roof aerial view"
                className="absolute w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                loading="lazy"
                style={{ 
                  opacity: transitionProgress,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
            
            <div className="parallax-content text-center px-6 relative z-20" style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              textAlign: 'center',
              width: '100%',
              maxWidth: '1200px',
              padding: '0 1rem'
            }}>
              <div className="bg-black bg-opacity-30 px-6 py-0 rounded-lg backdrop-blur-sm inline-block">
                <h1 className="section-heading text-white mb-0 animate-fade-in" style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  margin: 0,
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                }}>
                  WE BELIEVE EVERY PROPERTY<br />DESERVES A STRONG ROOF
                </h1>
              </div>
              
              <button onClick={() => scrollToSection('enquiry')} className="button-primary mt-8 animate-fade-in" style={{
                animationDelay: '400ms',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
              }}>
                BOOK IN YOUR INSPECTION
              </button>
            </div>
          </div>
        </header>

        <main>
          <WhySection />
          <HowSection />
          <WhatSection />
          <EnquiryForm />
          <BookingCalendar />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
