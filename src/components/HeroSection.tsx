
import { useEffect, useState } from 'react';

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const slides = [
    {
      image: '/lovable-uploads/1.png',
      title: "L'Élégance\nProfessionnelle",
      subtitle: "Découvrez notre collection exclusive de tenues professionnelles"
    },
    {
      image: '/lovable-uploads/2.png',
      title: "Style &\nRaffinement",
      subtitle: "Une collection qui allie confort et élégance"
    },
    {
      image: '/lovable-uploads/3.png',
      title: "Excellence\nArtisanale",
      subtitle: "Des pièces uniques créées avec passion"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
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
            Explorer la Collection
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
