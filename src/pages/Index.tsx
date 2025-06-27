
import { useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import SophisticatedSportswearSection from "@/components/sections/SophisticatedSportswearSection";
import WimbledonSection from "@/components/sections/WimbledonSection";
import WorldOfLuxurySection from "@/components/sections/WorldOfLuxurySection";
import { trackVisitor } from "@/utils/visitorTracking";

const Index = () => {
  useEffect(() => {
    // Track visitor to home page
    trackVisitor('Home');
  }, []);

  return (
    <Layout>
      <HeroSection />
      <FeaturedProducts />
      <SophisticatedSportswearSection />
      <WimbledonSection />
      <WorldOfLuxurySection />
    </Layout>
  );
};

export default Index;
