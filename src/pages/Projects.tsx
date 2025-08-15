import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { projects, getProjectsByCategory } from '../data/projects';

const Projects = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle URL query parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Transform the imported projects to match the display format
  const displayProjects = projects.map(project => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    secondaryCategory: project.secondaryCategory,
    type: project.type,
    location: project.location,
    description: project.description,
    image: project.images[0], // Use first image from the array
    duration: project.duration,
    value: project.value,
    features: project.features.slice(0, 4), // Limit to 4 features for display
    testimonial: project.testimonials[0] || { // Use first testimonial or fallback
      text: "Project completed successfully with excellent results.",
      author: "ARW Construction",
      position: "Project Team",
      company: "ARW Construction"
    }
  }));

  // Debug logging
  console.log('All projects:', projects);
  console.log('Display projects:', displayProjects);
  console.log('Teddington project:', displayProjects.find(p => p.title.includes('Teddington')));

  const categories = [
    { id: 'all', label: 'All Projects', count: displayProjects.length },
    { id: 'residential', label: 'Residential', count: displayProjects.filter(p => p.category === 'residential').length },
    { id: 'commercial', label: 'Commercial', count: displayProjects.filter(p => p.category === 'commercial').length },
    { id: 'industrial', label: 'Industrial', count: displayProjects.filter(p => p.category === 'industrial').length },
    { id: 'heritage', label: 'Heritage', count: displayProjects.filter(p => p.category === 'heritage' || p.secondaryCategory === 'heritage').length }
  ];

  const filteredProjects = displayProjects.filter(project => {
    const categoryMatch = selectedCategory === 'all' || 
                         project.category === selectedCategory || 
                         (selectedCategory === 'heritage' && project.secondaryCategory === 'heritage');
    const typeMatch = selectedType === 'all' || project.type === selectedType;
    return categoryMatch && typeMatch;
  });

  // Debug logging
  console.log('Selected category:', selectedCategory);
  console.log('Selected type:', selectedType);
  console.log('Filtered projects:', filteredProjects);
  console.log('All display projects:', displayProjects.map(p => ({ title: p.title, category: p.category, type: p.type })));

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page="projects" />
      <Navigation />
      {/* Hero Section */}
      <div className="relative bg-arw-navy text-white py-20 mt-24">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Showcasing excellence in construction and roofing across Australia
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">


        {/* Category Filter */}
        <div className="mb-12">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-white data-[state=active]:text-arw-navy"
                >
                  {category.label} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Project Type Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <label htmlFor="project-type" className="text-sm font-medium text-gray-700">
              Filter by Project Type:
            </label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger id="project-type" className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Heritage">Heritage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-arw-navy">
                    {project.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-arw-blue text-white">
                    {project.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-arw-navy text-xl">{project.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>📍 {project.location}</span>
                    <span>⏱️ {project.duration}</span>
                    <span>💰 {project.value}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-arw-navy mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 italic mb-2">"{project.testimonial.text}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-arw-navy text-sm">{project.testimonial.author}</p>
                        <p className="text-xs text-gray-600">{project.testimonial.position}, {project.testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/projects/${project.slug}`}>
                    <Button className="w-full bg-arw-navy hover:bg-arw-blue transition-colors">
                      View Project Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Process */}
        <div className="bg-arw-navy text-white rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Project Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Discovery</h3>
              <p className="text-sm text-gray-300">Understanding your vision and requirements</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Planning</h3>
              <p className="text-sm text-gray-300">Detailed project planning and design</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Execution</h3>
              <p className="text-sm text-gray-300">Professional project implementation</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-arw-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Delivery</h3>
              <p className="text-sm text-gray-300">Quality assurance and handover</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-arw-navy mb-6">Ready to Start Your Project?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss your project requirements and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-arw-navy hover:bg-arw-blue">
              Start Your Project
            </Button>
            <Button size="lg" variant="outline" className="border-arw-navy text-arw-navy hover:bg-arw-navy hover:text-white">
              Download Portfolio
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Projects;
