import React from 'react';
import ServiceTemplate from '../../components/ServiceTemplate';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award, Droplets, Wrench, Home, Zap, TrendingUp } from 'lucide-react';

const GutterSystems = () => {
  const serviceData = {
    seoPage: "gutterSystems",
    title: "Gutter Systems",
    subtitle: "Professional Gutter Installation & Maintenance",
    description: "Expert gutter system solutions that protect your property from water damage. From installation to maintenance, we ensure proper drainage and protection.",
    heroImage: "/lovable-uploads/d38686c3-f4db-4130-9a4a-b7ddd6372326.png",
    overview: "Proper gutter systems are essential for protecting your roof, walls, and foundation from water damage. Our gutter specialists provide comprehensive solutions including custom design, professional installation, and ongoing maintenance. We work with all types of properties and can design gutter systems that handle your specific drainage needs while enhancing your property's appearance and value.",
    features: [
      "Custom gutter system design and engineering",
      "Multiple material options: Colorbond, Zincalume, Copper",
      "Professional installation with proper fall and drainage",
      "Downpipe systems and stormwater management",
      "Gutter guards and leaf protection systems",
      "Ongoing maintenance and cleaning services"
    ],
    process: [
      {
        step: 1,
        title: "Site Assessment",
        description: "Evaluate drainage needs and design optimal gutter system"
      },
      {
        step: 2,
        title: "System Design",
        description: "Design custom gutter system with proper fall and capacity"
      },
      {
        step: 3,
        title: "Professional Installation",
        description: "Expert installation with proper sealing and support"
      },
      {
        step: 4,
        title: "Testing & Maintenance",
        description: "Test drainage and establish maintenance schedule"
      }
    ],
    benefits: [
      {
        icon: <Droplets className="w-8 h-8 text-white" />,
        title: "Water Protection",
        description: "Protect your property from water damage and erosion"
      },
      {
        icon: <Home className="w-8 h-8 text-white" />,
        title: "Property Value",
        description: "Maintain and increase your property's market value"
      },
      {
        icon: <Zap className="w-8 h-8 text-white" />,
        title: "Custom Solutions",
        description: "Tailored gutter systems for your specific needs"
      },
      {
        icon: <Shield className="w-8 h-8 text-white" />,
        title: "Foundation Protection",
        description: "Prevent foundation damage from water pooling"
      },
      {
        icon: <TrendingUp className="w-8 h-8 text-white" />,
        title: "Long-term Performance",
        description: "Durable systems that last for decades"
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        title: "Professional Service",
        description: "Expert installation and ongoing maintenance support"
      }
    ],

    certifications: [
      "Licensed Building Contractor",
      "Gutter Installation Specialist",
      "Stormwater Management Certified",
      "Safety Training Certified",
      "Quality Assurance Certified"
    ],
    relatedServices: [
      {
        title: "Roof Installation",
        description: "Complete roof systems with integrated gutter solutions",
        link: "/services/roof-installation"
      },
      {
        title: "Roof Maintenance",
        description: "Gutter maintenance as part of roof care programs",
        link: "/services/roof-maintenance"
      },
      {
        title: "Extensions",
        description: "Gutter systems for new roof extensions",
        link: "/services/extensions"
      }
    ],
    ctaText: "Gutter Quote",
    ctaLink: "/contact"
  };

  return <ServiceTemplate {...serviceData} />;
};

export default GutterSystems;
