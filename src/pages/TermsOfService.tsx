import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const TermsOfService = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <SEO page="termsOfService" />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-arw-navy to-arw-blue">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-200">
            Please read these terms carefully before using our services
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-sm text-gray-600 mb-8">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-AU')}
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using the services of ARW Construction ("we," "us," or "our"), 
                you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">2. Services Description</h2>
              <p className="mb-6">
                ARW Construction provides professional roofing and construction services including 
                but not limited to roof installation, repairs, maintenance, new construction, 
                renovations, extensions, and related services across South East Queensland.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">3. Service Agreements</h2>
              <p className="mb-6">
                All services are provided under separate written agreements that detail specific 
                scope of work, timelines, pricing, and terms. These Terms of Service govern 
                the general relationship between parties and are supplemented by specific service agreements.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">4. Payment Terms</h2>
              <p className="mb-6">
                Payment terms are specified in individual service agreements. Generally, we require 
                a deposit for materials and work commencement, with progress payments as work 
                progresses and final payment upon completion and client satisfaction.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">5. Cancellation Policy</h2>
              <p className="mb-6">
                Cancellations must be provided in writing. Cancellation fees may apply based on 
                work already completed and materials ordered. We reserve the right to charge 
                reasonable cancellation fees to cover costs incurred.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">6. Warranty and Guarantees</h2>
              <p className="mb-6">
                We provide warranties on workmanship and materials as specified in individual 
                service agreements. Warranties are subject to proper maintenance and normal 
                wear and tear. Manufacturer warranties apply to materials as provided by suppliers.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">7. Safety and Compliance</h2>
              <p className="mb-6">
                All work is performed in accordance with Australian building codes, safety 
                regulations, and industry standards. We maintain appropriate insurance coverage 
                and licensing as required by law.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">8. Limitation of Liability</h2>
              <p className="mb-6">
                Our liability is limited to the amount paid for services under the specific 
                agreement. We are not liable for indirect, incidental, or consequential damages 
                arising from our services.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">9. Force Majeure</h2>
              <p className="mb-6">
                We are not liable for delays or failures due to circumstances beyond our 
                reasonable control, including but not limited to weather conditions, material 
                shortages, or government actions.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">10. Dispute Resolution</h2>
              <p className="mb-6">
                Any disputes arising from our services will first be addressed through direct 
                communication and negotiation. If resolution cannot be reached, disputes may 
                be subject to mediation or legal proceedings in Queensland courts.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">11. Changes to Terms</h2>
              <p className="mb-6">
                We reserve the right to modify these terms at any time. Changes will be 
                effective immediately upon posting. Continued use of our services constitutes 
                acceptance of modified terms.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">12. Governing Law</h2>
              <p className="mb-6">
                These terms are governed by the laws of Queensland, Australia. Any legal 
                proceedings will be subject to the jurisdiction of Queensland courts.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">13. Contact Information</h2>
              <p className="mb-6">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><strong>ARW Construction</strong></p>
                <p className="mb-2">Phone: 0423 736 921</p>
                <p className="mb-2">Email: info@arwc.com.au</p>
                <p>Website: arwc.com.au</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  These terms constitute the entire agreement between you and ARW Construction 
                  regarding the use of our services, superseding any prior agreements or understandings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
