
import React, { useEffect } from 'react';
import Header from '../components/Header';
import WhySection from '../components/WhySection';
import HowSection from '../components/HowSection';
import WhatSection from '../components/WhatSection';
import EnquiryForm from '../components/EnquiryForm';
import BookingCalendar from '../components/BookingCalendar';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
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
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main>
        <WhySection />
        <HowSection />
        <WhatSection />
        <EnquiryForm />
        <BookingCalendar />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
