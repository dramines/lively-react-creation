
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface HeartButtonProps {
  product: {
    id_product: string;
    nom_product: string;
    price_product: string;
    img_product?: string;
    type_product: string;
    itemgroup_product: string;
    discount_product?: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const HeartButton: React.FC<HeartButtonProps> = ({ product, className = '', size = 'md' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const { t } = useTranslation('wishlist');

  console.log('HeartButton - Product received:', product);

  const isLiked = isInWishlist(product.id_product);
  console.log('HeartButton - Is product liked:', isLiked, 'Product ID:', product.id_product);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('HeartButton - Toggle wishlist clicked for product:', product.id_product);

    if (isLiked) {
      console.log('HeartButton - Removing from wishlist');
      removeFromWishlist(product.id_product);
      toast({
        title: t('notifications.removed'),
        description: t('notifications.removedDescription'),
      });
    } else {
      console.log('HeartButton - Adding to wishlist');
      const wishlistItem = {
        id: product.id_product,
        name: product.nom_product,
        price: `${product.price_product} TND`,
        image: product.img_product || '',
        category: product.type_product,
        type: product.type_product,
        itemgroup: product.itemgroup_product,
        discount: product.discount_product,
      };
      
      console.log('HeartButton - Wishlist item to add:', wishlistItem);
      addToWishlist(wishlistItem);
      toast({
        title: t('notifications.added'),
        description: t('notifications.addedDescription'),
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
      className={`p-2 hover:bg-slate-100 transition-all duration-200 ${className}`}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all duration-200 ${
          isLiked 
            ? 'fill-red-500 text-red-500' 
            : 'text-slate-600 hover:text-red-400'
        }`}
      />
    </Button>
  );
};

export default HeartButton;
