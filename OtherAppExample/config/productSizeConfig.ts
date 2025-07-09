
// Product Size Configuration
// This file defines which item groups use which type of size/quantity controls

export const PRODUCT_SIZE_CONFIG = {
  // Item groups that only use quantity (no size selection)
  QUANTITY_ONLY: [
    'cravate',
    'pochette', 
    'maroquinerie',
    'ceinture',
    'autre'
  ],

  // Item groups that use standard clothing sizes (XS, S, M, L, XL, etc.)
  STANDARD_SIZES: [
    'tshirt',
    'polo',
    'chemise'
  ],

  // Item groups that use formal/suit sizes (48, 50, 52, 54, etc.)
  FORMAL_SIZES: [
    'blazers',
    'blouson', 
    'manteau',
    'djine',
    'slack',
    'pantalon',
    'costume',
    'blazer'
  ],

  // Item groups that use shoe sizes (could be extended later)
  SHOE_SIZES: [
    'chaussure'
  ]
} as const;

// Helper functions to determine size type for an item group
export const getItemGroupSizeType = (itemgroup: string): 'quantity-only' | 'standard' | 'formal' | 'shoe' => {
  if (PRODUCT_SIZE_CONFIG.QUANTITY_ONLY.includes(itemgroup as any)) {
    return 'quantity-only';
  }
  
  if (PRODUCT_SIZE_CONFIG.STANDARD_SIZES.includes(itemgroup as any)) {
    return 'standard';
  }
  
  if (PRODUCT_SIZE_CONFIG.FORMAL_SIZES.includes(itemgroup as any)) {
    return 'formal';
  }
  
  if (PRODUCT_SIZE_CONFIG.SHOE_SIZES.includes(itemgroup as any)) {
    return 'shoe';
  }
  
  // Default to quantity-only for unknown item groups
  return 'quantity-only';
};

export const needsSizeSelection = (itemgroup: string): boolean => {
  const sizeType = getItemGroupSizeType(itemgroup);
  return sizeType !== 'quantity-only';
};

export const getSizeFieldsForItemGroup = (itemgroup: string): string[] => {
  const sizeType = getItemGroupSizeType(itemgroup);
  
  switch (sizeType) {
    case 'standard':
      return ['xs_size', 's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size'];
    
    case 'formal':
      return ['48_size', '50_size', '52_size', '54_size', '56_size', '58_size'];
    
    case 'shoe':
      // For now, treating shoes like formal sizes, but this can be extended
      return ['48_size', '50_size', '52_size', '54_size', '56_size', '58_size'];
    
    case 'quantity-only':
    default:
      return [];
  }
};
