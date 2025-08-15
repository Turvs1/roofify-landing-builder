import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <SEO page="privacyPolicy" />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-arw-navy to-arw-blue">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-200">
            How we collect, use, and protect your personal information
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

              <h2 className="text-2xl font-bold text-arw-navy mb-4">1. Introduction</h2>
              <p className="mb-6">
                ARW Construction ("we," "us," or "our") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you visit our website, use our services, or interact with us.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-arw-navy mb-3">2.1 Personal Information</h3>
              <p className="mb-4">
                We may collect personal information including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Name and contact details (email, phone, address)</li>
                <li>Property information and project requirements</li>
                <li>Payment and billing information</li>
                <li>Communication preferences</li>
                <li>Photos and documentation related to projects</li>
              </ul>

              <h3 className="text-xl font-semibold text-arw-navy mb-3">2.2 Technical Information</h3>
              <p className="mb-6">
                We automatically collect certain information when you visit our website, including:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referring website information</li>
              </ul>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Provide and improve our services</li>
                <li>Communicate with you about projects and services</li>
                <li>Process payments and manage accounts</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
                <li>Analyze website usage and improve user experience</li>
              </ul>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">4. Information Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Service providers who assist in our operations</li>
                <li>Contractors and subcontractors working on your project</li>
                <li>Legal authorities when required by law</li>
                <li>Third parties with your explicit consent</li>
              </ul>
              <p className="mb-6">
                We do not sell, rent, or trade your personal information to third parties for 
                marketing purposes.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">5. Data Security</h2>
              <p className="mb-6">
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or 
                destruction. However, no method of transmission over the internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">6. Data Retention</h2>
              <p className="mb-6">
                We retain your personal information for as long as necessary to provide our 
                services, comply with legal obligations, resolve disputes, and enforce agreements. 
                When no longer needed, we securely delete or anonymize your information.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">7. Your Rights and Choices</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Object to certain processing activities</li>
              </ul>
              <p className="mb-6">
                To exercise these rights, please contact us using the information provided below.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="mb-6">
                Our website uses cookies and similar technologies to enhance user experience, 
                analyze traffic, and personalize content. You can control cookie settings through 
                your browser preferences.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">9. Third-Party Links</h2>
              <p className="mb-6">
                Our website may contain links to third-party websites. We are not responsible 
                for the privacy practices or content of these external sites. We encourage you 
                to review their privacy policies.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">10. Children's Privacy</h2>
              <p className="mb-6">
                Our services are not intended for children under 18 years of age. We do not 
                knowingly collect personal information from children. If you believe we have 
                collected such information, please contact us immediately.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">11. International Data Transfers</h2>
              <p className="mb-6">
                Your personal information is primarily processed in Australia. If we transfer 
                data internationally, we ensure appropriate safeguards are in place to protect 
                your information.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">12. Changes to This Policy</h2>
              <p className="mb-6">
                We may update this Privacy Policy from time to time. We will notify you of 
                any material changes by posting the new policy on our website and updating 
                the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-arw-navy mb-4">13. Contact Us</h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy or our privacy practices, 
                please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><strong>ARW Construction</strong></p>
                <p className="mb-2">Phone: 0423 736 921</p>
                <p className="mb-2">Email: info@arwc.com.au</p>
                <p>Website: arwc.com.au</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  This Privacy Policy complies with the Australian Privacy Principles (APPs) 
                  under the Privacy Act 1988 (Cth) and other applicable privacy laws.
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

export default PrivacyPolicy;
