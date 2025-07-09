import React, { useState, useEffect } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const desktopSlides = [
    {
      image: "/lovable-uploads/324b174c-6372-4e92-9931-65a247b47214.png",
      title: "Spada Di Battaglia", 
      subtitle: "L'Arte del Vestire Maschile"
    },
    {
      image: "/lovable-uploads/b8825b34-7d55-4c15-942f-5d11aae2c918.png",
      title: "Élégance Italienne",
      subtitle: "Tradition et Savoir-faire"
    },
    {
      image: "/lovable-uploads/c8052d1f-5645-436b-9534-904b6580967d.png",
      title: "Sur Mesure",
      subtitle: "Créations Exclusives"
    }
  ];

  const mobileSlides = [
    {
      image: "/lovable-uploads/4bb7f95f-199f-4e9d-9185-ed5ecba930ca.png",
      title: "Spada Di Battiglia",
      subtitle: "L'Arte del Vestire Maschile"
    },
    {
      image: "/lovable-uploads/57acb1fc-36f2-46a8-aab5-fccfb86289f8.png",
      title: "Élégance Italienne",
      subtitle: "Tradition et Savoir-faire"
    },
    {
      image: "/lovable-uploads/b86cc73e-55a8-4075-a3fb-77722a2d36e7.png",
      title: "Sur Mesure",
      subtitle: "Créations Exclusives"
    }
  ];

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % desktopSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [desktopSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Add Montserrat fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <section className="relative h-[98vh] md:h-[70vh] overflow-hidden bg-gray-900 md:mt-0 -mt-[64px] pt-[64px] md:pt-0">
        {/* Desktop Background Images */}
        <div className="absolute inset-0 hidden md:block">
          {desktopSlides.map((slide, index) => (
            <div
              key={`desktop-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          ))}
        </div>

        {/* Mobile Background Images */}
        <div className="absolute inset-0 block md:hidden">
          {mobileSlides.map((slide, index) => (
            <div
              key={`mobile-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          ))}
        </div>

        {/* Content - positioned on the left center, moved down by 5% */}
        <div className="relative z-10 h-full flex items-center" style={{ paddingTop: '5vh' }}>
          <div className="text-left text-white max-w-2xl px-8 md:px-16 lg:px-24">
            <h1 className="font-montserrat text-4xl md:text-6xl lg:text-7xl font-light mb-4 tracking-wide leading-tight">
              {desktopSlides[currentSlide].title}
            </h1>

            <h2 className="font-montserrat text-lg md:text-xl lg:text-2xl font-light mb-6 tracking-wider opacity-90">
              {desktopSlides[currentSlide].subtitle}
            </h2>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-[8%] md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {desktopSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white bg-opacity-80"
                    : "bg-white bg-opacity-40 hover:bg-opacity-60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
