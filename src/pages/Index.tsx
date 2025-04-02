
import { useState, useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import AboutSection from "../components/AboutSection";
import FeaturesSection from "../components/FeaturesSection";
import FAQ from "../components/FAQ";
import ReviewSection from "../components/ReviewSection";
import ProjectGallery from "../components/ProjectGallery";
import { WelcomeDialog } from "../components/WelcomeDialog";
import LoadingScreen from "../components/LoadingScreen";
import { AnimatePresence } from "framer-motion";

const Index = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (minimum 2 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <main className="min-h-screen">
        <WelcomeDialog />
        
        {/* Hero Section with improved height */}
        <HeroSection />
        
        {/* About Section */}
        <AboutSection />

        {/* Features Section with gradient background */}
        <div className="bg-gradient-to-b from-white to-gray-50">
          <FeaturesSection />
        </div>

        {/* Project Gallery with improved spacing */}
        <div className="py-20">
          <ProjectGallery />
        </div>

        {/* Reviews Section with background */}
        <div className="bg-gray-50">
          <ReviewSection />
        </div>

        {/* FAQ Section with improved spacing */}
        <div className="py-20 bg-white">
          <FAQ />
        </div>
      </main>
    </>
  );
};

export default Index;
