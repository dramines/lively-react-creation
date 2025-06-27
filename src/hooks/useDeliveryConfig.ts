
import { useState, useCallback } from 'react';
import { 
  deliveryConfig, 
  validatePromoCode, 
  getDeliveryPriceForCountry, 
  getDeliveryZoneForCountry,
  calculateTax,
  formatPrice,
  isFreeShippingEligible,
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

  const getOrderSummary = useCallback((orderAmount: number, country: string = 'Tunisie') => {
    const deliveryPrice = getDeliveryPriceForCountry(country, orderAmount);
    const subtotalAfterDiscount = orderAmount - appliedDiscount;
    const tax = calculateTax(subtotalAfterDiscount + deliveryPrice);
    const total = subtotalAfterDiscount + deliveryPrice + tax;

    return {
      subtotal: orderAmount,
      discount: appliedDiscount,
      subtotalAfterDiscount,
      deliveryPrice,
      tax,
      total,
      currency: deliveryConfig.currency,
      isFreeShipping: deliveryPrice === 0,
      appliedPromoCode
    };
  }, [appliedDiscount, appliedPromoCode]);

  return {
    config: deliveryConfig,
    appliedPromoCode,
    appliedDiscount,
    applyPromoCode,
    removePromoCode,
    getOrderSummary,
    getDeliveryPriceForCountry,
    getDeliveryZoneForCountry,
    formatPrice,
    isFreeShippingEligible
  };
};
