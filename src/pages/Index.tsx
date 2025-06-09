
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ValuesSection from '@/components/ValuesSection';
import VideoGallery from '@/components/VideoGallery';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import AboutUsSection from '@/components/AboutUsSection';
import LoadingScreen from '@/components/LoadingScreen';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Index = () => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const valuesAnimation = useScrollAnimation({ threshold: 0.2 });
  const aboutAnimation = useScrollAnimation({ threshold: 0.2 });
  const videoAnimation = useScrollAnimation({ threshold: 0.2 });

  const handlePersonalizeClick = () => {
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    window.scrollTo(0, 0);
    navigate('/children');
  };

  if (showLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen relative font-baloo">
      <Header />
      
      {/* Entire page with unified background gradient */}
      <div className="bg-gradient-to-br from-pastel-blue via-powder-pink to-pastel-lavender">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-end justify-center px-4 py-8 md:py-16 lg:py-24 overflow-hidden">
          {/* Background Image for Desktop */}
          <div className="absolute inset-0 hidden md:block">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/bg.png')`
              }}
            />
          </div>

          {/* Background Image for Mobile */}
          <div className="absolute inset-0 md:hidden">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/bg.png')`
              }}
            />
          </div>

          <div className="container mx-auto max-w-4xl text-center relative z-10 mt-20">
            {/* Enhanced Main CTA Button - Positioned further down with transparency */}
            <div className="mb-[55%] md:mb-10 lg:mb-6 relative px-2 sm:px-4">
              <Button
                onClick={handlePersonalizeClick}
                className="bg-white/60 hover:bg-white text-slate-700 px-8 sm:px-12 md:px-14 lg:px-16 py-6 sm:py-7 md:py-8 lg:py-10 text-base sm:text-lg md:text-xl font-semibold rounded-xl shadow-2xl border-2 border-sweet-mint/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:border-pastel-lavender font-baloo w-full sm:w-auto backdrop-blur-sm transform hover:rotate-1 group"
              >
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold flex items-center justify-center">
                  Je commence mon aventure 
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    ➔
                  </span>
                </span>
              </Button>
            </div>
          </div>
        </section>

        {/* Values Section with slower fade-in animation */}
        <div 
          ref={valuesAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-[1000ms] ease-out ${
            valuesAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}
        >
          <ValuesSection />
        </div>

        {/* About Us Section with slower fade-in animation */}
        <div 
          ref={aboutAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-[1500ms] ease-out delay-100 ${
            aboutAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}
        >
          <AboutUsSection />
        </div>

        {/* Video Gallery Section with slower fade-in animation */}
        <div 
          ref={videoAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-[1500ms] ease-out delay-100 ${
            videoAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}
        >
          <VideoGallery />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default Index;
