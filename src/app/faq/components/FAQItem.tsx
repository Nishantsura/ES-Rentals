'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-700/50 rounded-xl overflow-hidden bg-zinc-800/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-zinc-700/30 transition-colors"
      >
        <span className="text-base font-medium text-white text-left">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-teal-400 flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-5 h-5 text-teal-400 flex-shrink-0 ml-4" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px]' : 'max-h-0'
        }`}
      >
        <div className="p-5 bg-zinc-700/30 border-t border-zinc-600/50">
          <p className="text-sm leading-relaxed text-zinc-300">{answer}</p>
        </div>
      </div>
    </div>
  );
}
