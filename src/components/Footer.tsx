
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-arw-dark text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex justify-center md:justify-start">
            <img 
              src="/lovable-uploads/a8bff364-8251-4d33-98a6-e031c892c79d.png" 
              alt="ARW Construction" 
              className="h-16 object-contain"
            />
          </div>
          
          <div className="text-center">
            <p className="text-sm font-light tracking-wide mb-2">ARW Construction—Roofs That Last.</p>
            <p className="text-sm font-light tracking-wide">© {new Date().getFullYear()} ARW Construction. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:items-end items-center space-y-2">
            <p className="text-sm font-light tracking-wide">1300-ARW-ROOF</p>
            <p className="text-sm font-light tracking-wide">info@arwconstruction.com</p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-white hover:text-arw-blue transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-arw-blue transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
