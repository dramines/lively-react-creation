import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'TND' | 'EUR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (tndPrice: number) => number;
  formatPrice: (tndPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Conversion rates from TND
const CONVERSION_RATES = {
  TND: 1,
  EUR: 0.29,
  USD: 0.34,
};

const CURRENCY_SYMBOLS = {
  TND: 'TND',
  EUR: '€',
  USD: '$',
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('TND');

  // Load saved currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency') as Currency;
    if (savedCurrency && CONVERSION_RATES[savedCurrency]) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', currency);
  }, [currency]);

  const convertPrice = (tndPrice: number): number => {
    return tndPrice * CONVERSION_RATES[currency];
  };

  const formatPrice = (tndPrice: number): string => {
    const convertedPrice = convertPrice(tndPrice);
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (currency === 'TND') {
      return `${convertedPrice.toFixed(0)} ${symbol}`;
    } else {
      return `${symbol}${convertedPrice.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      convertPrice,
      formatPrice,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};