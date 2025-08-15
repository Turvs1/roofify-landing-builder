import React from 'react';
import ServiceTemplate from '../../components/ServiceTemplate';
import SEO from '../../components/SEO';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award, Home, Wrench, Truck, FileText } from 'lucide-react';

const RoofInstallation = () => {
  const serviceData = {
    seoPage: "roofInstallation",
    title: "Roof Installation",
    subtitle: "Professional Roof Installation Services",
    description: "From new construction to complete roof replacements, ARW Construction delivers expert roof installation with premium materials and craftsmanship that lasts.",
    heroImage: "/lovable-uploads/3ee46c44-f951-4697-8c7f-201d5b6d0708.png",
    overview: "Our roof installation services cover everything from residential homes to commercial buildings. We use only the highest quality materials and follow industry best practices to ensure your new roof provides decades of protection and enhances your property's value. Whether you're building new or replacing an existing roof, our experienced team handles every aspect with precision and care.",
    features: [
      "Complete roof system installation including underlayment, flashing, and ventilation",
      "Multiple roofing material options: Colorbond, Zincalume, Terracotta, and more",
      "Custom flashing and detailing for complex roof designs",
      "Proper ventilation system installation for optimal performance",
      "Quality control inspections throughout the installation process",
      "Warranty-backed workmanship and materials"
    ],
    process: [
      {
        step: 1,
        title: "Assessment & Planning",
        description: "Site inspection, material selection, and detailed project planning"
      },
      {
        step: 2,
        title: "Preparation",
        description: "Site setup, material delivery, and safety measures implementation"
      },
      {
        step: 3,
        title: "Installation",
        description: "Professional installation following manufacturer specifications"
      },
      {
        step: 4,
        title: "Quality Check",
        description: "Final inspection and cleanup to ensure perfection"
      }
    ],
    benefits: [
      {
        icon: <Shield className="w-8 h-8 text-white" />,
        title: "Expert Craftsmanship",
        description: "Licensed professionals with years of experience in roof installation"
      },
      {
        icon: <Award className="w-8 h-8 text-white" />,
        title: "Premium Materials",
        description: "Only the highest quality materials from trusted manufacturers"
      },
      {
        icon: <Clock className="w-8 h-8 text-white" />,
        title: "Timely Completion",
        description: "Efficient installation process with minimal disruption to your property"
      },
      {
        icon: <DollarSign className="w-8 h-8 text-white" />,
        title: "Value for Money",
        description: "Competitive pricing with long-term durability and performance"
      },
      {
        icon: <Users className="w-8 h-8 text-white" />,
        title: "Professional Team",
        description: "Skilled installers committed to quality and customer satisfaction"
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        title: "Warranty Protection",
        description: "Comprehensive warranties on both materials and workmanship"
      }
    ],
    certifications: [
      "Licensed Building Contractor",
      "Master Builders Association Member",
      "WorkCover Approved",
      "Public Liability Insurance",
      "Quality Assurance Certified"
    ],
    relatedServices: [
      {
        title: "Roof Repairs",
        description: "Fix existing roof issues and extend roof life",
        link: "/services/roof-repairs"
      },
      {
        title: "New Construction",
        description: "Complete roofing for new building projects",
        link: "/services/new-construction"
      },
      {
        title: "Extensions",
        description: "Roofing solutions for property extensions",
        link: "/services/extensions"
      }
    ],
    ctaText: "Get Free Quote",
    ctaLink: "/contact"
  };

  return <ServiceTemplate {...serviceData} />;
};

export default RoofInstallation;
