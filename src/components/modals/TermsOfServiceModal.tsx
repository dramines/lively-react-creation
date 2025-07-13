
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfServiceModal = ({ isOpen, onClose }: TermsOfServiceModalProps) => {
  const { t } = useTranslation('legal');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {t('terms.title')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">{t('terms.acceptance.title')}</h3>
              <p className="text-slate-600">{t('terms.acceptance.description')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('terms.services.title')}</h3>
              <p className="text-slate-600 mb-3">{t('terms.services.description')}</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>{t('terms.services.items.products')}</li>
                <li>{t('terms.services.items.appointments')}</li>
                <li>{t('terms.services.items.consultations')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('terms.userObligations.title')}</h3>
              <p className="text-slate-600 mb-3">{t('terms.userObligations.description')}</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>{t('terms.userObligations.items.accurate')}</li>
                <li>{t('terms.userObligations.items.lawful')}</li>
                <li>{t('terms.userObligations.items.respect')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('terms.intellectualProperty.title')}</h3>
              <p className="text-slate-600">{t('terms.intellectualProperty.description')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('terms.limitation.title')}</h3>
              <p className="text-slate-600">{t('terms.limitation.description')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('terms.modifications.title')}</h3>
              <p className="text-slate-600">{t('terms.modifications.description')}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfServiceModal;
