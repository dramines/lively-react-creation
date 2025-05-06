
import React from 'react';
import { MessageSquare, Facebook, Instagram, Youtube } from "lucide-react";
import TikTokIcon from '../icons/TikTokIcon';

const SocialButtons: React.FC = () => {
  return (
    <>
      <a
        href="https://wa.me/+33600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-6 bottom-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-colors"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="font-medium">Besoin d'aide ?</span>
      </a>

      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
        <a
          href="https://www.facebook.com/share/15CMhRGoUM/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Visit our Facebook page"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a
          href="https://www.instagram.com/tazart.lessaveursduterroir"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Visit our Instagram page"
        >
          <Instagram className="h-5 w-5" />
        </a>
        <a
          href="https://www.tiktok.com/@tazarttunisie?_t=ZS-8uOsLDKyctT&_r=1" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Visit our YouTube channel"
        >
         <TikTokIcon size={18} />
        </a>
      </div>
    </>
  );
};

export default SocialButtons;
