
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal = ({ isOpen, onClose }: WishlistModalProps) => {
  const { t } = useTranslation('wishlist');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId);
    toast({
      title: t('notifications.removed'),
      description: t('notifications.removedDescription'),
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast({
      title: t('notifications.cleared'),
      description: t('notifications.clearedDescription'),
    });
  };

  const viewProduct = (item: any) => {
    onClose();
    navigate(`/product/${item.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-serif text-center flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-red-400" />
            {t('title')}
          </DialogTitle>
          <p className="text-slate-300 text-center mt-2">
            {t('subtitle')}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">
                {t('empty.title')}
              </h3>
              <p className="text-slate-400 mb-6">
                {t('empty.description')}
              </p>
              <Button
                onClick={onClose}
                className="bg-white text-black hover:bg-gray-200 font-medium"
              >
                {t('empty.button')}
              </Button>
            </div>
          ) : (
            <>
              {/* Header with count and clear button */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {t('itemCount', { count: wishlistItems.length })}
                </h3>
                {wishlistItems.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearWishlist}
                    className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('clearAll')}
                  </Button>
                )}
              </div>

              {/* Wishlist items grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800 border border-slate-600 rounded-lg p-4 group hover:bg-slate-750 transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="text-slate-400 text-xs text-center">Image</div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="text-slate-400 text-xs text-center">
                            Image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-white group-hover:text-blue-200 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-sm text-slate-400 mb-1">{item.category}</p>
                        <p className="text-lg font-semibold text-white">{item.price}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => viewProduct(item)}
                          className="bg-white text-black hover:bg-gray-200 h-8 px-3"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {t('viewProduct')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="bg-transparent border-slate-600 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-400 h-8 px-3"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistModal;
