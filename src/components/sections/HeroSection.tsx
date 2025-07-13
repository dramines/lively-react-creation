
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onBookingOpen?: () => void;
}

const HeroSection = ({ onBookingOpen }: HeroSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const handleDiscoverCollection = () => {
    navigate('/all-products');
  };

  const handleBookAppointment = () => {
    if (onBookingOpen) {
      onBookingOpen();
    }
  };

  return (
    <section className="relative h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Desktop Background pattern */}
      <div className="hidden md:block absolute inset-0 opacity-80">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("https://i.pinimg.com/originals/e0/b2/b6/e0b2b6641cd624a69664d51a09e7f0bc.jpg")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>

      {/* Mobile Video Background */}
      <div className="md:hidden absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content - add top padding to account for fixed header */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4 pt-[140px]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-6 tracking-wide">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-light">
            {t('hero.subtitle')}
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleDiscoverCollection}
              className="bg-white text-black px-8 py-4 font-medium text-sm tracking-wide hover:bg-gray-100 transition-colors duration-300 min-w-[240px]"
            >
              {t('heroButtons:discoverCollection')}
            </button>
            <button
              onClick={handleBookAppointment}
              className="border border-white text-white px-8 py-4 font-medium text-sm tracking-wide hover:bg-white hover:text-black transition-colors duration-300 min-w-[240px]"
            >
              {t('heroButtons:bookAppointment')}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={scrollToNextSection}
          className="flex flex-col items-center space-y-2 text-white/80 hover:text-white transition-colors cursor-pointer group"
        >
          <span className="text-sm font-light tracking-wide">Voir les détails</span>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-px h-8 bg-white/30 group-hover:bg-white/50 transition-colors"></div>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
