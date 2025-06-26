
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
  currency: 'TND',
  defaultDeliveryPrice: 7.50,
  freeShippingThreshold: 299,
  taxRate: 0.19, // 19% TVA
  
  zones: [
    {
      name: 'Tunisie - Grand Tunis',
      countries: ['Tunis', 'Ariana', 'Ben Arous', 'Manouba'],
      price: 5.00,
      freeShippingThreshold: 199,
      estimatedDays: '1-2 jours'
    },
    {
      name: 'Tunisie - Autres gouvernorats',
      countries: ['Sfax', 'Sousse', 'Kairouan', 'Monastir', 'Mahdia', 'Bizerte', 'Nabeul', 'Zaghouan', 'Siliana', 'Béja', 'Jendouba', 'Le Kef', 'Kasserine', 'Sidi Bouzid', 'Gafsa', 'Tozeur', 'Kebili', 'Gabès', 'Médenine', 'Tataouine'],
      price: 8.50,
      freeShippingThreshold: 299,
      estimatedDays: '2-4 jours'
    },
    {
      name: 'Maghreb',
      countries: ['Algérie', 'Maroc', 'Libye'],
      price: 25.00,
      freeShippingThreshold: 500,
      estimatedDays: '5-10 jours'
    },
    {
      name: 'Europe',
      countries: ['France', 'Allemagne', 'Italie', 'Espagne', 'Belgique', 'Suisse', 'Pays-Bas'],
      price: 35.00,
      freeShippingThreshold: 750,
      estimatedDays: '7-14 jours'
    },
    {
      name: 'International',
      countries: ['Autres pays'],
      price: 45.00,
      freeShippingThreshold: 1000,
      estimatedDays: '10-21 jours'
    }
  ],

  promoCodes: [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      description: 'Réduction de 10% pour les nouveaux clients',
      minOrderAmount: 100,
      maxDiscount: 50,
      active: true
    },
    {
      code: 'SAVE20',
      type: 'percentage',
      value: 20,
      description: 'Réduction de 20% sur votre commande',
      minOrderAmount: 200,
      maxDiscount: 100,
      active: true
    },
    {
      code: 'FREESHIP',
      type: 'fixed',
      value: 0,
      description: 'Livraison gratuite',
      minOrderAmount: 50,
      active: true
    },
    {
      code: 'SUMMER25',
      type: 'percentage',
      value: 25,
      description: 'Promotion été - 25% de réduction',
      minOrderAmount: 150,
      maxDiscount: 75,
      expiryDate: '2024-08-31',
      active: true
    },
    {
      code: 'FIXED15',
      type: 'fixed',
      value: 15,
      description: 'Réduction fixe de 15 TND',
      minOrderAmount: 75,
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

export const isFreeShippingEligible = (orderAmount: number, country: string = 'Tunisie'): boolean => {
  const zone = getDeliveryZoneForCountry(country);
  const threshold = zone?.freeShippingThreshold || deliveryConfig.freeShippingThreshold;
  return orderAmount >= threshold;
};
