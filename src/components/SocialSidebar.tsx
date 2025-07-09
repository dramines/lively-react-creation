
import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';

const SocialSidebar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://www.facebook.com/people/SPADA-DI-Battaglia/100091305805751/',
      label: 'Facebook',
      color: 'hover:bg-blue-600'
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/spadadibattaglia/?hl=en',
      label: 'Instagram',
      color: 'hover:bg-pink-600'
    },
    {
      icon: MapPin,
      href: 'https://www.google.com/maps/place/SPADA+DI+BATTAGLIA/@36.867972,10.3039145,18.5z/',
      label: 'Localisation',
      color: 'hover:bg-gray-600'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
      
      // Auto-collapse when scrolling down on mobile
      if (scrollY > 100) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Desktop version - always visible on left side */}
      <div className="hidden lg:block fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col space-y-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className={`w-12 h-12 bg-black text-white flex items-center justify-center rounded-r-lg shadow-lg transition-all duration-300 hover:scale-110 ${social.color} group`}
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <social.icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
            </a>
          ))}
        </div>
      </div>

      {/* Mobile version - positioned at bottom left */}
      <div className="lg:hidden fixed bottom-6 left-0 z-40">
        {/* Toggle button - only show when scrolled, attached to left border */}
        {isScrolled && !isExpanded && (
          <button
            onClick={toggleExpanded}
            className="w-8 h-8 bg-black bg-opacity-70 text-white flex items-center justify-center rounded-r-md shadow-md transition-all duration-300 hover:bg-opacity-90"
            aria-label="Show social links"
          >
            <ChevronRight size={12} />
          </button>
        )}

        {/* Social links - show initially or when expanded, attached to left border */}
        {(!isScrolled || isExpanded) && (
          <div className="flex flex-col">
            {/* Close button - only show when expanded after scroll */}
            {isScrolled && isExpanded && (
              <button
                onClick={toggleExpanded}
                className="w-12 h-10 bg-gray-800 bg-opacity-80 text-white flex items-center justify-center rounded-tr-lg shadow-lg transition-all duration-300 hover:bg-opacity-90"
                aria-label="Hide social links"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            
            {socialLinks.map((social, index) => (
              <a
                key={social.label}
                href={social.href}
                className={`w-12 h-10 bg-black text-white flex items-center justify-center shadow-lg transition-all duration-300 ${social.color} group ${
                  index === socialLinks.length - 1 ? 'rounded-br-lg' : ''
                } ${!isScrolled && index === 0 ? 'rounded-tr-lg' : ''}`}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon size={18} className="group-hover:scale-110 transition-transform duration-200" />
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SocialSidebar;
