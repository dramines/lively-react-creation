
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
  
  // Konnect settings
  konnect: {
    apiUrl: 'https://api.konnect.network/api/v2',
    apiKey: '657af1930bef8bdfd045b3a3:SGfAZSWuEtQcPbUU2I5hXsOK',
    receiverWalletId: '657af1930bef8bdfd045b3a7',
  }
};
