import Link from 'next/link';

export function NotSureSection() {
  const whatsappLink = "https://wa.me/+971000000000"; // Replace with your actual WhatsApp number

  return (
   
     <div className="mt-10 bg-indigo-100 rounded-lg p-6 text-center border border-gray-200">
     <h2 className="text-lg font-medium text-gray-900 mb-2">Not sure what to choose?</h2>
     <p className="text-sm text-gray-600 mb-4">
       Our team is here to help you pick the perfect car for your needs.
     </p>
     <Link 
       href={whatsappLink}
       className="inline-block bg-indigo-400 text-white px-5 py-2.5 rounded-full  text-sm font-medium hover:bg-indigo-900 transition-colors"
     >
       Talk to us
     </Link>
   </div>
  );
}
