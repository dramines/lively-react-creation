import { DollarSign, Euro, Banknote } from 'lucide-react';
import { useCurrency, type Currency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';

interface CurrencySelectorProps {
  variant?: 'default' | 'white';
}

const CURRENCIES: { value: Currency; label: string; icon?: React.ComponentType<any>; text?: string }[] = [
  { value: 'EUR', label: 'EUR', icon: Euro },
  { value: 'USD', label: 'USD', icon: DollarSign },
  { value: 'TND', label: 'TND', text: 'TND' },
];

const CurrencySelector = ({ variant = 'default' }: CurrencySelectorProps) => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencySwitch = () => {
    const currentIndex = CURRENCIES.findIndex(c => c.value === currency);
    const nextIndex = (currentIndex + 1) % CURRENCIES.length;
    setCurrency(CURRENCIES[nextIndex].value);
  };

  // Show the NEXT currency to switch to, not the current one
  const currentIndex = CURRENCIES.findIndex(c => c.value === currency);
  const nextIndex = (currentIndex + 1) % CURRENCIES.length;
  const nextCurrency = CURRENCIES[nextIndex];

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleCurrencySwitch}
      className="relative p-2 transition-all hover:scale-110"
      title={`Switch to ${nextCurrency.label}`}
    >
      {nextCurrency.text ? (
        <span className={`text-xs font-medium ${
          variant === 'white' ? 'text-white' : 'text-gray-900'
        }`}>
          {nextCurrency.text}
        </span>
      ) : (
        nextCurrency.icon && (
          <nextCurrency.icon 
            className={`w-5 h-5 ${
              variant === 'white' ? 'text-white' : 'text-gray-900'
            }`} 
          />
        )
      )}
    </Button>
  );
};

export default CurrencySelector;