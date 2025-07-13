
import { secureGet } from './secureApiService';

// Updated API base URL (now hidden through proxy)
const API_BASE_URL = 'https://draminesaid.com/lucci/api';

export interface OrderDetails {
  id_order: number;
  numero_commande: string;
  date_creation_order: string;
  sous_total_order: number;
  discount_amount_order: number;
  discount_percentage_order: number;
  delivery_cost_order: number;
  total_order: number;
  status_order: string;
  payment_method: string;
  notes_order: string;
  date_livraison_souhaitee: string;
  customer: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    code_postal: string;
    pays: string;
  };
  items: Array<{
    nom_product_snapshot: string;
    reference_product_snapshot: string;
    price_product_snapshot: number;
    size_selected: string;
    color_selected: string;
    quantity_ordered: number;
    subtotal_item: number;
    discount_item: number;
    total_item: number;
  }>;
  delivery_address?: {
    nom_destinataire: string;
    prenom_destinataire: string;
    telephone_destinataire: string;
    adresse_livraison: string;
    ville_livraison: string;
    code_postal_livraison: string;
    pays_livraison: string;
    instructions_livraison: string;
  };
}

// Add interface for AdminOrders compatibility
export interface CompleteOrder extends OrderDetails {}

export const fetchOrderDetails = async (orderId: string): Promise<OrderDetails> => {
  try {
    console.log('Fetching order details for order:', orderId);
    
    const result = await secureGet('order-detail', { id: orderId });
    console.log('Order details result:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch order details');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};
