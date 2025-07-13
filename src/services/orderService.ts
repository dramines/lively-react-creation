
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
import { securePost } from './secureApiService';

// Updated API base URL (now hidden through proxy)
const API_BASE_URL = 'https://draminesaid.com/lucci/api';

export const submitOrder = async (orderData: CompleteOrderRequest, language?: string): Promise<OrderResponse> => {
  try {
    console.log('Submitting order...');
    
    const requestData = {
      ...orderData,
      language: language || 'fr'
    };
    
    const result = await securePost('submit-order', requestData);
    console.log('Order submission result:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Order submission failed');
    }
    
    return result;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw error;
  }
};

// Alternative submission method (fallback)
const submitOrderWithFormData = async (orderData: CompleteOrderRequest, language?: string): Promise<OrderResponse> => {
  try {
    const requestData = {
      ...orderData,
      language: language || 'fr'
    };
    
    console.log('Retrying with alternative method...');
    const result = await securePost('submit-order', requestData);
    
    if (!result.success) {
      throw new Error(result.message || 'Order submission failed');
    }
    
    return result;
  } catch (error) {
    console.error('Alternative method error:', error);
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
    console.log('Confirming payment for order:', orderId);
    
    const result = await securePost('submit-order', {
      payment_ref: paymentRef,
      order_id: orderId,
      action: 'confirm_payment'
    });
    
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
