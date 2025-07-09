
import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import SizeGuideModal from './SizeGuideModal';

const Footer = () => {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const footerLinks = {
    shop: [
      'Costumes',
      'Chemises',
      'Accessoires',
      'Sur Mesure'
    ],
    customer: [
      'Livraison',
      'Retours',
      'Contact'
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <img 
              src="/lovable-uploads/69b552f1-586a-4e89-9275-11ee73acf808.png" 
              alt="Paola Di Battiglia" 
              className="h-12 w-auto mb-6"
            />
            <p className="text-gray-600 text-sm mb-8 leading-relaxed font-light">
              Sartoria italiana d'eccellenza dal 1953. Ogni capo è realizzato a mano nei nostri atelier di Milano.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-gray-400" />
                <span>+216 56 829 717</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-gray-400" />
                <span>contact@spadadibattaglia.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-gray-400" />
                <span>SPADA DI BATTAGLIA, P9, Tunis, La Marsa, Tunisia</span>
              </div>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-medium text-gray-900 mb-6 text-sm tracking-wide uppercase">Collections</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="font-medium text-gray-900 mb-6 text-sm tracking-wide uppercase">Services</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-light text-left"
                >
                  Guide des Tailles
                </button>
              </li>
              {footerLinks.customer.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment methods */}
          <div>
            <h3 className="font-medium text-gray-900 mb-6 text-sm tracking-wide uppercase">Moyen de paiement</h3>
            <div className="flex flex-wrap gap-2">
              <img 
                src="/lovable-uploads/d96e264c-4c78-436f-8046-7b929a4d5ce8.png" 
                alt="Moyens de paiement acceptés" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Bottom section with copyright and developer credit */}
        <div className="border-t border-gray-100 pt-12 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-gray-500 font-light tracking-wide">
                © 2024 Paola Di Battaglia • Tunis
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-500 font-light tracking-wide">
                Developed by{' '}
                <a 
                  href="https://ihebchebbi.pro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 transition-colors underline"
                >
                  Iheb Chebbi
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />
    </footer>
  );
};

export default Footer;
