
import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  type: string;
  itemgroup: string;
  discount?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (itemId: string) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('lucci-wishlist');
    console.log('WishlistContext - Loading from localStorage:', savedWishlist);
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        console.log('WishlistContext - Parsed wishlist:', parsed);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
        }
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        localStorage.removeItem('lucci-wishlist');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever items change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('WishlistContext - Saving to localStorage:', wishlistItems);
      localStorage.setItem('lucci-wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = (item: WishlistItem) => {
    console.log('WishlistContext - addToWishlist called with:', item);
    setWishlistItems(prev => {
      const exists = prev.find(existing => existing.id === item.id);
      console.log('WishlistContext - Item exists:', exists);
      if (!exists) {
        const newList = [...prev, item];
        console.log('WishlistContext - New wishlist after adding:', newList);
        return newList;
      }
      return prev;
    });
  };

  const removeFromWishlist = (itemId: string) => {
    console.log('WishlistContext - removeFromWishlist called with ID:', itemId);
    setWishlistItems(prev => {
      const newList = prev.filter(item => item.id !== itemId);
      console.log('WishlistContext - New wishlist after removing:', newList);
      return newList;
    });
  };

  const clearWishlist = () => {
    console.log('WishlistContext - clearWishlist called');
    setWishlistItems([]);
  };

  const isInWishlist = (itemId: string) => {
    const result = wishlistItems.some(item => item.id === itemId);
    console.log('WishlistContext - isInWishlist called for ID:', itemId, 'Result:', result);
    return result;
  };

  const getWishlistCount = () => {
    const count = wishlistItems.length;
    console.log('WishlistContext - getWishlistCount:', count);
    return count;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
