import React from 'react';
import ServiceTemplate from '../../components/ServiceTemplate';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award, FileText, ShieldCheck, TrendingUp, Zap, Home, AlertTriangle } from 'lucide-react';

const Insurance = () => {
  const serviceData = {
    seoPage: "insurance",
    title: "Insurance Services",
    subtitle: "Expert Insurance Claim Support & Documentation",
    description: "Professional insurance claim assistance for all types of roof damage. We help you navigate the claims process and ensure you get the coverage you deserve.",
    heroImage: "/lovable-uploads/fb563d81-45ca-4e5c-897c-7e75e4b99205.png",
    overview: "Dealing with insurance claims after roof damage can be overwhelming and complex. Our insurance specialists understand the entire claims process and work directly with insurance companies to ensure you receive fair compensation for your roof repairs or replacement. We handle everything from initial damage assessment and documentation to final claim settlement, making the process as smooth and stress-free as possible.",
    features: [
      "Comprehensive damage assessment and photo documentation",
      "Insurance claim preparation and submission support",
      "Direct communication with insurance adjusters",
      "Professional repair estimates and scope of work",
      "Claims negotiation and settlement assistance",
      "Post-repair documentation and final settlement"
    ],
    process: [
      {
        step: 1,
        title: "Damage Assessment",
        description: "Professional inspection and comprehensive photo documentation"
      },
      {
        step: 2,
        title: "Claim Preparation",
        description: "Prepare detailed claim with supporting documentation"
      },
      {
        step: 3,
        title: "Insurance Liaison",
        description: "Direct communication with adjusters and claims handlers"
      },
      {
        step: 4,
        title: "Settlement & Repair",
        description: "Negotiate settlement and coordinate repairs"
      }
    ],
    benefits: [
      {
        icon: <ShieldCheck className="w-8 h-8 text-white" />,
        title: "Claims Expertise",
        description: "Deep understanding of insurance processes and requirements"
      },
      {
        icon: <FileText className="w-8 h-8 text-white" />,
        title: "Documentation Support",
        description: "Complete assistance with claim preparation and submission"
      },
      {
        icon: <Users className="w-8 h-8 text-white" />,
        title: "Insurance Liaison",
        description: "Direct communication with insurance companies on your behalf"
      },
      {
        icon: <Zap className="w-8 h-8 text-white" />,
        title: "Faster Processing",
        description: "Streamlined claims process for quicker settlements"
      },
      {
        icon: <TrendingUp className="w-8 h-8 text-white" />,
        title: "Better Settlements",
        description: "Expert negotiation for maximum claim value"
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        title: "Peace of Mind",
        description: "Professional handling of your entire insurance claim"
      }
    ],

    certifications: [
      "Licensed Building Contractor",
      "Insurance Claims Specialist",
      "Claims Adjuster Certified",
      "Documentation Expert",
      "Quality Assurance Certified"
    ],
    relatedServices: [
      {
        title: "Roof Repairs",
        description: "Professional repairs for insurance-covered damage",
        link: "/services/roof-repairs"
      },
      {
        title: "Storm Damage Assessment",
        description: "Expert assessment of storm-related damage",
        link: "/services/storm-damage"
      },
      {
        title: "Roof Installation",
        description: "Complete roof replacement when covered by insurance",
        link: "/services/roof-installation"
      }
    ],
    ctaText: "Insurance Assessment",
    ctaLink: "/contact"
  };

  return <ServiceTemplate {...serviceData} />;
};

export default Insurance;
