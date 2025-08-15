import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const SafetyQuality = () => {
  const safetyMetrics = [
    { label: "Safety Training Hours", value: 2500, target: 3000, unit: "hours" },
    { label: "Incident Rate", value: 0.8, target: 1.0, unit: "per 100k hours" },
    { label: "Safety Audits", value: 48, target: 52, unit: "per year" },
    { label: "Emergency Drills", value: 24, target: 24, unit: "per year" }
  ];

  const qualityStandards = [
    {
      standard: "ISO 9001:2015",
      title: "Quality Management Systems",
      description: "Certified quality management system ensuring consistent delivery of high-quality construction services.",
      icon: "🏆",
      status: "Certified"
    },
    {
      standard: "ISO 14001:2015",
      title: "Environmental Management",
      description: "Environmental management system for sustainable construction practices and reduced environmental impact.",
      icon: "🌱",
      status: "Certified"
    },
    {
      standard: "AS/NZS 4801:2001",
      title: "Occupational Health & Safety",
      description: "Occupational health and safety management system ensuring workplace safety and risk management.",
      icon: "🛡️",
      status: "Certified"
    },
    {
      standard: "Master Builders Association",
      title: "Industry Excellence",
      description: "Member of the Master Builders Association, upholding industry best practices and standards.",
      icon: "🏗️",
      status: "Member"
    }
  ];

  const safetyProtocols = [
    {
      category: "Personal Protective Equipment",
      protocols: [
        "Hard hats and safety helmets",
        "High-visibility clothing",
        "Safety footwear and gloves",
        "Eye and hearing protection",
        "Respiratory protection when required"
      ],
      icon: "🪖"
    },
    {
      category: "Site Safety",
      protocols: [
        "Regular safety inspections",
        "Hazard identification and assessment",
        "Safety signage and barriers",
        "Emergency response procedures",
        "Incident reporting and investigation"
      ],
      icon: "🚧"
    },
    {
      category: "Training & Certification",
      protocols: [
        "Mandatory safety training for all workers",
        "Specialised training for high-risk activities",
        "Regular refresher courses",
        "Certification verification",
        "Safety competency assessments"
      ],
      icon: "📚"
    },
    {
      category: "Equipment Safety",
      protocols: [
        "Regular equipment inspections",
        "Preventive maintenance schedules",
        "Operator training and certification",
        "Safety guards and protection devices",
        "Emergency stop procedures"
      ],
      icon: "⚙️"
    }
  ];

  const qualityProcesses = [
    {
      stage: "Planning & Design",
      description: "Comprehensive planning and design review to ensure project feasibility and quality standards.",
      activities: ["Design review", "Material selection", "Quality planning", "Risk assessment"],
      icon: "📋"
    },
    {
      stage: "Material Procurement",
      description: "Rigorous material selection and supplier qualification to ensure quality and compliance.",
      activities: ["Supplier qualification", "Material testing", "Quality verification", "Documentation"],
      icon: "📦"
    },
    {
      stage: "Construction & Installation",
      description: "Quality-controlled construction processes with continuous monitoring and inspection.",
      activities: ["Quality control", "Progress monitoring", "Defect prevention", "Documentation"],
      icon: "🔨"
    },
    {
      stage: "Final Inspection",
      description: "Comprehensive final inspection and quality assurance before project handover.",
      activities: ["Final inspection", "Quality verification", "Defect rectification", "Handover"],
      icon: "✅"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-20 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Safety & Quality</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Our unwavering commitment to safety and quality excellence
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Commitment Statement */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-arw-navy mb-6">Our Commitment</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            At ARW Construction, safety and quality are not just priorities—they are fundamental values 
            that guide every decision and action. We maintain the highest standards in occupational health 
            and safety, environmental management, and quality assurance to ensure the well-being of our 
            team, clients, and communities.
          </p>
        </div>

        {/* Safety Metrics */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Safety Performance Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyMetrics.map((metric, index) => (
              <Card key={index} className="border-0 shadow-lg text-center p-6">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-arw-navy mb-2">
                    {metric.value}{metric.unit === "per 100k hours" ? "" : metric.unit}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{metric.label}</p>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-2">Target: {metric.target}{metric.unit === "per 100k hours" ? "" : metric.unit}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-16" />

        {/* Quality Standards */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Quality Standards & Certifications</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {qualityStandards.map((standard, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{standard.icon}</div>
                      <div>
                        <CardTitle className="text-arw-navy">{standard.title}</CardTitle>
                        <CardDescription className="text-gray-600">{standard.standard}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {standard.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{standard.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-16" />

        {/* Safety Protocols */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Comprehensive Safety Protocols</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {safetyProtocols.map((protocol, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{protocol.icon}</div>
                    <CardTitle className="text-arw-navy">{protocol.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {protocol.protocols.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-arw-blue rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-16" />

        {/* Quality Processes */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Quality Assurance Process</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {qualityProcesses.map((process, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{process.icon}</div>
                    <CardTitle className="text-arw-navy">{process.stage}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{process.description}</p>
                  <div>
                    <h4 className="font-semibold text-arw-navy mb-2">Key Activities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {process.activities.map((activity, activityIndex) => (
                        <Badge key={activityIndex} variant="outline" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Safety & Quality Features */}
        <div className="bg-arw-navy text-white rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Safety & Quality Standards?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Certified Excellence</h3>
              <p className="text-sm text-gray-300">Internationally recognized quality and safety certifications</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Continuous Improvement</h3>
              <p className="text-sm text-gray-300">Ongoing training and process optimization</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Expert Team</h3>
              <p className="text-sm text-gray-300">Qualified safety and quality professionals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Proactive Approach</h3>
              <p className="text-sm text-gray-300">Preventive measures and risk management</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-arw-navy mb-6">Ready to Experience Our Standards?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us to learn more about our safety and quality processes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-arw-navy hover:bg-arw-blue">
              Request Safety Report
            </Button>
            <Button size="lg" variant="outline" className="border-arw-navy text-arw-navy hover:bg-arw-navy hover:text-white">
              Schedule Safety Audit
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SafetyQuality;
