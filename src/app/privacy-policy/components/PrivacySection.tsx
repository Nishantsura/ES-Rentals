'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface PrivacySectionProps {
  title: string;
  content: string;
}

export function PrivacySection({ title, content }: PrivacySectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-medium text-gray-900 text-left">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-4" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm leading-relaxed text-gray-600">{content}</p>
        </div>
      </div>
    </div>
  );
}
