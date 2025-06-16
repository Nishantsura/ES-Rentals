'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  backUrl?: string;
}

export function PageHeader({ title, backUrl = '/' }: PageHeaderProps) {
  return (
    <div className="bg-zinc-900/95 border-b border-zinc-800/30 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center md:h-20 h-16">
          <div className="absolute left-4 sm:left-6 lg:left-24 flex items-center">
            <Link
              href={backUrl}
              className="p-2 hover:bg-zinc-800/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-teal-400" />
            </Link>
            {/* <p className="ml-0 text-sm font-semibold text-white">Back</p> */}
          </div>
          <h1 className="heading-4 font-semibold text-white flex-1 text-center">{title}</h1>
        </div>
      </div>
    </div>
  );
}
