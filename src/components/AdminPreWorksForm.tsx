import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, MapPin, User, FileText } from 'lucide-react';

const AdminPreWorksForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    propertyAddress: '',
    contactPhone: '',
    contactEmail: '',
    projectType: '',
    estimatedStartDate: '',
    estimatedDuration: '',
    budget: '',
    description: '',
    requirements: '',
    siteAccess: '',
    permits: false,
    insurance: false,
    safetyEquipment: false,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setFormData({
        clientName: '',
        propertyAddress: '',
        contactPhone: '',
        contactEmail: '',
        projectType: '',
        estimatedStartDate: '',
        estimatedDuration: '',
        budget: '',
        description: '',
        requirements: '',
        siteAccess: '',
        permits: false,
        insurance: false,
        safetyEquipment: false,
        notes: ''
      });
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Pre-Works Assessment</h2>
          <p className="text-slate-600">Complete comprehensive pre-works planning and assessment forms</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-600" />
                <span>Client Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="Enter contact phone"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="Enter contact email"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                <span>Property Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Textarea
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  placeholder="Enter full property address"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roof-repair">Roof Repair</SelectItem>
                      <SelectItem value="roof-replacement">Roof Replacement</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="estimatedStartDate">Estimated Start Date</Label>
                  <Input
                    id="estimatedStartDate"
                    type="date"
                    value={formData.estimatedStartDate}
                    onChange={(e) => handleInputChange('estimatedStartDate', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                  <Input
                    id="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                    placeholder="e.g., 2 weeks"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Project Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the work to be performed..."
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Any special requirements or considerations..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="siteAccess">Site Access Information</Label>
                <Input
                  id="siteAccess"
                  value={formData.siteAccess}
                  onChange={(e) => handleInputChange('siteAccess', e.target.value)}
                  placeholder="e.g., Gate code, contact person, access hours"
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="permits"
                    checked={formData.permits}
                    onCheckedChange={(checked) => handleInputChange('permits', checked as boolean)}
                  />
                  <Label htmlFor="permits">Building permits obtained</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="insurance"
                    checked={formData.insurance}
                    onCheckedChange={(checked) => handleInputChange('insurance', checked as boolean)}
                  />
                  <Label htmlFor="insurance">Insurance coverage confirmed</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="safetyEquipment"
                    checked={formData.safetyEquipment}
                    onCheckedChange={(checked) => handleInputChange('safetyEquipment', checked as boolean)}
                  />
                  <Label htmlFor="safetyEquipment">Safety equipment available</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes or observations..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Pre-Works Assessment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPreWorksForm;
