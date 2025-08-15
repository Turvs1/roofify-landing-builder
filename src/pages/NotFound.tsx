import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const popularPages = [
    { name: "Home", path: "/", icon: Home },
    { name: "Services", path: "/services", icon: Search },
    { name: "Locations", path: "/locations", icon: MapPin },
    { name: "Projects", path: "/projects", icon: Search },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page="notFound" />
      <Navigation />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] mt-24 px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* 404 Header */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-arw-navy mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-arw-navy mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sorry, the page you're looking for doesn't exist. It might have been moved, 
              deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Error Details */}
          <Card className="mb-8 max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500 mb-2">Attempted to access:</p>
              <p className="font-mono text-arw-navy bg-gray-100 p-2 rounded text-sm break-all">
                {location.pathname}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-arw-navy hover:bg-arw-blue">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-arw-navy text-arw-navy hover:bg-arw-navy hover:text-white">
              <Link to="/contact">
                <Phone className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>

          {/* Popular Pages */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-arw-navy mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
              {popularPages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="group p-4 rounded-lg border border-gray-200 hover:border-arw-navy hover:shadow-md transition-all duration-200"
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-arw-navy group-hover:text-arw-blue transition-colors" />
                    <p className="text-sm font-medium text-gray-700 group-hover:text-arw-navy">
                      {page.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-arw-navy text-white rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <p className="text-gray-200 mb-6">
              Can't find what you're looking for? Our team is here to help you navigate 
              our services and find the information you need.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <Phone className="w-6 h-6 mx-auto mb-2 text-arw-blue" />
                <p className="text-sm text-gray-200 mb-1">Call Us</p>
                <p className="font-semibold">1300 123 456</p>
              </div>
              <div className="text-center">
                <Mail className="w-6 h-6 mx-auto mb-2 text-arw-blue" />
                <p className="text-sm text-gray-200 mb-1">Email Us</p>
                <p className="font-semibold">info@arwc.com.au</p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-arw-navy"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
