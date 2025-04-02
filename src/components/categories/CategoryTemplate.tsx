
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryTemplateProps {
  data: {
    title: string;
    description: string;
    bannerImage: string;
    features: Array<{
      title: string;
      description: string;
    }>;
    products: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
    }>;
  };
  parentPath: string;
  parentName: string;
}

const ITEMS_PER_PAGE = 6;

const CategoryTemplate = ({ data, parentPath, parentName }: CategoryTemplateProps) => {
  const [sortOption, setSortOption] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const sortProducts = (products: typeof data.products) => {
    switch (sortOption) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  };

  const sortedProducts = sortProducts(data.products);
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
        <Link to={parentPath} className="hover:text-primary">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Retour aux {parentName}
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-12">
        <img 
          src={data.bannerImage}
          alt={data.title}
          className="w-full h-[300px] md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">{data.description}</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {data.features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Sort Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Notre Collection</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Trier par</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Recommandé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommandé</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="name-asc">Nom A-Z</SelectItem>
              <SelectItem value="name-desc">Nom Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedProducts.map((product) => (
          <div 
            key={product.id} 
            className="group relative bg-white rounded-lg shadow-sm overflow-hidden border cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {/* Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                DÉSTOCKAGE -30%
              </span>
            </div>
            
            <div className="aspect-square bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">À partir de</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{product.price.toFixed(2)} TND</span>
                    <span className="text-sm text-gray-500 line-through">
                      {(product.price * 1.3).toFixed(2)} TND
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/personalization');
                  }}
                >
                  Personnaliser
                </Button>
              </div>
              {/* Reviews */}
              <div className="mt-3 flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">(4 avis)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTemplate;
