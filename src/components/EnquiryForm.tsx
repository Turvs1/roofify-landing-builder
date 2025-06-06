
import React, { useState } from 'react';
import { toast } from 'sonner';
import AnimatedSection from './AnimatedSection';
import { saveEnquiryToSupabase } from '../utils/supabaseApi';
import { supabase } from '@/integrations/supabase/client';

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    budget: '' // We'll keep this in the state for compatibility with existing data
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save enquiry to Supabase
      const success = await saveEnquiryToSupabase(formData);
      
      if (success) {
        // Explicitly call our edge function to send email notification
        const response = await supabase.functions.invoke('send-form-notification', {
          body: {
            table: 'enquiries',
            record: formData
          }
        });
        
        console.log('Edge function response:', response);
        
        if (!response.error) {
          toast.success("Enquiry submitted successfully! We'll call you within 24 hours.");
          setFormData({
            name: '',
            phone: '',
            email: '',
            service: '',
            budget: ''
          });
        } else {
          console.error("Edge function error:", response.error);
          toast.success("Enquiry submitted successfully, but there was an issue with the notification.");
        }
      } else {
        toast.error("Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-12 bg-gray-50 relative overflow-hidden">
      <div className="section-container relative z-10">
        <AnimatedSection>
          <h2 className="section-heading text-center">YOUR ROOF YOUR SOLUTION</h2>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <p className="section-text text-center mb-12">
            Tell us what you need—we'll tailor a plan for you.
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={400} className="max-w-2xl mx-auto">
          <div className="glass-card backdrop-blur-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-arw-navy mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-arw-navy mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-arw-navy mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-arw-navy mb-1">Service Needed</label>
                <select
                  id="service"
                  name="service"
                  required
                  className="form-input"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a service</option>
                  <option value="architectural">Architectural Cladding</option>
                  <option value="commercial">Industrial/Commercial</option>
                  <option value="cyclone">Cyclone Prep</option>
                  <option value="heritage">Heritage Restoration</option>
                  <option value="insurance">Insurance Repair</option>
                  <option value="maintenance">Maintenance Quote</option>
                  <option value="residential">Residential</option>
                </select>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="button-primary w-full relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  <span className={`inline-block transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                    SUBMIT ENQUIRY
                  </span>
                  {isSubmitting && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  )}
                </button>
                <p className="text-center text-sm mt-4 text-arw-text">We'll call you within 24 hours</p>
              </div>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default EnquiryForm;
