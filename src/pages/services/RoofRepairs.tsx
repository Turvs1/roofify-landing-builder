import React from 'react';
import ServiceTemplate from '../../components/ServiceTemplate';
import { CheckCircle, Clock, DollarSign, Shield, Users, Award, Wrench, AlertTriangle, Zap, Home } from 'lucide-react';

const RoofRepairs = () => {
  const serviceData = {
    seoPage: "roofRepairs",
    title: "Roof Repairs",
    subtitle: "Expert Roof Repair & Maintenance Services",
    description: "Fast, reliable roof repairs to fix leaks, storm damage, and wear issues. Our emergency response team is available 24/7 for urgent repairs.",
    heroImage: "/lovable-uploads/44e3d421-dbe5-4dc6-a64d-7341bac898ff.png",
    overview: "When your roof needs attention, you need a team that responds quickly and fixes the problem right the first time. ARW Construction specializes in all types of roof repairs, from minor maintenance to emergency storm damage repairs. Our experienced technicians can identify and resolve issues before they become major problems, saving you money and protecting your property.",
    features: [
      "Emergency leak repairs and storm damage restoration",
      "Shingle and tile replacement and repair",
      "Flashing repair and replacement",
      "Gutter and downpipe repairs",
      "Roof ventilation system repairs",
      "Preventive maintenance and inspections"
    ],
    process: [
      {
        step: 1,
        title: "Emergency Assessment",
        description: "Quick response to assess damage and determine repair needs"
      },
      {
        step: 2,
        title: "Repair Planning",
        description: "Detailed repair plan with timeline and cost estimate"
      },
      {
        step: 3,
        title: "Quality Repair",
        description: "Professional repair using appropriate materials and techniques"
      },
      {
        step: 4,
        title: "Verification",
        description: "Thorough testing and inspection to ensure repair success"
      }
    ],
    benefits: [
      {
        icon: <Zap className="w-8 h-8 text-white" />,
        title: "24/7 Emergency Response",
        description: "Available around the clock for urgent roof repairs"
      },
      {
        icon: <Shield className="w-8 h-8 text-white" />,
        title: "Expert Technicians",
        description: "Licensed professionals with extensive repair experience"
      },
      {
        icon: <Clock className="w-8 h-8 text-white" />,
        title: "Fast Turnaround",
        description: "Quick repairs to minimize disruption to your property"
      },
      {
        icon: <DollarSign className="w-8 h-8 text-white" />,
        title: "Cost-Effective Solutions",
        description: "Repair options that fit your budget and needs"
      },
      {
        icon: <Users className="w-8 h-8 text-white" />,
        title: "Insurance Claims Support",
        description: "Assistance with insurance claims for storm damage"
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        title: "Warranty Backed",
        description: "All repairs come with workmanship warranty"
      }
    ],

    certifications: [
      "Licensed Building Contractor",
      "Storm Damage Specialist",
      "Insurance Repair Certified",
      "Safety Training Certified",
      "Quality Assurance Certified"
    ],
    relatedServices: [
      {
        title: "Roof Maintenance",
        description: "Preventive maintenance to avoid costly repairs",
        link: "/services/roof-maintenance"
      },
      {
        title: "Storm Damage Assessment",
        description: "Professional assessment of storm-related damage",
        link: "/services/storm-damage"
      },
      {
        title: "Insurance Claims Support",
        description: "Help with insurance claims and documentation",
        link: "/services/insurance-support"
      }
    ],
    ctaText: "Emergency Repair",
    ctaLink: "/contact"
  };

  return <ServiceTemplate {...serviceData} />;
};

export default RoofRepairs;
