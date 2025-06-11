
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import CartDropdown from './CartDropdown';

const CartIcon = () => {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <CartDropdown>
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2 sm:p-3 hover:bg-slate-100 transition-colors rounded-lg"
      >
        <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700" />
        {itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 border-0"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Button>
    </CartDropdown>
  );
};

export default CartIcon;
