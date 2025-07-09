import { useState, useCallback } from 'react';
import { 
  deliveryConfig, 
  validatePromoCode, 
  getDeliveryPriceForCountry,
  formatPrice,
  type PromoCode 
} from '@/config/deliveryConfig';

export const useDeliveryConfig = () => {
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const applyPromoCode = useCallback((code: string, orderAmount: number) => {
    const result = validatePromoCode(code, orderAmount);
    
    if (result.valid && result.promoCode) {
      setAppliedPromoCode(result.promoCode);
      setAppliedDiscount(result.discount);
    } else {
      setAppliedPromoCode(null);
      setAppliedDiscount(0);
    }
    
    return result;
  }, []);

  const removePromoCode = useCallback(() => {
    setAppliedPromoCode(null);
    setAppliedDiscount(0);
  }, []);

  const getOrderSummary = useCallback((subtotal: number, country: string = 'France') => {
    const deliveryPrice = getDeliveryPriceForCountry(country, subtotal);
    const discount = appliedDiscount;
    const total = Math.max(0, subtotal + deliveryPrice - discount);

    return {
      subtotal,
      deliveryPrice,
      discount,
      total,
      currency: deliveryConfig.currency
    };
  }, [appliedDiscount]);

  return {
    deliveryConfig,
    appliedPromoCode,
    appliedDiscount,
    applyPromoCode,
    removePromoCode,
    getOrderSummary,
    formatPrice,
    getDeliveryPriceForCountry
  };
};