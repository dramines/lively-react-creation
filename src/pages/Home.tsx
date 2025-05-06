import { useState, useEffect, useRef } from 'react';
import { Clock, Users, ChefHat, Award, Globe, Factory } from 'lucide-react';
import { STATISTICS, FEATURED_RECIPES } from '../config/data';
import Recipe from './Recipe';
import DatesBenefits from '../components/DatesBenefits';
import WhyChooseUs from '../components/WhyChooseUs';
import MadeInTunisia from '../components/products/MadeInTunisia';
import { useApp } from '../context/AppContext';
import type { ClientType } from '../types';
import VideoSection from '../components/VideoSection';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../hooks/use-mobile';

interface HomeProps {
  clientType: ClientType | null;
}

const Home = ({ clientType }: HomeProps) => {
  const { t, i18n } = useTranslation();
  const { clientType: contextClientType } = useApp();
  const effectiveClientType = clientType || contextClientType;
  const isB2C = effectiveClientType === 'B2C';
  const isMobile = useIsMobile();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statistics, setStatistics] = useState(STATISTICS.map(stat => ({ ...stat, current: 0 })));
  const statsRef = useRef<HTMLDivElement>(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const recipesRef = useRef<HTMLDivElement>(null);
  const [isRecipesVisible, setIsRecipesVisible] = useState(false);
  const progressInterval = useRef<number | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const carouselInterval = useRef<NodeJS.Timeout | null>(null);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const isEnglish = i18n.language === 'en';

  const heroImages = [
    { 
      desktop: isEnglish ? '3en.png' : '3.png',
      mobile: isEnglish ? '3en.png' : '3.png',
    },
    { 
      desktop: isEnglish ? '2en.png' : '2.jpg',
      mobile: isEnglish ? '2en.png' : '2.jpg',
    },
    { 
      desktop: isEnglish ? '1en.png' : '1.png',
      mobile: isEnglish ? '1en.png' : '1.png',
    },
  ];

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setImagesPreloaded(false);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const preloadImages = async () => {
      try {
        const imagePromises = heroImages.flatMap(item => {
          const desktopImg = new Image();
          desktopImg.src = item.desktop;
          
          const mobileImg = new Image();
          mobileImg.src = item.mobile;
          
          return [
            new Promise((resolve, reject) => {
              desktopImg.onload = resolve;
              desktopImg.onerror = reject;
            }),
            new Promise((resolve, reject) => {
              mobileImg.onload = resolve;
              mobileImg.onerror = reject;
            })
          ];
        });
        
        await Promise.all(imagePromises);
        setImagesPreloaded(true);
      } catch (error) {
        console.error('Failed to preload images:', error);
        setImagesPreloaded(true);
      }
    };
    
    preloadImages();
  }, [heroImages]);

  useEffect(() => {
    if (!imagesPreloaded) return;
    
    const startCarousel = () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
  
      setProgress(0);
      
      const startTime = Date.now();
      const duration = 5000;
      
      progressInterval.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);
      }, 16);
      
      carouselInterval.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 5000);
    };

    startCarousel();
    
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (carouselInterval.current) clearTimeout(carouselInterval.current);
    };
  }, [currentSlide, heroImages.length, imagesPreloaded]);

  useEffect(() => {
    if (isStatsVisible) {
      const filteredStats = statistics.filter(stat => 
        stat.label === "Revendeur" || stat.label === "Producteur/Partenaire Affiliés"
      );
      
      filteredStats.forEach((stat, index) => {
        const steps = 50;
        const increment = stat.value / steps;
        let current = 0;
        
        const interval = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            current = stat.value;
            clearInterval(interval);
          }
          
          setStatistics(prev => 
            prev.map((s) => 
              s.label === stat.label ? { ...s, current: Math.floor(current) } : s
            )
          );
        }, 40);

        return () => clearInterval(interval);
      });
    }
  }, [isStatsVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRecipesVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (recipesRef.current) {
      observer.observe(recipesRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (selectedRecipe) {
    return <Recipe recipeId={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  return (
    <main className="flex-grow">
      <section className={`relative ${isMobile ? 'h-screen' : 'h-[calc(100vh-80px)]'}`}>
        <div className="relative w-full h-full overflow-hidden">
          {heroImages.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                currentSlide === index ? 'opacity-100 z-30' : 'opacity-0 z-10'
              }`}
              aria-hidden={currentSlide !== index}
            >
              <img
                src={isMobile ? item.mobile : item.desktop}
                alt={`Slider image ${index + 1}`}
                className={`w-full h-full ${isMobile ? 'object-cover' : 'object-contain mt-[5%]'}`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 " />
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center z-50">
          <div className="flex items-center space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (carouselInterval.current) clearTimeout(carouselInterval.current);
                  if (progressInterval.current) clearInterval(progressInterval.current);
                  
                  setCurrentSlide(index);
                }}
                className={`relative h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-12 bg-white' : 'w-3 bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {currentSlide === index && (
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#96cc39] to-[#96cc39]"
                    style={{
                      width: `${progress}%`,
                      transition: 'width 16ms linear'
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-[40%] relative group w-full flex justify-center lg:block">
              <div className="relative w-full flex justify-center lg:justify-end">
                <div className="overflow-hidden transform group-hover:scale-[1.1] transition duration-500 w-[75%] lg:w-[90%] flex justify-center">
                  <img
                    src="AboutImage.png"
                    alt="About Us"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="absolute -bottom-6 right-0 lg:-right-6 bg-white p-4 rounded-lg shadow-xl">
                  <img
                    src="https://i.ibb.co/KxkCnFLR/logo-tazart-page-0001-removebg-preview.png"
                    alt="Company Logo"
                    className="w-20 h-20 object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="lg:w-[60%] space-y-8">
              <div>
                <h4 className="text-[#96cc39] font-medium mb-2">{t('about.our_story_title')}</h4>
                <h2 className="text-4xl font-playfair font-bold mb-6 text-gray-900">
                  {t('about.excellence_of_products')}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#96cc39] to-[#64381b] rounded-full mb-6" />
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('about.history_text_1')}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.history_text_2')}
                </p>
              </div>

              <div
                ref={statsRef}
                className={`grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 w-full ${isMobile ? 'gap-8' : ''}`}
              >
                {statistics
                  .filter(
                    (stat) =>
                      stat.label === "Revendeur" ||
                      stat.label === "Producteur/Partenaire Affiliés"
                  )
                  .map((stat, index) => (
                    <div key={index} className="text-center group flex flex-col items-center">
                      <div
                        className={`flex flex-col items-center ${
                          stat.label === "Producteur/Partenaire Affiliés" ? "ml-[-70%]" : "ml-[60%]"
                        }`}
                      >
                        {stat.label === "Revendeur" && (
                          <Globe className="w-7 h-7 md:w-6 md:h-6 text-[#96cc39] group-hover:scale-110 transition-transform" />
                        )}
                        {stat.label === "Producteur/Partenaire Affiliés" && (
                          <Factory className="w-7 h-7 md:w-6 md:h-6 text-[#96cc39] group-hover:scale-110 transition-transform" />
                        )}
                        <div className="text-[22px] md:text-2xl font-bold text-[#64381b]">
                          {Math.floor(stat.current)}
                          {stat.suffix}
                        </div>
                        <div className="text-[12px] md:text-xs text-gray-500">
                          {stat.label === "Revendeur" ? t('about.resellers') : t('about.affiliated_producers')}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          <MadeInTunisia />
          <VideoSection />
        </div>
      </section>

      {isB2C ? (
        <>
          <section ref={recipesRef} className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h4 className="text-[#96cc39] font-medium mb-2">{t('recipes.culinary_delights')}</h4>
                <h2 className="text-4xl font-playfair font-bold mb-6 text-gray-900">
                  {t('recipes.our')} <span className="text-[#64381b]">{t('recipes.recipes')}</span> {t('recipes.gourmet')}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#96cc39] to-[#64381b] rounded-full mx-auto mb-6" />
                <p className="text-gray-600">
                  {t('recipes.discover_our_selection')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {FEATURED_RECIPES.map((recipe, index) => {
                  const translationKey = recipe.id.replace(/-/g, '_');
                  const translatedTitle = t(`recipes.${translationKey}.title`, recipe.title);
                  const translatedDescription = t(`recipes.${translationKey}.description`, recipe.description);
                  const translatedDifficulty = t(`recipes.${translationKey}.difficulty`, recipe.difficulty);
                  
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedRecipe(recipe.id)}
                      className={`group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-700 hover:-translate-y-2 cursor-pointer ${
                        isRecipesVisible 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-20'
                      }`}
                      style={{
                        transitionDelay: `${index * 200}ms`
                      }}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={recipe.image}
                          alt={translatedTitle}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-playfair font-bold mb-3 text-gray-900 group-hover:text-[#96cc39] transition-colors duration-300">
                          {translatedTitle}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {translatedDescription}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4 mt-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-[#96cc39]" />
                            <span>{recipe.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-[#96cc39]" />
                            <span>{recipe.servings} pers.</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ChefHat className="w-4 h-4 text-[#96cc39]" />
                            <span>{translatedDifficulty}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
          <DatesBenefits />
        </>
      ) : (
        <WhyChooseUs />
      )}
    </main>
  );
};

export default Home;