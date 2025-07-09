
import axios from 'axios';

export interface OrderDetails {
  id_order: number;
  numero_commande: string;
  sous_total_order: number;
  discount_amount_order: number;
  discount_percentage_order: number;
  delivery_cost_order: number;
  total_order: number;
  status_order: string;
  payment_status: string;
  payment_method: string;
  date_creation_order: string;
  date_confirmation_order: string;
  date_livraison_order: string;
  date_livraison_souhaitee: string;
  notes_order: string;
  customer: {
    nom_customer: string;
    prenom_customer: string;
    email_customer: string;
    telephone_customer: string;
    adresse_customer: string;
    ville_customer: string;
    code_postal_customer: string;
    pays_customer: string;
  };
  items: Array<{
    id_order_item: number;
    nom_product_snapshot: string;
    reference_product_snapshot: string;
    price_product_snapshot: number;
    size_selected: string;
    color_selected: string;
    quantity_ordered: number;
    subtotal_item: number;
    total_item: number;
    img_product?: string;
  }>;
  delivery_address?: {
    nom_destinataire: string;
    prenom_destininataire: string;
    adresse_livraison: string;
    ville_livraison: string;
    code_postal_livraison: string;
    pays_livraison: string;
    instructions_livraison: string;
  };
}

export const fetchOrderDetails = async (orderId: string): Promise<OrderDetails> => {
  try {
    const apiUrls = [
      'https://draminesaid.com/lucci/api/get_single_order.php',
      'https://www.draminesaid.com/lucci/api/get_single_order.php',
      'https://www.draminesaid.com/luccy/api/get_single_order.php'
    ];
    
    let data = null;
    let success = false;
    
    for (const url of apiUrls) {
      try {
        console.log(`Trying order details API URL: ${url}`);
        const response = await axios.get(`${url}?id=${orderId}`);
        console.log(`Order details API response:`, response.data);
        
        if (response.data.success) {
          data = response.data.data;
          success = true;
          break;
        }
      } catch (error) {
        console.error(`Error with ${url}:`, error);
        continue;
      }
    }
    
    if (!success || !data) {
      throw new Error('Failed to fetch order details');
    }
    
    return {
      ...data.order,
      items: (data.items || []).map((item: any) => ({
        ...item,
        size_selected: item.size_selected || '',
        color_selected: item.color_selected || ''
      })),
      delivery_address: data.delivery_address || null
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};
