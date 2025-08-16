import React from 'react';

const CriticalCSS: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Critical CSS for above-the-fold content */
        .hero-parallax {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        
        .parallax-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          text-align: center;
          width: 100%;
          max-width: 1200px;
          padding: 0 1rem;
        }
        
        .section-heading {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0;
          color: white;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .button-primary {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        }
        
        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }
        
        /* Critical navigation styles */
        .nav-container {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        /* Critical layout styles */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        /* Critical typography */
        h1, h2, h3, h4, h5, h6 {
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 1rem 0;
        }
        
        /* Critical spacing */
        .mt-24 { margin-top: 6rem; }
        .mb-8 { margin-bottom: 2rem; }
        .py-20 { padding: 5rem 0; }
        
        /* Critical animations */
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Critical responsive utilities */
        @media (max-width: 768px) {
          .section-heading {
            font-size: clamp(1.5rem, 4vw, 2.5rem);
          }
          
          .button-primary {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
          }
        }
      `
    }} />
  );
};

export default CriticalCSS;
