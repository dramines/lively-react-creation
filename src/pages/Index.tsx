
import { useState, useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import AboutSection from "../components/AboutSection";
import FeaturesSection from "../components/FeaturesSection";
import FAQ from "../components/FAQ";
import ReviewSection from "../components/ReviewSection";
import ProjectGallery from "../components/ProjectGallery";
import { WelcomeDialog } from "../components/WelcomeDialog";
import { cn } from "@/lib/utils";

const Index = () => {
  const [cartCount, setCartCount] = useState(0);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionId = section.getAttribute('data-section');
        
        if (sectionTop < window.innerHeight * 0.75 && sectionId) {
          setVisibleSections((prev) => 
            prev.includes(sectionId) ? prev : [...prev, sectionId]
          );
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isVisible = (sectionId: string) => visibleSections.includes(sectionId);

  return (
    <>
      <WelcomeDialog />
      <HeroSection />

    

      {/* About Section */}
      <section data-section="about">
        <div className={cn(
          "transition-all duration-1000 transform",
          isVisible("about") 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        )}>
          <AboutSection />
        </div>
      </section>

      {/* Features Section */}
      <section data-section="features">
        <div className={cn(
          "transition-all duration-1000 transform",
          isVisible("features") 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        )}>
          <FeaturesSection />
        </div>
      </section>

      {/* Reviews Section */}
      <section data-section="reviews">
        <div className={cn(
          "transition-all duration-1000 transform",
          isVisible("reviews") 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        )}>
          <ReviewSection />
        </div>
      </section>

      {/* Project Gallery */}
      <section data-section="gallery">
        <div className={cn(
          "transition-all duration-1000 transform",
          isVisible("gallery") 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        )}>
          <ProjectGallery />
        </div>
      </section>

      {/* FAQ Section */}
      <section data-section="faq">
        <div className={cn(
          "transition-all duration-1000 transform",
          isVisible("faq") 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        )}>
          <FAQ />
        </div>
      </section>
    </>
  );
};

export default Index;
