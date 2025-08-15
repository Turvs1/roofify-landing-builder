import React from 'react';
import ServiceTemplate from '../../components/ServiceTemplate';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award, Wrench, Eye, Calendar, TrendingUp } from 'lucide-react';

const RoofMaintenance = () => {
  const serviceData = {
    seoPage: "roofMaintenance",
    title: "Roof Maintenance",
    subtitle: "Preventive Roof Care & Maintenance Programs",
    description: "Regular roof maintenance prevents costly repairs and extends your roof's lifespan. Our comprehensive maintenance programs keep your roof in optimal condition year-round.",
    heroImage: "/lovable-uploads/4507aff9-e454-4cb3-90f1-f6ff248c35ec.png",
    overview: "Preventive maintenance is the key to a long-lasting, trouble-free roof. Our comprehensive maintenance programs include regular inspections, cleaning, minor repairs, and detailed reporting. By catching small issues early, we help you avoid expensive emergency repairs and ensure your roof continues to protect your property effectively for years to come.",
    features: [
      "Regular roof inspections and condition assessments",
      "Gutter cleaning and downpipe maintenance",
      "Minor repair identification and resolution",
      "Ventilation system maintenance and cleaning",
      "Moss and debris removal",
      "Detailed maintenance reports and recommendations"
    ],
    process: [
      {
        step: 1,
        title: "Scheduled Inspection",
        description: "Regular visual inspection of all roof components"
      },
      {
        step: 2,
        title: "Maintenance Tasks",
        description: "Cleaning, minor repairs, and system maintenance"
      },
      {
        step: 3,
        title: "Documentation",
        description: "Detailed report with photos and recommendations"
      },
      {
        step: 4,
        title: "Follow-up Planning",
        description: "Schedule next maintenance visit and priority actions"
      }
    ],
    benefits: [
      {
        icon: <TrendingUp className="w-8 h-8 text-white" />,
        title: "Extended Roof Life",
        description: "Regular maintenance can extend roof life by 5-10 years"
      },
      {
        icon: <DollarSign className="w-8 h-8 text-white" />,
        title: "Cost Savings",
        description: "Prevent expensive emergency repairs with proactive care"
      },
      {
        icon: <Shield className="w-8 h-8 text-white" />,
        title: "Property Protection",
        description: "Maintain optimal protection against weather elements"
      },
      {
        icon: <Calendar className="w-8 h-8 text-white" />,
        title: "Scheduled Service",
        description: "Convenient, planned maintenance visits"
      },
      {
        icon: <Eye className="w-8 h-8 text-white" />,
        title: "Early Problem Detection",
        description: "Identify and fix issues before they become major problems"
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        title: "Warranty Compliance",
        description: "Maintain manufacturer warranty requirements"
      }
    ],

    certifications: [
      "Licensed Building Contractor",
      "Maintenance Specialist Certified",
      "Safety Training Certified",
      "Quality Assurance Certified",
      "Insurance and Bonded"
    ],
    relatedServices: [
      {
        title: "Roof Repairs",
        description: "Fix issues identified during maintenance inspections",
        link: "/services/roof-repairs"
      },
      {
        title: "Gutter Systems",
        description: "Specialised gutter maintenance and repair services",
        link: "/services/gutter-systems"
      },
      {
        title: "Roof Inspections",
        description: "Comprehensive roof condition assessments",
        link: "/services/roof-inspections"
      }
    ],
    ctaText: "Schedule Maintenance",
    ctaLink: "/contact"
  };

  return <ServiceTemplate {...serviceData} />;
};

export default RoofMaintenance;
