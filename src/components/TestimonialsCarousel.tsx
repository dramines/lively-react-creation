
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophie M.",
    text: "Mon fils de 6 ans est absolument ravi de son livre ! Il se reconnaît dans l'histoire et la redemande chaque soir. La qualité est exceptionnelle, les illustrations magnifiques. Un cadeau qui restera gravé dans sa mémoire.",
    rating: 5,
    location: "Paris"
  },
  {
    id: 2,
    name: "Thomas L.",
    text: "Service client fantastique et livraison rapide ! Ma fille adore son livre personnalisé. Elle se sent vraiment comme une princesse dans son histoire. Je recommande vivement My Little Hero !",
    rating: 5,
    location: "Lyon"
  },
  {
    id: 3,
    name: "Marie D.",
    text: "Quelle belle surprise pour l'anniversaire de mon neveu ! Le livre est de très haute qualité, l'histoire captivante et les détails personnalisés parfaits. Il n'arrête pas de le relire !",
    rating: 5,
    location: "Marseille"
  },
  {
    id: 4,
    name: "Julie R.",
    text: "J'ai commandé pour mes deux enfants et ils sont enchantés ! Les histoires sont différentes et adaptées à chaque personnalité. Bravo pour cette belle initiative qui fait rêver nos petits.",
    rating: 5,
    location: "Toulouse"
  },
  {
    id: 5,
    name: "Pierre B.",
    text: "Un concept génial ! Mon fils se voit comme un vrai héros dans son livre. La personnalisation est bluffante et la qualité d'impression excellente. Parfait pour développer l'amour de la lecture !",
    rating: 5,
    location: "Nantes"
  },
  {
    id: 6,
    name: "Camille T.",
    text: "Service irréprochable du début à la fin. Le livre est arrivé rapidement et dans un emballage soigné. Ma fille de 4 ans est émerveillée par son histoire personnalisée. Merci !",
    rating: 5,
    location: "Strasbourg"
  }
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const nextTestimonial = () => {
    setIsAutoScrolling(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const prevTestimonial = () => {
    setIsAutoScrolling(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const goToTestimonial = (index: number) => {
    setIsAutoScrolling(false);
    setCurrentIndex(index);
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="bg-gradient-to-r from-pastel-lavender via-powder-pink to-light-coral py-2 md:py-3">
      <div className="container mx-auto px-4">
        <div 
          className="max-w-2xl mx-auto relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-cream-beige rounded-lg md:rounded-xl p-2 md:p-3 shadow-md transition-all duration-500 hover:shadow-lg transform hover:scale-105">
            {/* Stars */}
            <div className="flex justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 text-pale-yellow fill-current transition-all duration-300 hover:scale-110"
                />
              ))}
            </div>

            {/* Testimonial Text with fade transition */}
            <blockquote 
              key={currentIndex}
              className="text-slate-700 text-xs md:text-sm text-center leading-relaxed mb-1 md:mb-2 italic line-clamp-2 animate-fade-in"
            >
              "{currentTestimonial.text}"
            </blockquote>

            {/* Author with slide transition */}
            <div 
              key={`author-${currentIndex}`}
              className="text-center animate-fade-in"
            >
              <p className="font-semibold text-slate-800 text-xs md:text-sm">
                {currentTestimonial.name}
              </p>
              <p className="text-slate-500 text-xs">
                {currentTestimonial.location}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={prevTestimonial}
            variant="outline"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-cream-beige hover:bg-pastel-blue border-2 border-cream-beige shadow-md rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <ChevronLeft className="w-3 h-3 text-slate-600" />
          </Button>

          <Button
            onClick={nextTestimonial}
            variant="outline"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-cream-beige hover:bg-pastel-blue border-2 border-cream-beige shadow-md rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <ChevronRight className="w-3 h-3 text-slate-600" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-1 mt-1 md:mt-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-1 h-1 rounded-full transition-all duration-500 hover:scale-150 ${
                index === currentIndex 
                  ? 'bg-slate-700 scale-125 shadow-md' 
                  : 'bg-slate-400 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
