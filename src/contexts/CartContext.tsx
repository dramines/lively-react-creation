
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Create an event emitter for cart updates
class CartEventEmitter extends EventTarget {
  emitCartUpdate(item: CartItem, action: 'add' | 'remove' | 'update') {
    this.dispatchEvent(new CustomEvent('cartUpdate', { 
      detail: { item, action } 
    }));
  }
}

export const cartEventEmitter = new CartEventEmitter();

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // Add original price for discounted items
  isDiscounted?: boolean; // Flag to indicate if item is discounted
  discountPercentage?: number; // Discount percentage for display
  size: string;
  quantity: number;
  image: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getOriginalTotalPrice: () => number; // New method for original price calculation
  getTotalDiscount: () => number; // New method for total discount calculation
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    console.log('Adding to cart:', item, 'Quantity:', quantity);
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id && i.size === item.size);
      
      if (existingItem) {
        const updatedItems = prevItems.map(i => 
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
        // Emit update event for existing item
        cartEventEmitter.emitCartUpdate({ ...item, quantity }, 'update');
        return updatedItems;
      } else {
        const newItem = { ...item, quantity };
        // Emit add event for new item
        cartEventEmitter.emitCartUpdate(newItem, 'add');
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id && item.size === size);
      if (itemToRemove) {
        cartEventEmitter.emitCartUpdate(itemToRemove, 'remove');
      }
      return prevItems.filter(item => !(item.id === id && item.size === size));
    });
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getOriginalTotalPrice = () => {
    return items.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price;
      return total + (originalPrice * item.quantity);
    }, 0);
  };

  const getTotalDiscount = () => {
    return getOriginalTotalPrice() - getTotalPrice();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getOriginalTotalPrice,
        getTotalDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
