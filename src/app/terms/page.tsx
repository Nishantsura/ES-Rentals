import { PageHeader } from "@/components/PageHeader";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Terms and Conditions" />
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="heading-3 text-primary mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">By accessing and using AutoLuxe's services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>
            </section>

            <section className="mb-8">
              <h2 className="heading-3 text-primary mb-4">2. Rental Requirements</h2>
              <ul className="list-none space-y-3">
                {[
                  "Must be at least 25 years of age",
                  "Valid driver's license",
                  "Valid credit card in renter's name",
                  "Proof of insurance",
                  "Valid passport or Emirates ID"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-sm mr-3 mt-0.5">•</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="heading-3 text-primary mb-4">3. Rental Period and Charges</h2>
              <p className="text-gray-600">Rental periods are calculated on a 24-hour basis from the time of pickup. Late returns may incur additional charges. All rates are subject to change without notice.</p>
            </section>

            <section className="mb-8">
              <h2 className="heading-3 text-primary mb-4">4. Vehicle Care and Usage</h2>
              <p className="text-gray-600 mb-4">The renter agrees to:</p>
              <ul className="list-none space-y-3">
                {[
                  "Use the vehicle only for lawful purposes",
                  "Not smoke in the vehicle",
                  "Return the vehicle in the same condition as received",
                  "Report any damage or mechanical issues immediately"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-sm mr-3 mt-0.5">•</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="heading-3 text-primary mb-4">5. Insurance and Liability</h2>
              <p className="text-gray-600">Basic insurance is included in the rental price. Additional coverage options are available. The renter is responsible for any damage not covered by the insurance policy.</p>
            </section>

            <section className="mb-8">
              <h2 className="heading-3 text-primary mb-4">6. Cancellation Policy</h2>
              <p className="text-gray-600">Cancellations made 24 hours or more before the rental period starts will receive a full refund. Late cancellations may be subject to charges.</p>
            </section>

            <section className="mb-8">
              <h2 className="heading-3 text-primary mb-4">7. Privacy Policy</h2>
              <p className="text-gray-600">We respect your privacy and protect your personal information. For details on how we collect and use your data, please refer to our Privacy Policy.</p>
            </section>

            <section className="mb-8">
              <h2 className="heading-3 text-primary mb-4">8. Contact Information</h2>
              <p className="text-gray-600 mb-4">For any questions or concerns regarding these terms, please contact us at:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Email:</span> support@autoluxe.com</p>
                  <p><span className="font-medium">Phone:</span> +971 XX XXX XXXX</p>
                  <p><span className="font-medium">Address:</span> Dubai, UAE</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
