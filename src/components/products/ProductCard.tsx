
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, Eye } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  isPersonalizable?: boolean;
}

const ProductCard = ({ id, name, description, price, image, isPersonalizable = true }: ProductCardProps) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Badge */}
      {isPersonalizable && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-[#219ad1] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            Personnalisable
          </span>
        </div>
      )}

      {/* Logo Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg p-1 shadow-md">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-8 h-8 object-contain"
        />
      </div>
      
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/product/${id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">À partir de</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">{price} TND</span>
              <span className="text-sm text-gray-400 line-through">
                {(parseFloat(price) * 1.3).toFixed(2)} TND
              </span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">(4 avis)</span>
          </div>
          
          <Button asChild size="sm" className="rounded-full px-6">
            <Link to={isPersonalizable ? "/personalization" : `/product/${id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Voir
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
