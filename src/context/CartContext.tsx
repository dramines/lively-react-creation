
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // Add original price for discounted items
  isDiscounted?: boolean; // Flag to indicate if item is discounted
  discountPercentage?: number; // Discount percentage for display
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType {
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getOriginalTotalPrice: () => number; // New method for original price calculation
  getTotalDiscount: () => number; // New method for total discount calculation
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        item => item.id === action.payload.id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
      );

      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id && 
          item.size === action.payload.size && 
          item.color === action.payload.color
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_FROM_CART': {
      const { id, size } = action.payload;
      const newItems = state.items.filter(item => !(item.id === id && item.size === size));
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const { id, size, quantity } = action.payload;
      const newItems = state.items.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      ).filter(item => item.quantity > 0);

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string, size: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size } });
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.itemCount;
  };

  const getTotalPrice = () => {
    return state.total;
  };

  const getOriginalTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price;
      return total + (originalPrice * item.quantity);
    }, 0);
  };

  const getTotalDiscount = () => {
    return getOriginalTotalPrice() - getTotalPrice();
  };

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getOriginalTotalPrice,
      getTotalDiscount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
