import React from 'react';
import { useCurrency, Currency } from '@/context/CurrencyContext';

interface CurrencySelectorProps {
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ className = "" }) => {
  const { currency, setCurrency } = useCurrency();

  const currencies: { code: Currency; symbol: string }[] = [
    { code: 'EUR', symbol: '€' },
    { code: 'USD', symbol: '$' },
    { code: 'TND', symbol: 'TND' }
  ];

  const currentIndex = currencies.findIndex(c => c.code === currency);
  const displayIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % currencies.length;
  
  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % currencies.length;
    setCurrency(currencies[nextIndex].code);
  };

  const displayCurrency = currencies[displayIndex];

  return (
    <button 
      className={`p-2 hover:bg-gray-100 rounded-sm transition-colors relative ${className}`}
      onClick={handleClick}
      title={`Switch currency (${displayCurrency.symbol})`}
    >
      <span className="text-base font-bold text-gray-700">
        {displayCurrency.symbol}
      </span>
    </button>
  );
};

export default CurrencySelector;