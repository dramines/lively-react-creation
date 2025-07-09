
import { useTranslation } from 'react-i18next';
import { ShoppingBag, MapPin, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

      {/* Center content - summer sale text only */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-xs">{t('announcement:summerSale')}</span>
      </div>

      {/* Desktop: Right side - Store finder only */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20 text-xs"
          onClick={onStoreFinderOpen}
        >
          <MapPin className="w-4 h-4 mr-1" />
          {t('announcement:findStore')}
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
