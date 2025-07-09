
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PromotionBanner from '@/components/PromotionBanner';
import ProductFilters from '@/components/ProductFilters';
import ProductGrid from '@/components/ProductGrid';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SocialSidebar from '@/components/SocialSidebar';

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-montserrat">
      <Header />
      <main>
        <Hero />
        <PromotionBanner />
        <ProductFilters />
        <ProductGrid />
        <Newsletter />
      </main>
      <Footer />
      <ScrollToTop />
      <SocialSidebar />
    </div>
  );
};

export default Index;
