
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const getSlides = () => {
    // Use language-specific images based on current language
    const isEnglish = currentLanguage === 'en';
    
    return [
      {
        image: isEnglish ? '/lovable-uploads/1en.png' : '/lovable-uploads/1.png',
        title: isEnglish ? "Professional\nElegance" : "L'Élégance\nProfessionnelle",
        subtitle: isEnglish ? "Discover our exclusive collection of professional attire" : "Découvrez notre collection exclusive de tenues professionnelles"
      },
      {
        image: isEnglish ? '/lovable-uploads/2en.png' : '/lovable-uploads/2.png',
        title: isEnglish ? "Style &\nRefinement" : "Style &\nRaffinement",
        subtitle: isEnglish ? "A collection combining comfort and elegance" : "Une collection qui allie confort et élégance"
      },
      {
        image: isEnglish ? '/lovable-uploads/3en.png' : '/lovable-uploads/3.png',
        title: isEnglish ? "Artisanal\nExcellence" : "Excellence\nArtisanale",
        subtitle: isEnglish ? "Unique pieces created with passion" : "Des pièces uniques créées avec passion"
      }
    ];
  };

  const slides = getSlides();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Reset slide to ensure smooth transition
      setCurrentSlide(0);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-[56vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url("${slide.image}")`,
          }}
        />
      ))}
      
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[56vh] items-center justify-center px-4">
        <div className="text-center text-white">
          <h1 className="animate-fade-in font-sans text-4xl font-bold leading-tight md:text-6xl whitespace-pre-line mb-6">
            {slides[currentSlide].title}
          </h1>
          <p className="mt-4 animate-fade-in-delayed font-body text-lg md:text-xl mb-8">
            {slides[currentSlide].subtitle}
          </p>
          <a
            href="#products"
            className="group inline-block animate-fade-in-delayed rounded-full bg-white px-8 py-3 font-sans font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg"
          >
            {i18n.language === 'en' ? 'Explore Collection' : 'Explorer la Collection'}
          </a>

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
