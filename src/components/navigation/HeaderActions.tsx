
import React from 'react';
import { ShoppingCart, Heart, ClipboardList } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface HeaderActionsProps {
  favoritesCount?: number;
  cartCount?: number;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ 
  favoritesCount, 
  cartCount 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-6">
      <button
        onClick={() => navigate('/favorites')}
        className="hidden md:flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
      >
        <Heart className="h-6 w-6" />
        <span className="text-sm font-medium">Wishlist</span>
      </button>

      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="text-sm font-medium hidden md:inline">Panier</span>
      </button>

      <button
        onClick={() => navigate('/devis')}
        className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-[#333333] text-white rounded-md hover:bg-[#333333]/90 transition-colors shadow-sm"
      >
        <ClipboardList className="h-5 w-5" />
        <span className="font-medium">DEMANDE DE DEVIS</span>
      </button>
    </div>
  );
};

export default HeaderActions;
