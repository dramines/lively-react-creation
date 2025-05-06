
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { X, Cookie } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent = ({ onAccept, onDecline }: CookieConsentProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = Cookies.get('cookieConsent');
    if (!hasConsent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    Cookies.set('cookieConsent', 'declined', { expires: 365 });
    setIsVisible(false);
    onDecline();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg relative border border-gray-100">
            <button 
              onClick={handleDecline}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{t('cookies.preferences')}</h3>
            </div>
            
            <p className="text-muted-foreground text-sm mb-5">
              {t('cookies.description')}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
              >
                {t('cookies.accept_all')}
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {t('cookies.decline')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
