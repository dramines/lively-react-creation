
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";
import { useRef, useEffect } from 'react';
import { partners } from '../../config/partners';

interface PartnersSectionProps {
  onNavigateToRevendeurs: (e: React.MouseEvent) => void;
}

const PartnersSection = ({ onNavigateToRevendeurs }: PartnersSectionProps) => {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect with improved animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let animationFrameId: number;
    let scrollAmount = 0;
    let scrollDirection = 1;
    const scrollSpeed = 0.7; // Slower, smoother scrolling
    
    const startAutoScroll = () => {
      clearInterval(interval);
      
      interval = setInterval(() => {
        if (carouselRef.current) {
          const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
          
          // Reverse direction when reaching the end or beginning with a small buffer
          if (scrollAmount >= maxScroll - 5) {
            scrollDirection = -1;
          } else if (scrollAmount <= 5) {
            scrollDirection = 1;
          }
          
          scrollAmount += scrollSpeed * scrollDirection;
          
          animationFrameId = requestAnimationFrame(() => {
            if (carouselRef.current) {
              carouselRef.current.scrollLeft = scrollAmount;
            }
          });
        }
      }, 16); // 60fps for smoother animation
    };
    
    // Add a small delay before starting to allow the component to fully render
    const initTimeout = setTimeout(() => {
      startAutoScroll();
    }, 1000);
    
    return () => {
      clearTimeout(initTimeout);
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="py-16 mt-16 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-[#700100] mb-4">
            <Building2 className="w-6 h-6" />
            <h2 className="text-3xl font-playfair">{t('resellers.our_distribution_partners')}</h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#700100] to-[#96cc39] mx-auto mb-8 rounded-full"></div>
          
          {/* Partners carousel with enhanced styling - Only logos */}
          <div className="mb-12 overflow-hidden relative group">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent ref={carouselRef}>
                {partners.map((partner) => (
                  <CarouselItem key={partner.id} className="md:basis-1/4 lg:basis-1/5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)" }}
                      className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 relative overflow-hidden border border-gray-100 hover:shadow-lg hover:border-[#96cc39]/30 h-[150px] mx-2 flex items-center justify-center"
                    >                      
                      <div className="flex items-center justify-center relative z-10">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className={`object-contain transition-all duration-300 group-hover:scale-105 ${
                            partner.id === 'carrefour' || partner.id === 'geant' 
                              ? 'h-[13.8rem] w-auto' 
                              : 'h-[13.8rem] w-auto'
                          }`}
                          style={{
                            transform: 'scale(1.15)' // 15% larger
                          }}
                        />
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-100 hover:text-gray-800" />
              <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-100 hover:text-gray-800" />
            </Carousel>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PartnersSection;