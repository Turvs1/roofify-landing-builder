import React from 'react';
import ServiceTemplate from '../../components/ServiceTemplate';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award, Thermometer, Zap, Home, Leaf, TrendingUp } from 'lucide-react';

const InsulationServices = () => {
  const serviceData = {
    seoPage: "insulationServices",
    title: "Insulation Services",
    subtitle: "Energy-Efficient Roof Insulation Solutions",
    description: "Improve your home's energy efficiency and comfort with professional roof insulation services. Reduce energy costs and create a more comfortable living environment.",
    heroImage: "/lovable-uploads/cba15185-88a7-4963-951d-cfe66b0c72c3.png",
    overview: "Proper roof insulation is essential for maintaining comfortable temperatures year-round and reducing energy costs. Our insulation experts provide comprehensive solutions that improve thermal performance, reduce heat transfer, and enhance your home's overall energy efficiency. Whether you're installing new insulation, upgrading existing systems, or addressing specific thermal issues, we deliver solutions that meet current building standards and provide long-term benefits.",
    features: [
      "Comprehensive thermal performance assessment",
      "Multiple insulation material options and R-values",
      "Professional installation with proper vapor barriers",
      "Ventilation system optimization and installation",
      "Energy efficiency audits and recommendations",
      "Warranty-backed installation and materials"
    ],
    process: [
      {
        step: 1,
        title: "Energy Assessment",
        description: "Evaluate current insulation and identify improvement opportunities"
      },
      {
        step: 2,
        title: "Solution Design",
        description: "Design optimal insulation solution for your specific needs"
      },
      {
        step: 3,
        title: "Professional Installation",
        description: "Expert installation following best practices and building codes"
      },
      {
        step: 4,
        title: "Performance Testing",
        description: "Verify improved thermal performance and energy efficiency"
      }
    ],
    benefits: [
      {
        icon: <Thermometer className="w-8 h-8 text-white" />,
        title: "Temperature Control",
        description: "Maintain consistent, comfortable temperatures year-round"
      },
      {
        icon: <Zap className="w-8 h-8 text-white" />,
        title: "Energy Savings",
        description: "Reduce heating and cooling costs by up to 30%"
      },
      {
        icon: <Leaf className="w-8 h-8 text-white" />,
        title: "Environmental Impact",
        description: "Reduce your carbon footprint and environmental impact"
      },
      {
        icon: <Home className="w-8 h-8 text-white" />,
        title: "Property Value",
        description: "Increase your property's value and market appeal"
      },
      {
        icon: <TrendingUp className="w-8 h-8 text-white" />,
        title: "Long-term Benefits",
        description: "Enjoy benefits for the life of your property"
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        title: "Code Compliance",
        description: "Meet current building energy efficiency standards"
      }
    ],

    certifications: [
      "Licensed Building Contractor",
      "Energy Efficiency Specialist",
      "Insulation Installation Certified",
      "Safety Training Certified",
      "Quality Assurance Certified"
    ],
    relatedServices: [
      {
        title: "Roof Installation",
        description: "Complete roof replacement with integrated insulation",
        link: "/services/roof-installation"
      },
      {
        title: "Renovations",
        description: "Upgrade insulation during roof renovations",
        link: "/services/renovations"
      },
      {
        title: "Ventilation Systems",
        description: "Optimize roof ventilation for better performance",
        link: "/services/ventilation-systems"
      }
    ],
    ctaText: "Insulation Quote",
    ctaLink: "/contact"
  };

  return <ServiceTemplate {...serviceData} />;
};

export default InsulationServices;
