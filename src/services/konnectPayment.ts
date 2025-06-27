
import { paymentConfig } from '@/config/paymentConfig';
import { toast } from '@/hooks/use-toast';

const KONNECT_API_URL = paymentConfig.konnect.apiUrl;
const KONNECT_API_KEY = paymentConfig.konnect.apiKey;
const RECEIVER_WALLET_ID = paymentConfig.konnect.receiverWalletId;

interface InitPaymentResponse {
  payUrl: string;
  paymentRef: string;
}

interface KonnectPaymentRequest {
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  orderId: string;
}

const fetchWithTimeout = (url: string, options: RequestInit, timeout = 5000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout)),
  ]) as Promise<Response>;
};

const showTestModeError = (error: Error) => {
  if (paymentConfig.testMode.enabled || paymentConfig.bypassPayment) {
    console.error('Konnect Payment Error (Test Mode):', error);
    
    toast({
      title: "Erreur de paiement (Mode Test)",
      description: `Détails de l'erreur: ${error.message}`,
      variant: "destructive",
      duration: 10000, // Show for 10 seconds
    });
  }
};

export const initKonnectPayment = async (
  {
    amount,
    firstName,
    lastName,
    email,
    orderId,
  }: KonnectPaymentRequest,
  successUrl = `${window.location.origin}/payment-success`,
  failUrl = `${window.location.origin}/payment-failure`,
  theme = 'light'
): Promise<InitPaymentResponse> => {
  // If payment is bypassed for testing, return mock data
  if (paymentConfig.bypassPayment || paymentConfig.testMode.enabled) {
    console.log('Payment bypassed for testing - redirecting to success page');
    return {
      payUrl: `${successUrl}?payment_ref=TEST_${Date.now()}&order_id=${orderId}&test_mode=true`,
      paymentRef: `TEST_${Date.now()}`
    };
  }

  if (!amount || amount <= 0) {
    const error = new Error('Invalid amount. Must be greater than 0.');
    showTestModeError(error);
    throw error;
  }
  if (!firstName || !lastName) {
    const error = new Error('First and last names are required.');
    showTestModeError(error);
    throw error;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error('Invalid email format.');
    showTestModeError(error);
    throw error;
  }
  if (!orderId) {
    const error = new Error('Order ID is required.');
    showTestModeError(error);
    throw error;
  }

  const amountInMillimes = Math.round(amount * 1000);

  try {
    const response = await fetchWithTimeout(`${KONNECT_API_URL}/payments/init-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KONNECT_API_KEY,
      },
      body: JSON.stringify({
        receiverWalletId: RECEIVER_WALLET_ID,
        amount: amountInMillimes,
        token: 'TND',
        type: 'immediate',
        description: `Order #${orderId}`,
        acceptedPaymentMethods: ['bank_card', 'e-DINAR'],
        firstName,
        lastName,
        email,
        orderId,
        successUrl: `${successUrl}?order_id=${orderId}`,
        failUrl,
        theme,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      const error = new Error(`Payment initialization failed: ${errorDetails.message || 'Unknown error'}`);
      showTestModeError(error);
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      showTestModeError(error);
    }
    throw error;
  }
};

export const verifyPayment = async (paymentRef: string): Promise<boolean> => {
  if (paymentConfig.bypassPayment || paymentConfig.testMode.enabled) {
    return true; // Always return success for test mode
  }

  try {
    const response = await fetch(`${KONNECT_API_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KONNECT_API_KEY,
      },
      body: JSON.stringify({ paymentRef }),
    });

    if (!response.ok) return false;
    
    const result = await response.json();
    return result.status === 'completed';
  } catch (error) {
    console.error('Payment verification failed:', error);
    if (error instanceof Error) {
      showTestModeError(error);
    }
    return false;
  }
};
