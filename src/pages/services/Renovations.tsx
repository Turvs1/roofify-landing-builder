import React from 'react';
import ServiceTemplate from '../../components/ServiceTemplate';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award, RefreshCw, Hammer, Palette, Home, Zap } from 'lucide-react';

const Renovations = () => {
  const serviceData = {
    seoPage: "renovations",
    title: "Renovations",
    subtitle: "Transform Your Property with Expert Roof Renovations",
    description: "Breathe new life into your property with our comprehensive roof renovation services. From modern updates to heritage restoration, we deliver stunning transformations.",
    heroImage: "/lovable-uploads/a367a18e-7a29-461c-9437-c9bc50124e33.png",
    overview: "Roof renovations offer the perfect opportunity to modernize your property, improve energy efficiency, and enhance curb appeal. Whether you're updating an older home, changing architectural styles, or simply want a fresh look, our renovation experts can transform your existing roof into something spectacular. We specialize in both aesthetic updates and functional improvements, ensuring your renovated roof looks amazing and performs even better.",
    features: [
      "Complete roof style and material transformations",
      "Heritage restoration and preservation",
      "Energy efficiency upgrades and insulation",
      "Modern architectural updates and styling",
      "Custom color and finish selections",
      "Structural improvements and reinforcements"
    ],
    process: [
      {
        step: 1,
        title: "Design Consultation",
        description: "Explore renovation options and design possibilities"
      },
      {
        step: 2,
        title: "Planning & Permits",
        description: "Detailed planning and necessary permit acquisition"
      },
      {
        step: 3,
        title: "Renovation Execution",
        description: "Professional renovation with minimal disruption"
      },
      {
        step: 4,
        title: "Final Reveal",
        description: "Complete transformation and quality inspection"
      }
    ],
    benefits: [
      {
        icon: <RefreshCw className="w-8 h-8 text-white" />,
        title: "Property Transformation",
        description: "Dramatically improve your property's appearance and value"
      },
      {
        icon: <Zap className="w-8 h-8 text-white" />,
        title: "Energy Efficiency",
        description: "Modern materials and insulation reduce energy costs"
      },
      {
        icon: <Palette className="w-8 h-8 text-white" />,
        title: "Custom Styling",
        description: "Choose colors and styles that match your vision"
      },
      {
        icon: <Shield className="w-8 h-8 text-white" />,
        title: "Enhanced Protection",
        description: "Improved weather resistance and durability"
      },
      {
        icon: <DollarSign className="w-8 h-8 text-white" />,
        title: "Increased Value",
        description: "Significant boost to your property's market value"
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        title: "Modern Standards",
        description: "Meet current building codes and safety standards"
      }
    ],

    certifications: [
      "Licensed Building Contractor",
      "Heritage Restoration Specialist",
      "Design and Planning Certified",
      "Safety Training Certified",
      "Quality Assurance Certified"
    ],
    relatedServices: [
      {
        title: "Extensions",
        description: "Add new roof sections to expand your property",
        link: "/services/extensions"
      },
      {
        title: "Roof Installation",
        description: "Complete roof replacement with new materials",
        link: "/services/roof-installation"
      },
      {
        title: "Insulation Services",
        description: "Improve energy efficiency with better insulation",
        link: "/services/insulation-services"
      }
    ],
    ctaText: "Renovation Quote",
    ctaLink: "/contact"
  };

  return <ServiceTemplate {...serviceData} />;
};

export default Renovations;
