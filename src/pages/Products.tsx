
import { useState, useEffect } from 'react';
import ProductDetail from './ProductDetail';
import {
  ProductsHero,
  ProductsGrid,
  MadeInTunisia,
  ProductTestimonials,
  PartnersSection
} from '../components/products';
import { PRODUCTS } from '../config/products';
import { useIsMobile } from '../hooks/use-mobile';
import { Product } from '../types/product';

interface ProductsProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedProductId?: string;
}

const Products = ({ selectedCategory, selectedSubcategory, selectedProductId }: ProductsProps) => {
  const [selectedProductIdState, setSelectedProductId] = useState<string | null>(selectedProductId || null);
  const isMobile = useIsMobile();

  // Use products from the config
  const products = PRODUCTS;

  useEffect(() => {
    // Update the selected product ID when props change
    if (selectedProductId) {
      setSelectedProductId(selectedProductId);
    }
  }, [selectedProductId]);

  // Filter products based on multiple criteria
  let filteredProducts = products;
  
  // If a specific product ID is provided, filter to only that product
  if (selectedProductId) {
    filteredProducts = products.filter(product => product.id === selectedProductId);
  }
  // Otherwise, filter by category/subcategory
  else if (selectedCategory && selectedCategory !== 'tous') {
    // Handle comma-separated categories
    if (selectedCategory.includes(',')) {
      const categoryArray = selectedCategory.split(',');
      filteredProducts = products.filter(product => 
        categoryArray.some(cat => product.category === cat)
      );
    } else {
      filteredProducts = products.filter(product => product.category === selectedCategory);
    }

    // Further filter by subcategory if provided
    if (selectedSubcategory) {
      filteredProducts = filteredProducts.filter(product => 
        product.subcategory === selectedSubcategory
      );
    }
  }

  // Output some debug information to help troubleshoot
  console.log('Products filtering info:', { 
    selectedCategory,
    selectedSubcategory,
    selectedProductId,
    filteredCount: filteredProducts.length,
    isMobile,
    allProducts: products.length
  });

  // Handle navigation to the Revendeurs page
  const handleNavigateToRevendeurs = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.dispatchEvent) {
      const customEvent = new CustomEvent('navigateTo', { detail: { page: 'resellers' } });
      window.dispatchEvent(customEvent);
    }
  };

  if (selectedProductIdState) {
    return (
      <ProductDetail 
        productId={selectedProductIdState}
        onBack={() => setSelectedProductId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <ProductsHero />
      
      <div className="container mx-auto px-4">
        <ProductsGrid 
          products={filteredProducts as Product[]} 
          onSelectProduct={setSelectedProductId}
          subcategory={selectedSubcategory}
        />
        
        <MadeInTunisia />
        
        <ProductTestimonials />
        
        <PartnersSection onNavigateToRevendeurs={handleNavigateToRevendeurs} />
      </div>
    </div>
  );
};

export default Products;
