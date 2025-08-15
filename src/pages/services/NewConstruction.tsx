import React from 'react';
import ServiceTemplate from '../../components/ServiceTemplate';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award, Building, Hammer, Truck, FileText, Home } from 'lucide-react';

const NewConstruction = () => {
  const serviceData = {
    seoPage: "newConstruction",
    title: "New Construction",
    subtitle: "Complete Roofing Solutions for New Buildings",
    description: "From residential homes to commercial complexes, we provide comprehensive roofing solutions for new construction projects with expert craftsmanship and premium materials.",
    heroImage: "/lovable-uploads/7c65c431-125a-4ddf-a074-0aa214d57e37.jpg",
    overview: "New construction roofing requires precision planning, quality materials, and expert installation to ensure decades of reliable performance. Our team works closely with builders, architects, and developers to deliver roofing systems that meet all building codes, exceed performance expectations, and enhance the overall value of new properties. We handle everything from initial design consultation to final inspection and warranty documentation.",
    features: [
      "Complete roof system design and engineering",
      "Premium roofing materials and components",
      "Custom flashing and detailing solutions",
      "Ventilation and insulation system installation",
      "Skylight and roof penetration installation",
      "Final inspection and warranty documentation"
    ],
    process: [
      {
        step: 1,
        title: "Design & Planning",
        description: "Collaborate with architects and engineers on roof design"
      },
      {
        step: 2,
        title: "Material Selection",
        description: "Choose appropriate materials for climate and design requirements"
      },
      {
        step: 3,
        title: "Installation",
        description: "Professional installation following building codes and specifications"
      },
      {
        step: 4,
        title: "Quality Assurance",
        description: "Comprehensive inspection and testing before handover"
      }
    ],
    benefits: [
      {
        icon: <Building className="w-8 h-8 text-white" />,
        title: "Expert Design",
        description: "Professional roof design optimised for your building and climate"
      },
      {
        icon: <Award className="w-8 h-8 text-white" />,
        title: "Premium Materials",
        description: "Only the highest quality materials from trusted manufacturers"
      },
      {
        icon: <Shield className="w-8 h-8 text-white" />,
        title: "Code Compliance",
        description: "Full compliance with all local building codes and regulations"
      },
      {
        icon: <Clock className="w-8 h-8 text-white" />,
        title: "Timely Completion",
        description: "Efficient installation that keeps your project on schedule"
      },
      {
        icon: <Users className="w-8 h-8 text-white" />,
        title: "Team Collaboration",
        description: "Seamless coordination with builders and other trades"
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        title: "Warranty Protection",
        description: "Comprehensive warranties on materials and workmanship"
      }
    ],

    certifications: [
      "Licensed Building Contractor",
      "Master Builders Association Member",
      "Building Code Compliance Certified",
      "Safety Training Certified",
      "Quality Assurance Certified"
    ],
    relatedServices: [
      {
        title: "Roof Installation",
        description: "Complete roof installation for existing buildings",
        link: "/services/roof-installation"
      },
      {
        title: "Extensions",
        description: "Roofing solutions for building extensions",
        link: "/services/extensions"
      },
      {
        title: "Renovations",
        description: "Roofing updates for renovation projects",
        link: "/services/renovations"
      }
    ],
    ctaText: "Project Consultation",
    ctaLink: "/contact"
  };

  return <ServiceTemplate {...serviceData} />;
};

export default NewConstruction;
