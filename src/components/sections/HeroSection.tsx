
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const { t } = useTranslation();

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
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

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-6 tracking-wide">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-light">
            {t('hero.subtitle')}
          </p>
          
          <p className="text-lg md:text-xl text-white/80 mb-12 font-medium">
            {t('hero.discount')}
          </p>

          {/* CTA button */}
          <Button
            size="lg"
            className="bg-white text-slate-800 hover:bg-slate-100 px-12 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t('hero.seeDetails')}
          </Button>
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
