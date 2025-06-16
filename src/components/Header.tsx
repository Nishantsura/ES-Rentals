"use client"

import { Home, Car, SprayCan, HelpCircle, Menu, X, Phone, Award, PanelRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NavBar } from '@/components/ui/tubelight-navbar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Home', url: '/', icon: Home, color: 'text-blue-500' },
    { name: 'Browse Cars', url: '/cars', icon: Car, color: 'text-green-500' },
    { name: 'Brands', url: '/brands', icon: SprayCan, color: 'text-purple-500' },
    { name: 'FAQ', url: '/faq', icon: HelpCircle, color: 'text-amber-500' }
  ];

  return (
    <>
      <header className="py-2 sm:py-2 px-4 sm:px-8 border-b border-border bg-white/50 dark:bg-background/80 backdrop-blur-lg sticky top-0 z-50 left-0 right-0 theme-transition shadow-sm">
        <div className='flex flex-row items-center justify-between w-full max-w-[1800px] mx-auto'>
          <a 
            href="/" 
            className="flex items-center"
            aria-label="Go to homepage"
          >
            <img 
              src="/images/download.png" 
              alt="AutoLuxe Logo" 
              className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-all duration-300" 
            />
          </a>

          {/* Tubelight NavBar - Responsive for both desktop and mobile */}
          <div className="flex-1 flex items-center justify-center">
            <NavBar items={navItems} className="static sm:transform-none mx-auto" />
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Book Button */}
            <a 
              href="https://wa.me/919121883163" 
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary dark:bg-primary text-black rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 text-black" />
              <span className="text-sm font-semibold">Quick Book</span>
            </a>
            
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-full transition-all duration-300 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-primary dark:text-primary hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-xl transform transition-all duration-300 ease-in-out z-[100] ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-black dark:text-foreground" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className={`text-lg font-medium transition-colors hover:text-primary ${pathname === item.url ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}
              >
                {item.name}
              </a>
            ))}
            <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />
            <a href="/terms" className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors">Terms & Conditions</a>
            <a href="/privacy-policy" className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors">Privacy Policy</a>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <a 
                href="https://wa.me/919121883163" 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-black rounded-full hover:opacity-90 transition-opacity"
              >
                <Phone className="w-4 h-4 text-black" />
                <span>Quick Book</span>
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 backdrop-blur-[2px] bg-black/5 dark:bg-black/30 transition-all duration-300 z-[90] ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
}

export default Header;
