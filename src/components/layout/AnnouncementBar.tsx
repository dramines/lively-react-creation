
import { useTranslation } from 'react-i18next';
import { ShoppingBag, MapPin, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnnouncementBarProps {
  onStoreFinderOpen?: () => void;
}

const AnnouncementBar = ({ onStoreFinderOpen }: AnnouncementBarProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className="bg-blue-800 text-white py-2 px-4 text-center text-xs font-medium relative">
      {/* Mobile: Find us button on left */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 md:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20 p-1"
          onClick={onStoreFinderOpen}
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop: Left side - Social media icons */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 hidden md:flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20 p-1"
          onClick={() => window.open('https://facebook.com', '_blank')}
        >
          <Facebook className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20 p-1"
          onClick={() => window.open('https://instagram.com', '_blank')}
        >
          <Instagram className="w-4 h-4" />
        </Button>
      </div>

      {/* Center content - summer sale text */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-xs">{t('header.summerSale')} | {t('header.shopNow')}</span>
      </div>

      {/* Desktop: Right side - Store finder and Language selector */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20 text-xs"
          onClick={onStoreFinderOpen}
        >
          <MapPin className="w-4 h-4 mr-1" />
          Trouver un magasin
        </Button>
        <div className="scale-90">
          <LanguageSelector variant="white" />
        </div>
      </div>

      {/* Mobile: Language selector on right */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 md:hidden">
        <div className="scale-90">
          <LanguageSelector variant="white" />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
