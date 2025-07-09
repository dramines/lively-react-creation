import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'TND' | 'EUR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInTND: number) => number;
  formatPrice: (priceInTND: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Conversion rates from TND
const CONVERSION_RATES = {
  TND: 1,
  EUR: 0.29,
  USD: 0.34,
} as const;

const CURRENCY_SYMBOLS = {
  TND: 'TND',
  EUR: '€',
  USD: '$',
} as const;

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('TND');

  const convertPrice = (priceInTND: number): number => {
    return priceInTND * CONVERSION_RATES[currency];
  };

  const formatPrice = (priceInTND: number): string => {
    const convertedPrice = convertPrice(priceInTND);
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (currency === 'TND') {
      return `${convertedPrice.toFixed(0)} ${symbol}`;
    }
    
    return `${symbol}${convertedPrice.toFixed(2)}`;
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

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};