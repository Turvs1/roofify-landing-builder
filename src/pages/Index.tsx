
import React, { useEffect, useState, useRef } from 'react';
import Navigation from '../components/Navigation';
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
      <div className="min-h-screen overflow-hidden">
        <Navigation />
        
        {/* Hero Section with Background Image Transition */}
        <header ref={headerRef} className="relative w-full h-screen">
          <div className="hero-parallax mt-24">
            {/* Background Images with Transition Effect */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
              
              {/* Construction Image (Fades out as user scrolls) */}
              <img 
                src="/lovable-uploads/4507aff9-e454-4cb3-90f1-f6ff248c35ec.png" 
                alt="Roof construction aerial view" 
                className="absolute w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                style={{ opacity: 1 - transitionProgress }}
              />
              
              {/* Completed Roof Image (Fades in as user scrolls) */}
              <img 
                src="/lovable-uploads/d89d330e-42bb-4ce6-9501-7dc621d40ab6.png" 
                alt="Completed roof aerial view" 
                className="absolute w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                style={{ opacity: transitionProgress }}
              />
            </div>
            
            <div className="parallax-content text-center px-6 relative z-20">
              <div className="bg-black bg-opacity-30 px-6 py-0 rounded-lg backdrop-blur-sm inline-block">
                <h1 className="section-heading text-white mb-0 animate-fade-in">
                  WE BELIEVE EVERY PROPERTY<br />DESERVES A STRONG ROOF
                </h1>
              </div>
              
              <button onClick={() => scrollToSection('enquiry')} className="button-primary mt-8 animate-fade-in" style={{
                animationDelay: '400ms'
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
