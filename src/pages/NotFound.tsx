import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100">
      <SEO page="notFound" />
      <Navigation />
              <div className="flex items-center justify-center min-h-[calc(100vh-200px)] mt-24">
          <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
