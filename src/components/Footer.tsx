"use client"

import Link from 'next/link';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

// Import icons individually to avoid issues
import { FaInstagram } from 'react-icons/fa';
import { FaSnapchatGhost } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="border-t border-border bg-background/80 dark:bg-black/20 backdrop-blur-sm mt-16 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12 dark:text-white/90">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <img 
              src="/images/ES logo (1).svg" 
              alt="Elite Services Logo" 
              className="h-16 mb-3" 
              style={{ filter: 'brightness(0) saturate(100%) invert(61%) sepia(72%) saturate(686%) hue-rotate(131deg) brightness(90%) contrast(101%)' }} 
            />
            <p className="text-sm text-muted-foreground mb-4">
              Your premier destination for luxury and exotic car rentals.
            </p>
            <div className="text-sm text-muted-foreground mb-4">
              <p>Dubai, UAE</p>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-3">
              <a 
                href="https://www.instagram.com/elite.slk/?igsh=ZjNzZ2Y2dWJ1Z2Y2#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-500 transition-colors text-muted-foreground"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://snapchat.com/t/JyDBbZS1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-500 transition-colors text-muted-foreground"
                aria-label="Snapchat"
              >
                <FaSnapchatGhost size={18} />
              </a>
              <a 
                href="mailto:info@esrent.ae" 
                className="hover:text-teal-500 transition-colors text-muted-foreground"
                aria-label="Email"
              >
                <FaEnvelope size={18} />
              </a>
              <a 
                href="tel:+971553553626" 
                className="hover:text-teal-500 transition-colors text-muted-foreground"
                aria-label="Phone"
              >
                <FaPhone size={18} />
              </a>
            </div>
          </div>



          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Support</h3>
            <nav className="space-y-2">
              <button 
                onClick={() => setShowTerms(true)} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block text-left w-full"
              >
                Terms & Conditions
              </button>
              <button 
                onClick={() => setShowPrivacy(true)} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block text-left w-full"
              >
                Privacy Policy
              </button>
            </nav>
          </div>
        </div>

        {/* Credits and Copyright */}
        <div className="pt-8 border-t border-border dark:border-white/10">
          {/* Made by line - moved before copyright */}
          <div className="text-sm text-muted-foreground dark:text-white/60 mb-2">
            <a href="https://nishantsura.com/" className="hover:text-foreground dark:hover:text-white transition-colors">
            Made with 💙 by Nishant Sura</a>
          </div>
          
          {/* Copyright Bar - converted to single line */}
          <div className="text-sm text-muted-foreground">
            {currentYear} Elite Selection. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Terms & Conditions Dialog */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="mb-4">Last updated: {currentYear}-06-15</p>
              
              <h3 className="text-lg font-semibold my-3">1. Acceptance of Terms</h3>
              <p>By accessing and using Elite Selection services, you agree to be bound by these Terms & Conditions.</p>
              
              <h3 className="text-lg font-semibold my-3">2. Rental Requirements</h3>
              <p>Customers must be at least 21 years old with a valid driver's license and credit card.</p>
              
              <h3 className="text-lg font-semibold my-3">3. Reservation and Cancellation</h3>
              <p>Cancellations must be made 48 hours prior to pickup to avoid charges.</p>
              
              <h3 className="text-lg font-semibold my-3">4. Insurance</h3>
              <p>Basic insurance is included with all rentals. Optional comprehensive coverage is available.</p>
              
              <h3 className="text-lg font-semibold my-3">5. Vehicle Return</h3>
              <p>Vehicles must be returned in the same condition as when rented. Late returns may incur additional charges.</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="mb-4">Last updated: {currentYear}-06-15</p>
              
              <h3 className="text-lg font-semibold my-3">1. Information We Collect</h3>
              <p>We collect personal information such as your name, contact details, driver's license information, and payment details.</p>
              
              <h3 className="text-lg font-semibold my-3">2. How We Use Your Information</h3>
              <p>Your information is used to process reservations, verify identity, process payments, and communicate with you about your rental.</p>
              
              <h3 className="text-lg font-semibold my-3">3. Information Sharing</h3>
              <p>We do not sell your information to third parties. Information may be shared with service providers who help us operate our business.</p>
              
              <h3 className="text-lg font-semibold my-3">4. Security</h3>
              <p>We implement appropriate security measures to protect your personal information.</p>
              
              <h3 className="text-lg font-semibold my-3">5. Your Rights</h3>
              <p>You have the right to access, correct, or delete your personal information.</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
