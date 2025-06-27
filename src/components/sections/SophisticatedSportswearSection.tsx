
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import BookingModal from '@/components/modals/BookingModal';

const SophisticatedSportswearSection = () => {
  const { t } = useTranslation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBookingOpen = () => {
    setIsBookingOpen(true);
  };

  const handleBookingClose = () => {
    setIsBookingOpen(false);
  };

  return (
    <>
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("/lovable-uploads/dcedd9e6-ff56-448d-9c22-63c9d118640d.png")`
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-12 text-white">
            {/* Top brand text */}
            <div className="pt-8">
              <p className="text-sm font-medium tracking-wider uppercase">
                {t('sophisticatedSportswear.brand')}
              </p>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col justify-center max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-wide leading-tight">
                {t('sophisticatedSportswear.title')}
              </h2>
              <div className="text-lg md:text-xl font-light mb-8 space-y-1">
                <p>{t('sophisticatedSportswear.subtitle1')}</p>
                <p>{t('sophisticatedSportswear.subtitle2')}</p>
              </div>
              <Button
                onClick={handleBookingOpen}
                className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-8 py-3 text-base font-medium transition-all duration-300 w-fit"
              >
                {t('sophisticatedSportswear.bookNow')}
              </Button>
            </div>

            {/* Bottom spacer */}
            <div className="pb-8"></div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={handleBookingClose} />
    </>
  );
};

export default SophisticatedSportswearSection;
