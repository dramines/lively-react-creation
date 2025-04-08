
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { partners } from '../config/partners';

const Partners = () => {
  const { t } = useTranslation();

  // Track page visit
  useEffect(() => {
    const event = new CustomEvent('navigateTo', { detail: { page: 'partners' } });
    window.dispatchEvent(event);
  }, []);

  // Get the remainder to determine last row centering
  const remainder = partners.length % 3;
  const lastRowPartners = remainder !== 0 ? partners.slice(-remainder) : [];

  return (
    <div className="min-h-screen pt-36 pb-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-[#700100] mb-5">
            <Building2 className="w-7 h-7" />
            <h1 className="text-4xl font-playfair text-[#700100] mb-4">{t('partners.title')}</h1>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-[#700100] to-[#96cc39] mx-auto mb-10 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('partners.subtitle')}</p>
        </motion.div>

        {/* Partners Grid */}
        <div className="flex flex-col items-center">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {partners.slice(0, partners.length - remainder).map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card p-8 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center items-center"
              >
                <div className="h-64 flex items-center justify-center relative overflow-hidden w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/30 opacity-80 rounded-lg"></div>
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className={`${
                      partner.id === 'carrefour' || partner.id === 'geant' 
                        ? 'h-48 w-auto' 
                        : partner.id === 'monoprix' 
                          ? 'h-32' 
                          : 'h-36'
                    } object-contain relative z-10 transition-transform duration-300 hover:scale-105`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-logo.png';
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Centered Last Row if Needed */}
          {remainder !== 0 && (
            <div className={`grid gap-8 md:gap-10 mt-8 ${remainder === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
              {lastRowPartners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-card p-8 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center items-center"
                >
                  <div className="h-64 flex items-center justify-center relative overflow-hidden w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/30 opacity-80 rounded-lg"></div>
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className={`${
                        partner.id === 'carrefour' || partner.id === 'geant' 
                          ? 'h-48 w-auto' 
                          : partner.id === 'monoprix' 
                            ? 'h-32' 
                            : 'h-36'
                      } object-contain relative z-10 transition-transform duration-300 hover:scale-105`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-logo.png';
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Partners;