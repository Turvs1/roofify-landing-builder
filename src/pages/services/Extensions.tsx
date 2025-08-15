import React from 'react';
import ServiceTemplate from '../../components/ServiceTemplate';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award, Plus, Home, Ruler, Hammer, Zap } from 'lucide-react';

const Extensions = () => {
  const serviceData = {
    seoPage: "extensions",
    title: "Extensions",
    subtitle: "Seamless Roof Extensions & Additions",
    description: "Expand your living space with expertly designed and installed roof extensions. We seamlessly integrate new roof sections with your existing structure.",
    heroImage: "/lovable-uploads/d89b330e-42bb-4ce6-9501-7dc621d40ab6.png",
    overview: "Roof extensions are the perfect solution when you need more space but don't want to move. Our expert team specializes in designing and installing roof extensions that blend seamlessly with your existing structure while providing the additional space you need. Whether it's a room extension, carport, veranda, or outdoor living area, we ensure the new roof section matches your existing roof perfectly in style, materials, and performance.",
    features: [
      "Seamless integration with existing roof structure",
      "Custom design to match your current roof style",
      "Professional engineering and structural support",
      "Matching materials and color coordination",
      "Proper drainage and gutter integration",
      "Building code compliance and permits"
    ],
    process: [
      {
        step: 1,
        title: "Design & Planning",
        description: "Design extension to match existing roof and meet your needs"
      },
      {
        step: 2,
        title: "Engineering & Permits",
        description: "Structural engineering and necessary permit acquisition"
      },
      {
        step: 3,
        title: "Construction",
        description: "Professional construction with minimal disruption"
      },
      {
        step: 4,
        title: "Integration",
        description: "Seamless connection and finishing touches"
      }
    ],
    benefits: [
      {
        icon: <Plus className="w-8 h-8 text-white" />,
        title: "Additional Space",
        description: "Create valuable new living or storage space"
      },
      {
        icon: <Home className="w-8 h-8 text-white" />,
        title: "Property Value",
        description: "Significantly increase your property's market value"
      },
      {
        icon: <Ruler className="w-8 h-8 text-white" />,
        title: "Custom Design",
        description: "Tailored to your specific needs and preferences"
      },
      {
        icon: <Shield className="w-8 h-8 text-white" />,
        title: "Seamless Integration",
        description: "New section looks like it was always there"
      },
      {
        icon: <Zap className="w-8 h-8 text-white" />,
        title: "Modern Standards",
        description: "Built to current building codes and standards"
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        title: "Professional Finish",
        description: "High-quality workmanship and attention to detail"
      }
    ],

    certifications: [
      "Licensed Building Contractor",
      "Structural Engineering Certified",
      "Building Code Compliance Certified",
      "Safety Training Certified",
      "Quality Assurance Certified"
    ],
    relatedServices: [
      {
        title: "New Construction",
        description: "Complete roofing for new building projects",
        link: "/services/new-construction"
      },
      {
        title: "Renovations",
        description: "Transform existing roofs with modern updates",
        link: "/services/renovations"
      },
      {
        title: "Gutter Systems",
        description: "Integrated gutter solutions for extensions",
        link: "/services/gutter-systems"
      }
    ],
    ctaText: "Extension Quote",
    ctaLink: "/contact"
  };

  return <ServiceTemplate {...serviceData} />;
};

export default Extensions;
