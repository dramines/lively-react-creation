
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-white overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-serif text-gray-900">
            {t('wimbledon.aboutTitle')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          {/* Brand Image */}
          <div className="mb-6 overflow-hidden rounded-lg">
            <img
              src="/lovable-uploads/187386b2-1a7f-4401-ab51-7965f2c25e8c.png"
              alt="Lucci by E.Y Storefront"
              className="w-full h-80 object-cover"
            />
          </div>
          
          {/* Brand Description */}
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              {t('wimbledon.aboutDescription')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
