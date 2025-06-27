
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  const { t } = useTranslation('legal');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {t('privacy.title')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">{t('privacy.dataCollection.title')}</h3>
              <p className="text-slate-600 mb-3">{t('privacy.dataCollection.description')}</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>{t('privacy.dataCollection.items.personal')}</li>
                <li>{t('privacy.dataCollection.items.contact')}</li>
                <li>{t('privacy.dataCollection.items.usage')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('privacy.dataUsage.title')}</h3>
              <p className="text-slate-600 mb-3">{t('privacy.dataUsage.description')}</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>{t('privacy.dataUsage.items.service')}</li>
                <li>{t('privacy.dataUsage.items.communication')}</li>
                <li>{t('privacy.dataUsage.items.improvement')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('privacy.dataSharing.title')}</h3>
              <p className="text-slate-600">{t('privacy.dataSharing.description')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('privacy.rights.title')}</h3>
              <p className="text-slate-600 mb-3">{t('privacy.rights.description')}</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>{t('privacy.rights.items.access')}</li>
                <li>{t('privacy.rights.items.correction')}</li>
                <li>{t('privacy.rights.items.deletion')}</li>
                <li>{t('privacy.rights.items.portability')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('privacy.contact.title')}</h3>
              <p className="text-slate-600">{t('privacy.contact.description')}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
