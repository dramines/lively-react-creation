
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect, useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

const WorldOfLuxurySection = () => {
  const { t } = useTranslation();
  const plugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  const luxuryItems = [
    {
      id: 1,
      category: t('worldOfLuxury.privateSalon'),
      title: t('worldOfLuxury.exclusiveConsultation'),
      buttonText: t('worldOfLuxury.shopNow'),
      image: "/lovable-uploads/fce652f0-3556-4baa-a363-2feb781600d6.png"
    },
    {
      id: 2,
      category: t('worldOfLuxury.ceremonialElegance'),
      title: t('worldOfLuxury.weddingCollection'),
      buttonText: t('worldOfLuxury.shopWedding'),
      image: "/lovable-uploads/49627e2d-81f4-410f-82e9-b2c89dfb56a7.png"
    },
    {
      id: 3,
      category: t('worldOfLuxury.eveningWear'),
      title: t('worldOfLuxury.formalCollection'),
      buttonText: t('worldOfLuxury.shopFormal'),
      image: "/lovable-uploads/1f13be60-8b8e-4827-9e4b-b21cdac42202.png"
    },
    {
      id: 4,
      category: t('worldOfLuxury.businessLuxury'),
      title: t('worldOfLuxury.executiveStyle'),
      buttonText: t('worldOfLuxury.shopBusiness'),
      image: "/lovable-uploads/ca573090-c5ef-410f-a313-43f6e02b00a9.png"
    },
    {
      id: 5,
      category: t('worldOfLuxury.parisianElegance'),
      title: t('worldOfLuxury.parisCollection'),
      buttonText: t('worldOfLuxury.shopParis'),
      image: "/lovable-uploads/2008aa00-2104-4ae9-8eae-ee95dd9b567d.png"
    },
    {
      id: 6,
      category: t('worldOfLuxury.summerSophistication'),
      title: t('worldOfLuxury.summerLuxury'),
      buttonText: t('worldOfLuxury.shopSummer'),
      image: "/lovable-uploads/7c0f50c7-683c-4aa1-a86d-44f41830b62b.png"
    },
    {
      id: 7,
      category: t('worldOfLuxury.heritageStyle'),
      title: t('worldOfLuxury.timelessElegance'),
      buttonText: t('worldOfLuxury.shopHeritage'),
      image: "/lovable-uploads/aa22babe-eb13-4da1-91e3-72a190bc5d6f.png"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-wide text-black">
          {t('worldOfLuxury.title')}
        </h2>
        <p className="text-lg text-gray-600 font-light">
          {t('worldOfLuxury.subtitle')}
        </p>
      </div>

      {/* Gallery Carousel */}
      <div className="max-w-7xl mx-auto relative">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {luxuryItems.map((item) => (
              <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full md:basis-1/3">
                <div className="relative group overflow-hidden bg-gray-100">
                  {/* Image with increased height */}
                  <div className="aspect-[3/4] md:aspect-[4/6] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium tracking-wider uppercase mb-2 opacity-90">
                          {item.category}
                        </p>
                        <h3 className="text-3xl md:text-4xl font-serif font-light mb-6 tracking-wide">
                          {item.title}
                        </h3>
                        <Button
                          className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-6 py-2 text-sm font-medium transition-all duration-300 w-fit opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                          style={{ transitionDelay: '100ms' }}
                        >
                          {item.buttonText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Arrows positioned on sides */}
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 border border-gray-300 bg-white/80 hover:bg-white" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 border border-gray-300 bg-white/80 hover:bg-white" />
        </Carousel>
      </div>
    </section>
  );
};

export default WorldOfLuxurySection;
