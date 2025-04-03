
import { Instagram, Facebook, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { t } = useTranslation();
  const { clientType } = useApp();
  const isB2B = clientType === 'B2B';
  
  return (
    <footer className="bg-gradient-to-br from-[#64381b] to-[#4e2b15] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center md:justify-between items-start gap-8 md:gap-12">
          {/* About Company */}
          <div className="w-full md:flex-1 max-w-sm space-y-4">
            <h3 className="text-xl font-playfair relative inline-block">
              {t('about.our_story')}
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#96cc39]"></span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.company_description')}
            </p>
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/tazart.lessaveursduterroir" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#96cc39] transition-all duration-300 group">
                <Instagram size={16} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://www.facebook.com/share/15CMhRGoUM/?mibextid=wwXIfr" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#96cc39] transition-all duration-300 group">
                <Facebook size={16} className="group-hover:scale-110 transition-transform" />
              </a>
              <a  href="https://www.tiktok.com/@tazarttunisie?_t=ZS-8uOsLDKyctT&_r=1" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#96cc39] transition-all duration-300 group">
                <TikTokIcon size={16} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full md:flex-1 max-w-xs space-y-4">
            <h3 className="text-xl font-playfair relative inline-block">
              {t('footer.quick_links')}
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#96cc39]"></span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="#" onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: { page: 'home' } }))} className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>{t('navbar.home')}</span>
              </a>
              <a href="#" onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: { page: 'products-all' } }))} className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>{t('navbar.products')}</span>
              </a>
              <a href="#" onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: { page: 'about' } }))} className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>{t('navbar.about')}</span>
              </a>
              <a href="#" onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: { page: 'certifications' } }))} className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>{t('navbar.quality')}</span>
              </a>
              {clientType === 'B2C' && (
                <a href="#" onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: { page: 'resellers' } }))} className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  <span>{t('navbar.resellers')}</span>
                </a>
              )}
              <a href="#" onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: { page: 'contact' } }))} className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>{isB2B ? t('navbar.contact') : t('navbar.consumer_service')}</span>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="w-full md:flex-1 max-w-xs space-y-4">
            <h3 className="text-xl font-playfair relative inline-block">
              {t('contact.contact_us')}
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#96cc39]"></span>
            </h3>
            <div className="space-y-3 text-sm">
              <a href="mailto:contact@tazart.tn" 
                className="flex items-center space-x-3 hover:text-[#96cc39] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#96cc39] transition-colors">
                  <Mail size={14} className="group-hover:scale-110 transition-transform" />
                </div>
                <span>contact@tazart.tn</span>
              </a>
              <a href="tel:+21671385385" 
                className="flex items-center space-x-3 hover:text-[#96cc39] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#96cc39] transition-colors">
                  <Phone size={14} className="group-hover:scale-110 transition-transform" />
                </div>
                <span>{t('contact_info.phone')}</span>
              </a>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                <span>{t('contact_info.address')}</span>
              </div>
            </div>
          </div>

          {/* Image with 100% Tunisian text */}
          <div className="w-full md:flex-1 max-w-xs flex justify-center md:justify-start">
            <div className="relative">
              <img src="MadeInTunisiaFooter.png" alt="Footer Image" className="w-[180px] h-[220px] object-cover rounded-lg" />
              <div className="absolute top-4 left-0 right-0 text-center">
                <div className="bg-[#96cc39] text-white px-4 py-1 rounded-full inline-block font-bold shadow-md transform -rotate-2">
                  100% TUNISIAN
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-gray-300">
            {t('footer.made_with')} <Heart size={12} className="text-[#96cc39]" fill="#96cc39" /> {t('footer.by')}{" "}
            <a 
              href="https://ihebchebbi.pro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#96cc39] hover:underline transition-all"
            >
              Iheb Chebbi
            </a>
            {" "}© {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};
