import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveCartItems, getCartItems } from '@/utils/cartStorage';
import { getPersonalizations } from '@/utils/personalizationStorage';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  personalization?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  hasNewsletterDiscount: boolean;
  applyNewsletterDiscount: () => void;
  removeNewsletterDiscount: () => void;
  calculateTotal: () => { subtotal: number; discount: number; total: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasNewsletterDiscount, setHasNewsletterDiscount] = useState<boolean>(() => {
    return localStorage.getItem('newsletterDiscount') === 'true';
  });

  useEffect(() => {
    const savedItems = getCartItems();
    const personalizations = getPersonalizations();
    
    const itemsWithPersonalization = savedItems.map(item => ({
      ...item,
      personalization: item.personalization || personalizations[item.id] || '',
    }));
    
    if (itemsWithPersonalization.length > 0) {
      setCartItems(itemsWithPersonalization);
    }
  }, []);

  useEffect(() => {
    saveCartItems(cartItems);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => 
        i.id === item.id && 
        i.size === item.size && 
        i.color === item.color && 
        i.personalization === item.personalization
      );
      
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id && 
          i.size === item.size && 
          i.color === item.color && 
          i.personalization === item.personalization
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    removeNewsletterDiscount();
  };

  const applyNewsletterDiscount = () => {
    setHasNewsletterDiscount(true);
    localStorage.setItem('newsletterDiscount', 'true');
  };

  const removeNewsletterDiscount = () => {
    setHasNewsletterDiscount(false);
    localStorage.removeItem('newsletterDiscount');
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = hasNewsletterDiscount && cartItems.length > 0 ? subtotal * 0.05 : 0;
    const total = subtotal - discount;
    
    return { subtotal, discount, total };
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      hasNewsletterDiscount,
      applyNewsletterDiscount,
      removeNewsletterDiscount,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};