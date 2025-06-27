
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Minus, X } from 'lucide-react';
import { getProductImage } from '@/utils/imageUtils';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCheckout: () => void;
}

const CartDropdown = ({ isOpen, onClose, onGoToCheckout }: CartDropdownProps) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} TND`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-serif text-lg text-slate-900">Votre Panier</h3>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Votre panier est vide</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 bg-slate-50 rounded-lg p-3">
                  <img 
                    src={getProductImage(item.image, item.id)} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md bg-white"
                    onError={(e) => {
                      e.currentTarget.src = getProductImage('', item.id);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Taille: {item.size} {item.color && `• ${item.color}`}
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-1">
                      {formatPrice(item.price)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Minus className="w-3 h-3 text-slate-900" />
                      </button>
                      <span className="text-sm font-medium text-slate-900 min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Plus className="w-3 h-3 text-slate-900" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-slate-900">Total:</span>
              <span className="text-lg font-semibold text-slate-900">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <Button 
              onClick={onGoToCheckout}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Passer à la commande
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDropdown;
