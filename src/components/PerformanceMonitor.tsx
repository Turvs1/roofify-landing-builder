import React, { useEffect } from 'react';

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    let lcpObserver: PerformanceObserver | undefined;
    let fidObserver: PerformanceObserver | undefined;
    let clsObserver: PerformanceObserver | undefined;
    let longTaskObserver: PerformanceObserver | undefined;
    let resourceObserver: PerformanceObserver | undefined;

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'LCP', {
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals',
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const eventEntry = entry as PerformanceEventTiming;
          console.log('FID:', eventEntry.processingStart - eventEntry.startTime);
          
          if (window.gtag) {
            window.gtag('event', 'FID', {
              value: Math.round(eventEntry.processingStart - eventEntry.startTime),
              event_category: 'Web Vitals',
            });
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutEntry = entry as LayoutShiftEntry;
          if (!layoutEntry.hadRecentInput) {
            clsValue += layoutEntry.value;
          }
        });
        console.log('CLS:', clsValue);
        
        if (window.gtag) {
          window.gtag('event', 'CLS', {
            value: Math.round(clsValue * 1000) / 1000,
            event_category: 'Web Vitals',
          });
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry.duration, 'ms');
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }

    // Monitor resource loading
    resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.initiatorType === 'img' && entry.duration > 1000) {
          console.warn('Slow image load:', entry.name, entry.duration, 'ms');
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });

    // Cleanup
    return () => {
      lcpObserver?.disconnect();
      fidObserver?.disconnect();
      clsObserver?.disconnect();
      longTaskObserver?.disconnect();
      resourceObserver?.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
