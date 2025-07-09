import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Eye, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal = ({ isOpen, onClose }: WishlistModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId);
    toast({
      title: "Retiré des favoris",
      description: "Le produit a été retiré de vos favoris",
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast({
      title: "Favoris vidés",
      description: "Tous vos favoris ont été supprimés",
    });
  };

  const viewProduct = (item: any) => {
    onClose();
    navigate(`/product/${item.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-white border border-gray-200 shadow-2xl flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <DialogTitle className="text-xl md:text-2xl font-light text-gray-900 text-center flex items-center justify-center gap-2 md:gap-3">
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
            Mes Favoris
          </DialogTitle>
          <p className="text-sm md:text-base text-gray-600 text-center mt-1 md:mt-2 font-light">
            Vos produits préférés vous attendent
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12 md:py-16 px-4">
              <Heart className="h-16 w-16 md:h-20 md:w-20 text-gray-300 mx-auto mb-4 md:mb-6" />
              <h3 className="text-lg md:text-xl font-light text-gray-900 mb-2 md:mb-3">
                Aucun favori pour le moment
              </h3>
              <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 max-w-sm md:max-w-md mx-auto leading-relaxed">
                Découvrez nos produits et ajoutez-les à vos favoris en cliquant sur le cœur
              </p>
              <Button
                onClick={onClose}
                className="bg-black text-white hover:bg-gray-800 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base rounded-lg"
              >
                Découvrir nos produits
              </Button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6 p-4 md:p-6">
              {/* Header with count and clear button */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base md:text-lg font-light text-gray-900">
                  {wishlistItems.length} produit{wishlistItems.length > 1 ? 's' : ''} en favoris
                </h3>
                {wishlistItems.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearWishlist}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-red-600 hover:border-red-300 text-xs md:text-sm"
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Tout supprimer
                  </Button>
                )}
              </div>

              {/* Wishlist items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white border border-gray-200 rounded-lg md:rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300"
                  >
                    {/* Product Image */}
                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* Remove button overlay */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="absolute top-2 md:top-3 right-2 md:right-3 p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
                      >
                        <X className="h-3 w-3 md:h-4 md:w-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-3 md:p-4">
                      <h4 className="text-sm md:text-base font-medium text-gray-900 mb-1 line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 mb-2">{item.category}</p>
                      <p className="text-base md:text-lg font-light text-gray-900 mb-3 md:mb-4">
                        {item.price} TND
                      </p>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => viewProduct(item)}
                          className="flex-1 bg-black text-white hover:bg-gray-800 h-8 md:h-9 text-xs md:text-sm"
                        >
                          <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          Voir
                        </Button>
                        <Button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          variant="outline"
                          className="px-2 md:px-3 border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 h-8 md:h-9"
                        >
                          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistModal;