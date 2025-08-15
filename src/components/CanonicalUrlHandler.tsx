import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateCanonicalUrl, shouldCanonicalize, BASE_URL } from '../lib/canonicalUrls';

interface CanonicalUrlHandlerProps {
  pageKey: string;
  children: React.ReactNode;
}

const CanonicalUrlHandler: React.FC<CanonicalUrlHandlerProps> = ({ pageKey, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run canonicalization in production to avoid localhost issues
    if (process.env.NODE_ENV === 'production') {
      // Generate the canonical URL for this page
      const canonicalUrl = generateCanonicalUrl(pageKey);
      
      // Extract just the path from the canonical URL
      const canonicalPath = canonicalUrl.replace(BASE_URL, '');
      
      // Check if current URL needs canonicalization
      if (shouldCanonicalize(location.pathname, canonicalPath)) {
        // If there are query parameters that should be preserved, handle them
        const currentQuery = location.search;
        const targetUrl = currentQuery ? `${canonicalPath}${currentQuery}` : canonicalPath;
        
        // Use replace to avoid adding to browser history
        navigate(targetUrl, { replace: true });
      }
    }
  }, [location.pathname, location.search, pageKey, navigate]);

  return <>{children}</>;
};

export default CanonicalUrlHandler;
