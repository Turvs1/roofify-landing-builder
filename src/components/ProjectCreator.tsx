import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createNewProject, projectTemplates } from '../lib/projectTemplates';

interface ProjectFormData {
  title: string;
  description: string;
  category: 'residential' | 'commercial' | 'industrial' | 'heritage' | 'government';
  type: string;
  location: string;
  duration: string;
  value: string;
  features: string[];
  slug: string;
}

const ProjectCreator: React.FC = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: 'residential',
    type: 'Residential',
    location: '',
    duration: '',
    value: '',
    features: [],
    slug: ''
  });

  const [generatedProject, setGeneratedProject] = useState<any>(null);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    // Auto-generate slug
    if (title) {
      const slug = generateSlug(title);
      handleInputChange('slug', slug);
    }
  };

  const handleCategoryChange = (category: 'residential' | 'commercial' | 'industrial' | 'heritage' | 'government') => {
    const template = projectTemplates[category];
    setFormData(prev => ({
      ...prev,
      category,
      type: template.type
    }));
  };

  const addFeature = () => {
    const newFeature = prompt('Enter a new feature:');
    if (newFeature && newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const generateProject = () => {
    const project = createNewProject(formData);
    setGeneratedProject(project);
  };

  const copyToClipboard = () => {
    if (generatedProject) {
      const projectCode = `{
  id: '${Date.now()}',
  slug: '${generatedProject.slug}',
  title: "${generatedProject.title}",
  description: "${generatedProject.description}",
  category: "${generatedProject.category}",
  type: "${generatedProject.type}",
  location: "${generatedProject.location}",
  duration: "${generatedProject.duration}",
  value: "${generatedProject.value}",
  features: ${JSON.stringify(generatedProject.features, null, 2)},
  // Add images, testimonials, and other data as needed
}`;
      
      navigator.clipboard.writeText(projectCode);
      alert('Project code copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project with Auto-Generated SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Project Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Heritage House Re-roof - Teddington Road"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug (Auto-generated)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="heritage-house-re-roof-teddington-road"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the project..."
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="heritage">Heritage</SelectItem>
                  <SelectItem value="government">Government & Public Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Project Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                placeholder="e.g., New Construction, Renovation"
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., 123 Street, Brisbane, QLD"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 8 weeks"
              />
            </div>
            <div>
              <Label htmlFor="value">Project Value</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                placeholder="e.g., $160,000"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Project Features</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                Add Feature
              </Button>
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index] = e.target.value;
                      setFormData(prev => ({ ...prev, features: newFeatures }));
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={generateProject} className="w-full">
            Generate Project with SEO
          </Button>
        </CardContent>
      </Card>

      {/* Generated Project Display */}
      {generatedProject && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Project with SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Generated Title:</Label>
                <p className="text-sm text-gray-600 mt-1">{generatedProject.title}</p>
                <p className="text-xs text-gray-500">({generatedProject.title.length} characters)</p>
              </div>
              <div>
                <Label className="font-semibold">Generated Description:</Label>
                <p className="text-sm text-gray-600 mt-1">{generatedProject.description}</p>
                <p className="text-xs text-gray-500">({generatedProject.description.length} characters)</p>
              </div>
            </div>
            
            <div>
              <Label className="font-semibold">Generated Keywords:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {generatedProject.keywords.map((keyword: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <Button onClick={copyToClipboard} variant="outline" className="w-full">
              Copy Project Code to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectCreator;
