import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const Team = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const leadership = [
    {
      name: "Dean Willits",
      position: "Director",
      image: "/team-images/dean-willits.png",
      experience: "13+ years",
      expertise: ["Systems & Process Design", "Strategic Leadership", "Quality Standards", "Team Development"],
      bio: "Dean stepped onto his first roofing site in 2010—and something just clicked. The speed, structure, and hands-on nature of the trade lit a fire in him that's never gone out. By 2013, he registered ARW with a clear mission: to build a roofing company that stood out for its precision, efficiency, and genuine pride in doing things right. Over the past decade, Dean's systems-first mindset has helped shape ARW into what it is today—a company that doesn't just finish jobs but sets a benchmark for how they're delivered. He believes that every person on-site has a role in achieving a successful outcome, and that clear process, mutual respect, and attention to detail are non-negotiables. Known for his relentless standards and out-of-the-box thinking, Dean leads from the front—always pushing for smarter systems, tighter execution, and better outcomes for clients and crew alike.",
      certifications: ["Registered Builder", "Systems Design", "Leadership Development", "Quality Management"]
    },
    {
      name: "Daniel Healy",
      position: "General Manager",
      image: "/team-images/daniel-healy.png",
      experience: "10+ years",
      expertise: ["Heritage Restoration", "Project Leadership", "Systems Innovation", "Quality Assurance"],
      bio: "With over a decade of hands-on roofing and construction experience, Daniel brings a unique balance of traditional workmanship and modern systems thinking to ARW Construction. Starting his trade journey as a teenager, Daniel completed his Carpentry Apprenticeship and Cert IV in Building & Construction by 18 and has since led complex roofing projects across QLD and Northern NSW. Known for his precision, leadership under pressure, and heritage restoration expertise, Daniel has built ARW around problem-solving, accountability, and a relentless focus on quality. His passion for roofing is matched only by his drive to innovate—applying tech and streamlined processes to ensure every job is delivered faster, cleaner, and better.",
      certifications: ["Carpentry Apprenticeship", "Cert IV Building & Construction", "Heritage Restoration", "Project Management"]
    },
    {
      name: "Jesse Edwards",
      position: "Project Manager",
      image: "/team-images/jesse-edwards.png",
      experience: "10+ years",
      expertise: ["Construction Management", "Project Coordination", "Client Communication", "Budget Management"],
      bio: "Jesse kicked off his career studying Construction Management at Newcastle University and quickly found his calling in the rhythm of live projects. Over the past decade, he's worked across estimating, operations, and site coordination—building a deep understanding of how to run jobs smoothly, on time, and on budget. At ARW, Jesse is the calm in the storm. He brings structure, focus, and reliability to every project he oversees—balancing timelines, budgets, and communication with clients, insurers, and trades. His attention to detail and steady leadership style make him a trusted hand for complex jobs, and a key driver of ARW's reputation for quality delivery.",
      certifications: ["Construction Management Degree", "Project Management", "Estimating", "Operations Coordination"]
    }
  ];

  const departments = [
    {
      name: "Project Management",
      icon: "📋",
      description: "Our project management team ensures every project is delivered on time and within budget.",
      teamSize: "15+ professionals",
      keyAreas: ["Project Planning", "Timeline Management", "Budget Control", "Risk Management"],
      image: "/lovable-uploads/4507aff9-e454-4cb3-90f1-f6ff248c35ec.png"
    },

    {
      name: "Construction & Installation",
      icon: "🔨",
      description: "Skilled tradespeople and construction professionals deliver quality workmanship on every project.",
      teamSize: "25+ craftsmen",
      keyAreas: ["Roofing Installation", "Structural Construction", "Finishing Work", "Quality Assurance"],
      image: "/lovable-uploads/fb563d81-45ca-4e5c-897c-7e75e4b99205.png"
    },
    {
      name: "Safety & Compliance",
      icon: "🛡️",
      description: "Dedicated safety professionals ensure all projects meet the highest safety standards.",
      teamSize: "8+ specialists",
      keyAreas: ["Safety Training", "Compliance Monitoring", "Risk Assessment", "Incident Prevention"],
      image: "/lovable-uploads/2eee6bc1-5f38-4972-b44f-31b7cb5d3213.png"
    }
  ];

  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our work, maintaining the highest standards of quality and craftsmanship.",
      icon: "⭐"
    },
    {
      title: "Safety First",
      description: "Safety is our top priority. We maintain rigorous safety protocols to protect our team and clients.",
      icon: "🛡️"
    },
    {
      title: "Innovation",
      description: "We embrace new technologies and innovative approaches to deliver superior construction solutions.",
      icon: "💡"
    },
    {
      title: "Integrity",
      description: "We conduct our business with honesty, transparency, and ethical practices at all times.",
      icon: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page="team" />
      <Navigation />
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-20 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Team</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Meet the experts behind ARW Construction's success
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Team Overview */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-arw-navy mb-6">The ARW Construction Family</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our team of dedicated professionals brings together decades of combined experience 
            in construction, roofing, and project management. We're united by our commitment to 
            excellence and our passion for building quality structures.
          </p>
        </div>

        <Separator className="my-16" />

        {/* Leadership Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Leadership Team</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative overflow-hidden rounded-t-lg bg-gray-200">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className={`w-full h-64 object-center ${
                      leader.name === 'Jesse Edwards' ? 'object-contain' : 'object-cover'
                    }`}
                    style={{ 
                      objectPosition: leader.name === 'Jesse Edwards' ? 'center center' : 'center 30%',
                      minHeight: '256px',
                      backgroundColor: '#f3f4f6'
                    }}
                    onError={(e) => {
                      console.error(`Failed to load image for ${leader.name}:`, leader.image);
                      console.error('Error details:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      console.log(`Successfully loaded image for ${leader.name}:`, leader.image);
                      const img = e.target as HTMLImageElement;
                      console.log('Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-bold text-xl">{leader.name}</h3>
                    <p className="text-white/90">{leader.position}</p>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-arw-blue/20 text-arw-navy">
                      {leader.experience} Experience
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-arw-navy mb-2">Areas of Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {leader.expertise.map((area, areaIndex) => (
                        <Badge key={areaIndex} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-arw-navy mb-2">Certifications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {leader.certifications.map((cert, certIndex) => (
                        <Badge key={certIndex} variant="secondary" className="text-xs bg-gray-200 text-gray-800 border-gray-300">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-arw-navy mb-2">Bio:</h4>
                    <div className="text-gray-700 space-y-3 text-sm leading-relaxed">
                      {leader.bio.split('. ').map((sentence, index) => (
                        <p key={index} className="text-gray-700">
                          {sentence.trim()}
                          {index < leader.bio.split('. ').length - 1 ? '.' : ''}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-16" />

        {/* Department Teams */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Our Departments</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="text-4xl mb-4">{dept.icon}</div>
                  <h3 className="text-xl font-bold text-arw-navy mb-2">{dept.name}</h3>
                  <p className="text-gray-600 mb-4">{dept.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-arw-navy mb-2">Key Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dept.keyAreas.map((area, areaIndex) => (
                        <Badge key={areaIndex} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={dept.image} 
                      alt={dept.name}
                      className="w-full h-48 object-cover object-center"
                      style={{ objectPosition: 'center 30%' }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-16" />

        {/* Company Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-arw-navy text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-semibold text-arw-navy mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Career Opportunities */}
        <div className="bg-arw-navy text-white rounded-2xl p-12 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              We're always looking for talented professionals who share our passion for excellence 
              and commitment to quality. Explore career opportunities with ARW Construction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-arw-navy hover:bg-gray-100">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-arw-navy">
                Submit Application
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-arw-navy mb-6">Ready to Work With Us?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our experienced team is ready to bring your construction vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-arw-navy hover:bg-arw-blue">
              Start Your Project
            </Button>
            <Button size="lg" variant="outline" className="border-arw-navy text-arw-navy hover:bg-arw-navy hover:text-white">
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Team;
