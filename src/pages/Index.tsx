
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CustomScrollbar } from '@/components/ui/custom-scrollbar';
import Header from '@/components/Header';
import ValuesSection from '@/components/ValuesSection';
import VideoGallery from '@/components/VideoGallery';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import AboutUsSection from '@/components/AboutUsSection';
import LoadingScreen from '@/components/LoadingScreen';
import { useEnhancedScrollAnimation } from '@/hooks/useEnhancedScrollAnimation';

const Index = () => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  
  // Enhanced animations with staggered timing - optimized delays
  const valuesAnimation = useEnhancedScrollAnimation({ 
    threshold: 0.2, 
    delay: 100,
    staggerDelay: 0
  });
  const aboutAnimation = useEnhancedScrollAnimation({ 
    threshold: 0.2, 
    delay: 50,
    staggerDelay: 200
  });
  const videoAnimation = useEnhancedScrollAnimation({ 
    threshold: 0.2, 
    delay: 100,
    staggerDelay: 400
  });

  const handlePersonalizeClick = useCallback(() => {
    setShowLoading(true);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
    window.scrollTo(0, 0);
    navigate('/children');
  }, [navigate]);

  if (showLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <CustomScrollbar className="min-h-screen">
      <div className="min-h-screen relative font-baloo">
        <Header />
        
        {/* Entire page with unified background gradient - optimized for performance */}
        <div className="bg-gradient-to-br from-pastel-blue via-powder-pink to-pastel-lavender will-change-scroll">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-end justify-center px-4 py-8 md:py-16 lg:py-24 overflow-hidden">
            {/* Background Image for Desktop - optimized loading */}
            <div className="absolute inset-0 hidden md:block">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat will-change-transform"
                style={{
                  backgroundImage: `url('/bg.png')`,
                  transform: 'translateZ(0)' // Force hardware acceleration
                }}
              />
            </div>

            {/* Background Image for Mobile - optimized loading */}
            <div className="absolute inset-0 md:hidden">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat will-change-transform"
                style={{
                  backgroundImage: `url('/bg.png')`,
                  transform: 'translateZ(0)' // Force hardware acceleration
                }}
              />
            </div>

            <div className="container mx-auto max-w-4xl text-center relative z-10 mt-20">
              {/* Enhanced Main CTA Button - optimized animations */}
              <div className="mb-[55%] md:mb-10 lg:mb-6 relative px-2 sm:px-4">
                <Button
                  onClick={handlePersonalizeClick}
                  className="bg-white/60 hover:bg-white text-slate-700 px-8 sm:px-12 md:px-14 lg:px-16 py-6 sm:py-7 md:py-8 lg:py-10 text-base sm:text-lg md:text-xl font-semibold rounded-xl shadow-2xl border-2 border-sweet-mint/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-pastel-lavender font-baloo w-full sm:w-auto backdrop-blur-sm transform group will-change-transform"
                >
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold flex items-center justify-center">
                    Je commence mon aventure 
                    <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                      ➔
                    </span>
                  </span>
                </Button>
              </div>
            </div>
          </section>

          {/* Values Section with enhanced fade-in animation - optimized timing */}
          <div 
            ref={valuesAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ease-out ${
              valuesAnimation.isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-98'
            }`}
            style={{ willChange: 'transform, opacity' }}
          >
            <ValuesSection />
          </div>

          {/* About Us Section with enhanced fade-in animation - optimized timing */}
          <div 
            ref={aboutAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-800 ease-out ${
              aboutAnimation.isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-12 scale-98'
            }`}
            style={{ willChange: 'transform, opacity' }}
          >
            <AboutUsSection />
          </div>

          {/* Video Gallery Section with enhanced fade-in animation - optimized timing */}
          <div 
            ref={videoAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-900 ease-out ${
              videoAnimation.isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-16 scale-98'
            }`}
            style={{ willChange: 'transform, opacity' }}
          >
            <VideoGallery />
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* WhatsApp Button */}
        <WhatsAppButton />
      </div>
    </CustomScrollbar>
  );
};

export default Index;
