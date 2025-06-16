import { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { FAQItem } from './components/FAQItem';

export const metadata: Metadata = {
  title: 'FAQ - AutoLuxe',
  description: 'Frequently Asked Questions about AutoLuxe luxury car rental services in Dubai',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What types of luxury cars are available for rent?",
      answer: "We offer an extensive range of high-end vehicles, including exotic sports cars, luxury sedans, and premium SUVs. Our fleet features brands like Ferrari, Lamborghini, Rolls-Royce, Bentley, Mercedes-Benz, and more, ensuring you find the perfect car for your Dubai experience."
    },
    {
      question: "How do I book a luxury car rental?",
      answer: "Booking is simple and convenient. You can use our online reservation system on our website, call our dedicated customer service line at +971 4 XXX XXXX, or visit our office in Dubai. We'll guide you through the process and help you select the ideal vehicle for your needs."
    },
    {
      question: "What are the rental requirements?",
      answer: "To rent a luxury car, you must be at least 25 years old, possess a valid driver's license, and provide a credit card for the security deposit. International visitors need a passport and their home country's driver's license or an international driving permit. We may have additional requirements for certain high-end models."
    },
    {
      question: "Do you offer chauffeur services?",
      answer: "Yes, we provide professional chauffeur services for those who prefer not to drive. Our experienced drivers are knowledgeable about Dubai and can ensure a comfortable and stylish journey. This service is available for all our vehicles and can be booked hourly, daily, or for special events."
    },
    {
      question: "What insurance coverage is included with the rental?",
      answer: "All our rentals come with comprehensive insurance coverage. This typically includes collision damage waiver (CDW) and theft protection. We also offer additional coverage options for extra peace of mind. Our team can explain the details and help you choose the best coverage for your rental."
    },
    {
      question: "Can I take the rented car outside of Dubai?",
      answer: "Yes, most of our vehicles can be driven throughout the UAE. However, specific restrictions may apply to certain high-end models. If you plan to travel outside of Dubai, please inform us in advance so we can provide you with the necessary documentation and ensure your vehicle is properly equipped for inter-emirate travel."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-900">
      <PageHeader title="FAQ" />
      
      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8 sm:px-6">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 bg-zinc-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-zinc-700/50 shadow-lg">
          <h2 className="text-lg font-medium text-white mb-2">Need more information?</h2>
          <p className="text-sm text-zinc-300 mb-5">
            Our luxury car rental experts are ready to assist you with any additional queries or special requests.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-teal-500 text-zinc-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-teal-400 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </main>
    </div>
  );
}
