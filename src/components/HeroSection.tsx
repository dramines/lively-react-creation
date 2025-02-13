import { useEffect, useState } from 'react';
import { ArrowDown, Instagram, Facebook, Linkedin } from 'lucide-react';

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const colors = ['#A7C6ED', '#C1A7F5', '#F5E56B', '#333333'];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-out"
        style={{
          backgroundImage: 'url("/mainbg.png")', // Adjust the file extension if needed
        }}
        
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[90vh] items-center justify-center px-4">
        <div className="text-center text-white">
          <h1 className="animate-fade-in font-sans text-5xl font-bold leading-tight md:text-7xl">
            L'Élégance<br />
            Professionnelle
          </h1>
          <p className="mt-6 animate-fade-in-delayed font-body text-xl md:text-2xl">
            Découvrez notre collection exclusive de tenues professionnelles
          </p>
          <a
            href="#products"
            className="group mt-8 inline-block animate-fade-in-delayed rounded-full bg-white px-8 py-4 font-sans font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg"
          >
            Explorer la Collection
          </a>
          
          {/* Scroll Down Arrow */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};