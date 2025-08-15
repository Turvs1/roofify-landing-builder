import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { getProjectBySlug } from '../data/projects';

const ProjectDetails = () => {
  const { projectSlug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (projectSlug) {
      console.log('Looking for project with slug:', projectSlug);
      const foundProject = getProjectBySlug(projectSlug);
      console.log('Found project:', foundProject);
      if (foundProject) {
        setProject(foundProject);
      } else {
        // Project not found, redirect to projects page
        console.log('Project not found, redirecting to /projects');
        navigate('/projects');
      }
      setLoading(false);
    }
  }, [projectSlug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-arw-navy mx-auto mb-4"></div>
          <p className="text-arw-navy text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-arw-navy mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/projects')} className="bg-arw-navy hover:bg-arw-blue">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }



  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const openImageModal = (image: string) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeImageModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO 
        page="projectDetails" 
        project={project} 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Projects', url: '/projects' },
          { name: project.title, url: `/projects/${project.slug}` }
        ]}
      />
      <Navigation />
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-24 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {project.category}
                </Badge>
                <Badge variant="secondary" className="bg-arw-blue text-white">
                  {project.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{project.title}</h1>
              <p className="text-xl text-gray-200 mb-6">{project.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-300">Location</p>
                  <p className="font-semibold">{project.location}</p>
                </div>
                <div>
                  <p className="text-gray-300">Duration</p>
                  <p className="font-semibold">{project.duration}</p>
                </div>
                <div>
                  <p className="text-gray-300">Value</p>
                  <p className="font-semibold">{project.value}</p>
                </div>
                <div>
                  <p className="text-gray-300">Type</p>
                  <p className="font-semibold">{project.type}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={project.images[0]} 
                alt={project.title}
                className="rounded-lg shadow-2xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-arw-navy transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/projects" className="hover:text-arw-navy transition-colors">Projects</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-arw-navy font-medium">{project.title}</span>
            </li>
          </ol>
        </nav>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            {/* <TabsTrigger value="timeline">Timeline</TabsTrigger> */}
            {/* <TabsTrigger value="team">Team</TabsTrigger> */}
            {/* <TabsTrigger value="sustainability">Sustainability</TabsTrigger> */}
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-12">
          {/* Project Description */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-arw-navy mb-6">Project Overview</h2>
              <p className="text-lg text-gray-700 mb-6">{project.longDescription}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-arw-navy mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-arw-blue rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-arw-navy mb-4">Technical Specifications</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex flex-col py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm">Total Area:</span>
                        <span className="font-semibold text-arw-navy text-sm mt-1">{project.specifications.dimensions}</span>
                      </div>
                      <div className="flex flex-col py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm">Floors:</span>
                        <span className="font-semibold text-arw-navy text-sm mt-1">{project.specifications.floors}</span>
                      </div>
                      <div className="flex flex-col py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm">Height:</span>
                        <span className="font-semibold text-arw-navy text-sm mt-1">{project.specifications.height}</span>
                      </div>
                      <div className="flex flex-col py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm">Parking:</span>
                        <span className="font-semibold text-arw-navy text-sm mt-1">{project.specifications.parking}</span>
                      </div>
                      <div className="flex flex-col py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm">Materials:</span>
                        <span className="font-semibold text-arw-navy text-sm mt-1">{project.specifications.materials}</span>
                      </div>
                      <div className="flex flex-col py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm">Systems:</span>
                        <span className="font-semibold text-arw-navy text-sm mt-1">{project.specifications.systems}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-arw-navy">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-semibold">{project.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Architect</p>
                    <p className="font-semibold">{project.architect}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completion</p>
                    <p className="font-semibold">{project.completionDate}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-arw-navy">Challenges & Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-600 mb-2">Challenges</h4>
                    <ul className="space-y-1 text-sm">
                      {project.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Solutions</h4>
                    <ul className="space-y-1 text-sm">
                      {project.solutions.map((solution, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-8">
          <h2 className="text-3xl font-bold text-arw-navy mb-8">Project Gallery</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.images.map((image, index) => (
              <div key={index} className="group cursor-pointer" onClick={() => openImageModal(image)}>
                <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <img 
                    src={image} 
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <svg className="w-6 h-6 text-arw-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Timeline Tab - Hidden for now */}
        {/* <TabsContent value="timeline" className="space-y-8">
          <h2 className="text-3xl font-bold text-arw-navy mb-8">Project Timeline</h2>
          <div className="space-y-6">
            {project.timeline.map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        phase.completed ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-arw-navy">{phase.phase}</h3>
                        <p className="text-gray-600">{phase.duration}</p>
                      </div>
                    </div>
                    <Badge variant={phase.completed ? "default" : "secondary"}>
                      {phase.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4">{phase.description}</p>
                  <Progress value={phase.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent> */}

        {/* Team Tab - Hidden for now */}
        {/* <TabsContent value="team" className="space-y-8">
          <h2 className="text-3xl font-bold text-arw-navy mb-8">Project Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {project.team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-arw-navy mb-1">{member.name}</h3>
                  <p className="text-arw-blue font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-3">{member.experience} experience</p>
                  <p className="text-xs text-gray-500">{member.responsibilities}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent> */}

        {/* Sustainability Tab - Hidden for now */}
        {/* <TabsContent value="sustainability" className="space-y-8">
          <h2 className="text-3xl font-bold text-arw-navy mb-8">Sustainability & Awards</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Card className="border-0 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center gap-2">
                    <span>🌱</span>
                    {project.sustainability.rating} Certification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{project.sustainability.energySavings}</div>
                      <p className="text-sm text-gray-600">Energy Savings</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{project.sustainability.waterSavings}</div>
                        <p className="text-sm text-gray-600">Water Savings</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{project.sustainability.carbonFootprint}</div>
                        <p className="text-sm text-gray-600">Carbon Reduction</p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-arw-navy mb-3">Sustainable Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {project.sustainability.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center gap-2">
                      <span>🏆</span>
                      Awards & Recognition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.awards.map((award, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-800">{award}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent> */}

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-8">
          <h2 className="text-3xl font-bold text-arw-navy mb-8">Client Testimonials</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {project.testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <blockquote className="text-lg text-gray-700 italic mb-6">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-arw-navy">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <div className="bg-arw-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your construction requirements and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-arw-navy hover:bg-gray-100">
              Get Free Quote
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-arw-navy">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={closeImageModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image */}
            <img
              src={selectedImage}
              alt={`${project.title} - Full Size`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Navigation Instructions */}
            <div className="absolute -bottom-12 left-0 text-white text-sm opacity-75">
              Press ESC to close • Click outside image to close
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProjectDetails;
