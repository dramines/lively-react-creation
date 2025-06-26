
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityModal = ({ isOpen, onClose }: AccessibilityModalProps) => {
  const { t } = useTranslation('legal');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {t('accessibility.title')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">{t('accessibility.commitment.title')}</h3>
              <p className="text-slate-600">{t('accessibility.commitment.description')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('accessibility.features.title')}</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>{t('accessibility.features.items.keyboard')}</li>
                <li>{t('accessibility.features.items.screenReader')}</li>
                <li>{t('accessibility.features.items.colorContrast')}</li>
                <li>{t('accessibility.features.items.textSize')}</li>
                <li>{t('accessibility.features.items.altText')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('accessibility.guidelines.title')}</h3>
              <p className="text-slate-600">{t('accessibility.guidelines.description')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('accessibility.feedback.title')}</h3>
              <p className="text-slate-600 mb-3">{t('accessibility.feedback.description')}</p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700 font-medium">Email: contact@luccybyey.fr</p>
                <p className="text-slate-700 font-medium">Phone: +33 1 23 45 67 89</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('accessibility.limitations.title')}</h3>
              <p className="text-slate-600">{t('accessibility.limitations.description')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('accessibility.improvements.title')}</h3>
              <p className="text-slate-600">{t('accessibility.improvements.description')}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityModal;
