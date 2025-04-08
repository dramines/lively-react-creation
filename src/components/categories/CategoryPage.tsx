
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products } from "@/config/products";
import ProductCard from "@/components/products/ProductCard";
import { categoryPagesConfig, CategoryPageConfig } from "@/config/categoryPagesConfig";
import FeaturesSection from "@/components/features/FeaturesSection";

const CategoryPage = () => {
  const [sortBy, setSortBy] = useState("recommended");
  const location = useLocation();
  const currentPath = location.pathname.substring(1); // Remove leading slash
  const pageConfig: CategoryPageConfig = categoryPagesConfig[currentPath];

  if (!pageConfig) {
    return <div>Category not found</div>;
  }

  const categoryProducts = products.filter(p => {
    if (currentPath.includes('/')) {
      // This is a subcategory page
      const [category, subcategory] = currentPath.split('/');
      return p.category === category && p.type === subcategory;
    }
    // This is a main category page
    return p.category === pageConfig.categoryType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            {pageConfig.parentCategory && (
              <>
                <Link 
                  to={`/${pageConfig.categoryType}`} 
                  className="hover:text-primary"
                >
                  {pageConfig.parentCategory}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-gray-900 font-medium">{pageConfig.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={pageConfig.bannerImage}
          alt={pageConfig.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{pageConfig.title}</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              {pageConfig.description}
            </p>
            <Button asChild className="bg-white text-primary hover:bg-gray-100">
              <Link to="#products">Voir les produits</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageConfig.features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-gray-50">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Sorting Section */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Nos Produits</h2>
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommandés</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="newest">Plus récents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.startingPrice}
                  image={product.image || '/placeholder.png'}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
