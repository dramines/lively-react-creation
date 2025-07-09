export const paymentConfig = {
  // Set to true to bypass payment for testing
  bypassPayment: false,
  
  // Set to true to enable cash on delivery
  enableCashOnDelivery: true,
  
  // Test mode settings
  testMode: {
    enabled: process.env.NODE_ENV === 'development',
    autoConfirmOrders: true,
  },
  
  // Konnect settings (placeholder - replace with actual values)
  konnect: {
    apiUrl: 'https://api.konnect.network/api/v2',
    apiKey: 'your-konnect-api-key',
    receiverWalletId: 'your-receiver-wallet-id',
  }
};