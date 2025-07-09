
import React from "react";
import { ShoppingBag, Plus, Minus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
  const { state, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCheckout = () => {
    navigate("/checkout");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={onClose}
        />
      )}
      
      <div className={`${
        isMobile 
          ? "fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col" 
          : "absolute right-0 top-full mt-2 w-96 bg-white shadow-xl border border-gray-100 z-50"
      }`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Panier</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className={`${isMobile ? "flex-1 overflow-y-auto" : "max-h-96 overflow-y-auto"}`}>
          {state.items.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">Votre panier est vide</p>
              <p className="text-sm text-gray-400">
                Découvrez notre collection exceptionnelle
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {state.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className={`flex gap-3 ${isMobile ? "bg-gray-50 rounded-lg p-3" : ""}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`${isMobile ? "w-20 h-24" : "w-16 h-20"} object-cover bg-gray-100 rounded`}
                  />
                  <div className="flex-1">
                    <h4 className={`font-medium text-gray-900 mb-1 ${isMobile ? "text-base" : "text-sm"}`}>
                      {item.name}
                    </h4>
                    <p className={`text-gray-500 mb-2 ${isMobile ? "text-sm" : "text-xs"}`}>
                      Taille: {item.size} • Couleur: {item.color}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))
                          }
                          className={`${isMobile ? "p-2" : "p-1"} hover:bg-gray-100 rounded`}
                        >
                          <Minus size={isMobile ? 16 : 12} />
                        </button>
                        <span className={`font-medium ${isMobile ? "text-base min-w-[2rem]" : "text-sm"} text-center`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity + 1)
                          }
                          className={`${isMobile ? "p-2" : "p-1"} hover:bg-gray-100 rounded`}
                        >
                          <Plus size={isMobile ? 16 : 12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className={`text-red-500 hover:text-red-700 ${isMobile ? "text-sm" : "text-xs"}`}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${isMobile ? "text-base" : "text-sm"}`}>
                      {(item.price * item.quantity).toLocaleString()}€
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className={`p-4 border-t border-gray-100 ${isMobile ? "bg-white" : ""}`}>
            <div className="flex justify-between items-center mb-4">
              <span className={`font-medium ${isMobile ? "text-lg" : ""}`}>Total</span>
              <span className={`font-medium ${isMobile ? "text-xl" : "text-lg"}`}>
                {state.total.toLocaleString()}€
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className={`w-full bg-black text-white hover:bg-gray-800 ${isMobile ? "py-4 text-lg" : ""}`}
            >
              Finaliser la commande
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDropdown;
