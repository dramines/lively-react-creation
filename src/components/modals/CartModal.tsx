
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeepShopping: () => void;
  onGoToCheckout: () => void;
}

const CartModal = ({ isOpen, onClose, onKeepShopping, onGoToCheckout }: CartModalProps) => {
  const { t } = useTranslation(['products']);
  const navigate = useNavigate();

  const handleGoToCheckout = () => {
    navigate('/checkout');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-xl rounded-xl">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-serif text-slate-900 text-center">
            Produit ajouté au panier !
          </DialogTitle>
          <p className="text-slate-600 mt-3 text-center leading-relaxed">
            Votre article a été ajouté avec succès à votre panier.
          </p>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-8 pt-4">
          <Button 
            onClick={handleGoToCheckout}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Voir le panier
          </Button>
          
          <Button 
            onClick={onKeepShopping}
            variant="outline"
            className="w-full py-3 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
          >
            Continuer mes achats
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
