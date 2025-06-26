import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StoreFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoreFinderModal = ({ isOpen, onClose }: StoreFinderModalProps) => {
  const { t } = useTranslation();

  const handleGetDirections = () => {
    window.open('https://www.google.com/maps/place/LUCCI+BY+EY/@36.8454422,10.2806219,17z/', '_blank');
  };

  const handleCall = () => {
    window.open('tel:+21671234567');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-serif text-center">
            {t('store.title')}
          </DialogTitle>
          <p className="text-slate-300 text-center mt-2">
            {t('store.subtitle')}
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Store Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="/lovable-uploads/4ac0aa6a-9efd-4605-bd48-d4084f3ba1d6.png"
              alt="LUCCI BY EY Boutique"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <h3 className="text-xl font-serif font-bold text-white mb-1">
                LUCCI BY EY
              </h3>
              <p className="text-xs text-white/90 tracking-widest uppercase">
                {t('store.established')}
              </p>
            </div>
          </div>

          {/* Store Details */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg mb-2">{t('store.address')}</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Centre Commercial Lac 2<br />
                    1053 Tunis, Tunisie
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg mb-2">{t('store.phone')}</h4>
                  <button 
                    onClick={handleCall}
                    className="text-slate-300 hover:text-white transition-colors font-medium"
                  >
                    +216 71 234 567
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg mb-3">{t('store.hours')}</h4>
                  <div className="text-slate-300 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{t('store.mondayToSaturday')}</span>
                      <span className="font-semibold text-white">10h00 - 19h00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('store.sunday')}</span>
                      <span className="font-semibold text-white">11h00 - 18h00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleGetDirections}
              className="w-full h-12 bg-white text-black hover:bg-gray-200 font-medium text-lg"
            >
              <Navigation className="w-5 h-5 mr-3" />
              {t('store.getDirections')}
              <ExternalLink className="w-4 h-4 ml-3 opacity-70" />
            </Button>
            
            <Button 
              onClick={handleCall}
              variant="outline"
              className="w-full h-12 border-2 border-slate-600 text-white hover:bg-slate-700 font-medium text-lg bg-transparent"
            >
              <Phone className="w-5 h-5 mr-3" />
              {t('store.contactUs')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreFinderModal;
