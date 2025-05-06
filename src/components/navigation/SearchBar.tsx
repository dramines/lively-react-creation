import React, { useState } from 'react';
import { Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { products } from '@/config/products';
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  mobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ mobile = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  const filteredProducts = searchQuery.length > 0
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className={`relative ${!mobile ? 'flex-1 max-w-[600px] mx-auto hidden md:block' : 'w-full mx-auto'}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Recherchez des produits"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchResults(true);
          }}
          className="w-full pr-4 pl-10 py-2.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00A6E6]/20 focus:border-[#00A6E6] transition-all text-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      
      {showSearchResults && searchQuery.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border max-h-[400px] overflow-y-auto">
          {filteredProducts.length > 0 ? (
            <div className="p-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-3"
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery("");
                    navigate(`/${product.category}#products`);
                  }}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucun résultat trouvé pour "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;