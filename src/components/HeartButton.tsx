import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

interface HeartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const HeartButton: React.FC<HeartButtonProps> = ({ product, className = '', size = 'md' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const isLiked = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      removeFromWishlist(product.id);
      toast({
        title: "Retiré des favoris",
        description: "Le produit a été retiré de vos favoris",
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Ajouté aux favoris",
        description: "Le produit a été ajouté à vos favoris",
      });
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleWishlist}
      className={`p-2 hover:bg-white/20 transition-all duration-200 ${className}`}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all duration-200 ${
          isLiked 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-600 hover:text-red-400'
        }`}
      />
    </Button>
  );
};

export default HeartButton;