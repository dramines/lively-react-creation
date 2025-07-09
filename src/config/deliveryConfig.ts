export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate?: string;
  active: boolean;
}

export interface DeliveryZone {
  name: string;
  countries: string[];
  price: number;
  freeShippingThreshold: number;
  estimatedDays: string;
}

export interface DeliveryConfig {
  currency: string;
  defaultDeliveryPrice: number;
  freeShippingThreshold: number;
  zones: DeliveryZone[];
  promoCodes: PromoCode[];
  taxRate: number;
}

export const deliveryConfig: DeliveryConfig = {
  currency: 'EUR',
  defaultDeliveryPrice: 5.90,
  freeShippingThreshold: 75,
  taxRate: 0.20, // 20% VAT
  
  zones: [
    {
      name: 'France Métropolitaine',
      countries: ['France'],
      price: 4.90,
      freeShippingThreshold: 50,
      estimatedDays: '2-3 jours'
    },
    {
      name: 'Europe',
      countries: ['Allemagne', 'Italie', 'Espagne', 'Belgique', 'Suisse', 'Pays-Bas', 'Portugal', 'Autriche'],
      price: 9.90,
      freeShippingThreshold: 100,
      estimatedDays: '3-5 jours'
    },
    {
      name: 'International',
      countries: ['Autres pays'],
      price: 19.90,
      freeShippingThreshold: 150,
      estimatedDays: '7-14 jours'
    }
  ],

  promoCodes: [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      description: 'Réduction de 10% pour les nouveaux clients',
      minOrderAmount: 50,
      maxDiscount: 25,
      active: true
    },
    {
      code: 'SAVE15',
      type: 'percentage',
      value: 15,
      description: 'Réduction de 15% sur votre commande',
      minOrderAmount: 100,
      maxDiscount: 50,
      active: true
    },
    {
      code: 'FREESHIP',
      type: 'fixed',
      value: 0,
      description: 'Livraison gratuite',
      minOrderAmount: 30,
      active: true
    },
    {
      code: 'SUMMER20',
      type: 'percentage',
      value: 20,
      description: 'Promotion été - 20% de réduction',
      minOrderAmount: 75,
      maxDiscount: 40,
      expiryDate: '2024-12-31',
      active: true
    }
  ]
};

// Helper functions
export const getDeliveryPriceForCountry = (country: string, orderAmount: number): number => {
  const zone = deliveryConfig.zones.find(z => 
    z.countries.includes(country) || 
    (z.name === 'International' && !deliveryConfig.zones.some(zone => zone.countries.includes(country)))
  );
  
  if (!zone) return deliveryConfig.defaultDeliveryPrice;
  
  return orderAmount >= zone.freeShippingThreshold ? 0 : zone.price;
};

export const getDeliveryZoneForCountry = (country: string): DeliveryZone | null => {
  return deliveryConfig.zones.find(z => 
    z.countries.includes(country) || 
    (z.name === 'International' && !deliveryConfig.zones.some(zone => zone.countries.includes(country)))
  ) || null;
};

export const validatePromoCode = (code: string, orderAmount: number): { 
  valid: boolean; 
  discount: number; 
  message: string; 
  promoCode?: PromoCode 
} => {
  const promoCode = deliveryConfig.promoCodes.find(p => 
    p.code.toLowerCase() === code.toLowerCase() && p.active
  );
  
  if (!promoCode) {
    return { valid: false, discount: 0, message: 'Code promo invalide' };
  }
  
  // Check expiry date
  if (promoCode.expiryDate && new Date() > new Date(promoCode.expiryDate)) {
    return { valid: false, discount: 0, message: 'Code promo expiré' };
  }
  
  // Check minimum order amount
  if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
    return { 
      valid: false, 
      discount: 0, 
      message: `Commande minimum de ${promoCode.minOrderAmount} ${deliveryConfig.currency} requise` 
    };
  }
  
  let discount = 0;
  if (promoCode.type === 'percentage') {
    discount = (orderAmount * promoCode.value) / 100;
    if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
      discount = promoCode.maxDiscount;
    }
  } else {
    discount = promoCode.value;
  }
  
  return { 
    valid: true, 
    discount, 
    message: promoCode.description,
    promoCode 
  };
};

export const calculateTax = (amount: number): number => {
  return amount * deliveryConfig.taxRate;
};

export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} ${deliveryConfig.currency}`;
};

export const isFreeShippingEligible = (orderAmount: number, country: string = 'France'): boolean => {
  const zone = getDeliveryZoneForCountry(country);
  const threshold = zone?.freeShippingThreshold || deliveryConfig.freeShippingThreshold;
  return orderAmount >= threshold;
};