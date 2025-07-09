
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookiePolicyModal = ({ isOpen, onClose }: CookiePolicyModalProps) => {
  const { t } = useTranslation('legal');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {t('cookies.title')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">{t('cookies.whatAreCookies.title')}</h3>
              <p className="text-slate-600">{t('cookies.whatAreCookies.description')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('cookies.typesOfCookies.title')}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('cookies.typesOfCookies.essential.title')}</h4>
                  <p className="text-slate-600 text-sm">{t('cookies.typesOfCookies.essential.description')}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t('cookies.typesOfCookies.analytics.title')}</h4>
                  <p className="text-slate-600 text-sm">{t('cookies.typesOfCookies.analytics.description')}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t('cookies.typesOfCookies.marketing.title')}</h4>
                  <p className="text-slate-600 text-sm">{t('cookies.typesOfCookies.marketing.description')}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('cookies.manageCookies.title')}</h3>
              <p className="text-slate-600 mb-3">{t('cookies.manageCookies.description')}</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>{t('cookies.manageCookies.items.browser')}</li>
                <li>{t('cookies.manageCookies.items.settings')}</li>
                <li>{t('cookies.manageCookies.items.thirdParty')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('cookies.updates.title')}</h3>
              <p className="text-slate-600">{t('cookies.updates.description')}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePolicyModal;
