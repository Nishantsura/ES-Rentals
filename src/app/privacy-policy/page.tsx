import { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { PrivacySection } from './components/PrivacySection';

export const metadata: Metadata = {
  title: 'Privacy Policy - AutoLuxe',
  description: 'Privacy Policy for AutoLuxe luxury car rental services in Dubai',
};

export default function PrivacyPolicyPage() {
  const privacyContent = [
    {
      title: "Information We Collect",
      content: "We collect information that you provide directly to us, including your name, contact information, driver's license details, payment information, and other information necessary for car rentals. We also automatically collect certain information about your device and how you interact with our services."
    },
    {
      title: "How We Use Your Information",
      content: "We use your information to process your rental requests, communicate with you about our services, improve our offerings, ensure the security of our services, and comply with legal obligations. We may also use your information to send you marketing communications about our services, subject to your preferences."
    },
    {
      title: "Information Sharing",
      content: "We may share your information with trusted service providers who assist us in operating our business, processing payments, and delivering services to you. We may also share information when required by law or to protect our rights and the safety of our users."
    },
    {
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your information. To exercise these rights, please contact us using the information provided below."
    },
    {
      title: "Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences, although disabling certain cookies may impact website functionality."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Privacy Policy" />
      
      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8 sm:px-6">
        <div className="space-y-3">
          {privacyContent.map((section, index) => (
            <PrivacySection key={index} title={section.title} content={section.content} />
          ))}
        </div>

        <div className="mt-10 bg-white rounded-lg p-6 text-center border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Questions About Our Privacy Policy?</h2>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions about our privacy practices or would like to exercise your rights, please contact us.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </main>
    </div>
  );
}
