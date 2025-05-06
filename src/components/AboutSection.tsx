
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../hooks/use-mobile';

const AboutSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  return (
    <section id="about" className="bg-muted py-20">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src="/AboutImage.png"
              alt={t('about.our_story')}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#64381b]">{t('about.our_story')}</h2>
            <p className="text-gray-600">
              {t('about.history_text_1')}
            </p>
            <p className="text-gray-600">
              {t('about.history_text_2')}
            </p>
            
            {/* Stats - Visible only on desktop */}
            <div className={`${isMobile ? 'hidden' : 'grid'} grid-cols-2 gap-2 pt-4`}> 
              <div className="text-center">
                <div className="text-3xl font-bold text-[#64381b]">500+</div>
                <div className="text-sm text-gray-600">{t('resellers.official_partner')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#64381b]">200+</div>
                <div className="text-sm text-gray-600">{t('about.affiliated_producers')}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats - Visible only on mobile, below the main content */}
        {isMobile && (
          <div className="mt-10 grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#64381b]">500+</div>
              <div className="text-sm text-gray-600">{t('resellers.official_partner')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#64381b]">200+</div>
              <div className="text-sm text-gray-600">{t('about.affiliated_producers')}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
