import React, { useEffect } from 'react';
import Header from '../components/Header';
import WhySection from '../components/WhySection';
import HowSection from '../components/HowSection';
import WhatSection from '../components/WhatSection';
import EnquiryForm from '../components/EnquiryForm';
import BookingCalendar from '../components/BookingCalendar';
import Footer from '../components/Footer';
const Index = () => {
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
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
  return <div className="">
      <Header />
      <main>
        <WhySection />
        <HowSection />
        <WhatSection />
        <EnquiryForm />
        <BookingCalendar />
      </main>
      <Footer />
      
      {/* Cyclone Alert Banner */}
      <div className="fixed bottom-0 left-0 w-full bg-arw-navy text-white py-3 px-6 z-40 flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-arw-blue" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm md:text-base">
            Cyclone Alfred hits Friday. Your roof matters—trust ARW Construction.
          </p>
        </div>
        <div className="ml-4 flex items-center">
          <a href="#booking" className="text-xs md:text-sm bg-arw-blue hover:bg-opacity-90 text-white px-3 py-1 rounded">
            Book In Your Inspection
          </a>
          <button className="ml-4 text-gray-300 hover:text-white" aria-label="Close alert" onClick={e => (e.target as HTMLElement).closest('div')?.parentElement?.remove()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>;
};
export default Index;