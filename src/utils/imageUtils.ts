
// Utility function to get product images from server only
export const getProductImage = (originalImage: string, productId?: string) => {
  // If original image is null, empty, or placeholder, return a default server image
  if (!originalImage || originalImage === 'null' || originalImage === '/placeholder.svg' || originalImage.includes('placeholder')) {
    return `https://draminesaid.com/lucci/uploads/1.jpg`; // Default server image
  }
  
  // If it's already a full URL (starts with http or https), return as is
  if (originalImage.startsWith('http')) {
    return originalImage;
  }
  
  // For all API images, construct the full URL with the server path
  // Remove any leading slash to avoid double slashes
  const cleanPath = originalImage.startsWith('/') ? originalImage.substring(1) : originalImage;
  
  // If it already starts with 'uploads/', use it directly
  if (cleanPath.startsWith('uploads/')) {
    return `https://draminesaid.com/lucci/${cleanPath}`;
  }
  
  // Otherwise, assume it needs the uploads/ prefix
  return `https://draminesaid.com/lucci/uploads/${cleanPath}`;
};

// Remove the random product image function and uploaded images array since we only want server images
export const getRandomProductImage = (productId?: string) => {
  // Always return a default server image instead of random lovable uploads
  return `https://draminesaid.com/lucci/uploads/1.jpg`;
};

// Utility function to get chat images with proper URL construction
export const getChatImageUrl = (imageUrl: string) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Construct full URL for chat images
  const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
  return `https://draminesaid.com/lucci/${cleanPath}`;
};

// Utility to validate image files
export const validateChatImage = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  const errors: string[] = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF.');
  }
  
  if (file.size > maxSize) {
    errors.push('Fichier trop volumineux. Maximum 5MB.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility to format image size for display
export const formatImageSize = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};
