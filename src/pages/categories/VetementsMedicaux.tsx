
import { useState } from "react";
import { Link } from "react-router-dom";
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
import FeaturesSection from "@/components/features/FeaturesSection";

const VetementsMedicaux = () => {
  const [sortBy, setSortBy] = useState("recommended");
  const medicauxProducts = products.filter(p => p.category === 'vetements-medicaux');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Vêtements Médicaux</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src="/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png"
          alt="Vêtements Médicaux"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Vêtements Médicaux Professionnels</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Des tenues médicales confortables et conformes aux normes sanitaires. Protection et praticité pour le personnel médical.
            </p>
            <Button asChild className="bg-white text-primary hover:bg-gray-100">
              <Link to="#products">Découvrir nos produits</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />

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
              {medicauxProducts.map((product) => (
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

export default VetementsMedicaux;
