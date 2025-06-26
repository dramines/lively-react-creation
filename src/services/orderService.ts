
export interface CustomerData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
}

export interface OrderItem {
  product_id?: number;
  nom_product: string;
  reference: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
  discount?: number;
}

export interface DeliveryAddress {
  nom: string;
  prenom: string;
  telephone?: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
  instructions?: string;
}

export interface OrderData {
  items: OrderItem[];
  sous_total?: number;
  discount_amount?: number;
  discount_percentage?: number;
  delivery_cost?: number;
  total_order: number;
  status?: string;
  payment_method?: string;
  notes?: string;
  delivery_address?: DeliveryAddress;
}

export interface CompleteOrderRequest {
  customer: CustomerData;
  order: OrderData;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order_id?: number;
  customer_id?: number;
  order_number?: string;
}

import { paymentConfig } from '@/config/paymentConfig';

// Updated API base URL
const API_BASE_URL = 'https://draminesaid.com/lucci/api';

export const submitOrder = async (orderData: CompleteOrderRequest, language?: string): Promise<OrderResponse> => {
  try {
    console.log('Submitting order to:', `${API_BASE_URL}/insert_complete_order.php`);
    console.log('Order data:', orderData);
    
    const requestData = {
      ...orderData,
      language: language || 'fr'
    };
    
    // Log the exact JSON being sent
    const jsonPayload = JSON.stringify(requestData);
    console.log('JSON payload being sent:', jsonPayload);
    console.log('JSON payload length:', jsonPayload.length);
    
    const response = await fetch(`${API_BASE_URL}/insert_complete_order.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Removed 'Cache-Control': 'no-cache' to fix CORS issue
      },
      body: jsonPayload,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response error:', errorText);
      
      // Try to parse as JSON first, fallback to text
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || errorText}`);
    }

    const result = await response.json();
    console.log('Order submission result:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Order submission failed');
    }
    
    return result;
  } catch (error) {
    console.error('Error submitting order:', error);
    
    // If it's a "No input data received" error, try a different approach
    if (error instanceof Error && error.message.includes('No input data received')) {
      console.log('Attempting retry with form data approach...');
      return await submitOrderWithFormData(orderData, language);
    }
    
    throw error;
  }
};

// Alternative submission method using FormData
const submitOrderWithFormData = async (orderData: CompleteOrderRequest, language?: string): Promise<OrderResponse> => {
  try {
    const requestData = {
      ...orderData,
      language: language || 'fr'
    };
    
    const formData = new FormData();
    formData.append('data', JSON.stringify(requestData));
    
    console.log('Retrying with FormData approach...');
    
    const response = await fetch(`${API_BASE_URL}/insert_complete_order.php`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FormData retry failed:', errorText);
      throw new Error(`FormData retry failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('FormData retry result:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Order submission failed');
    }
    
    return result;
  } catch (error) {
    console.error('FormData retry error:', error);
    throw error;
  }
};

export const submitOrderWithPayment = async (
  orderData: CompleteOrderRequest,
  paymentMethod: 'card' | 'cash_on_delivery' | 'test',
  language?: string
): Promise<OrderResponse> => {
  try {
    // For cash on delivery or test mode, submit order directly
    if (paymentMethod === 'cash_on_delivery' || paymentMethod === 'test' || paymentConfig.bypassPayment) {
      const orderDataWithStatus = {
        ...orderData,
        order: {
          ...orderData.order,
          status: paymentMethod === 'cash_on_delivery' ? 'pending_cash_payment' : 'confirmed',
          payment_method: paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Test Payment'
        }
      };
      
      return await submitOrder(orderDataWithStatus, language);
    }
    
    // For card payments, we'll submit the order but it will be pending until payment confirmation
    const orderDataWithPending = {
      ...orderData,
      order: {
        ...orderData.order,
        status: 'pending',
        payment_method: 'Konnect'
      }
    };
    
    return await submitOrder(orderDataWithPending, language);
  } catch (error) {
    console.error('Error submitting order with payment:', error);
    throw error;
  }
};

export const confirmPaymentAndUpdateOrder = async (
  orderId: string,
  paymentRef: string
): Promise<OrderResponse> => {
  try {
    console.log('Confirming payment for order:', orderId, 'with payment ref:', paymentRef);
    
    const response = await fetch(`${API_BASE_URL}/insert_complete_order.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_ref: paymentRef,
        order_id: orderId,
        action: 'confirm_payment'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Payment confirmation error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Payment confirmation result:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Payment confirmation failed');
    }
    
    return result;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};
