import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
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
    const savedWishlist = localStorage.getItem('app-wishlist');
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
        }
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        localStorage.removeItem('app-wishlist');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app-wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems(prev => {
      const exists = prev.find(existing => existing.id === item.id);
      if (!exists) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const isInWishlist = (itemId: string) => {
    return wishlistItems.some(item => item.id === itemId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
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