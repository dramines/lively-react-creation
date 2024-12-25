import axios from 'axios';

interface StockUpdatePayload {
  id_product: number;
  xs_size?: number;
  s_size?: number;
  m_size?: number;
  l_size?: number;
  xl_size?: number;
  xxl_size?: number;
}

export const updateProductStock = async (payload: StockUpdatePayload): Promise<void> => {
  try {
    const response = await axios.post(
      'https://respizenmedical.com/fiori/reduice_product.php',
      payload
    );

    if (response.data.status === 'error') {
      throw new Error(response.data.message);
    }

    console.log('Stock updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const updateStockForCartItems = async (cartItems: any[]): Promise<void> => {
  try {
    const stockUpdates = cartItems.map(item => {
      const payload: StockUpdatePayload = {
        id_product: item.id,
      };

      // Only include sizes that were actually purchased
      if (item.size) {
        switch (item.size.toLowerCase()) {
          case 'xs':
            payload.xs_size = item.quantity;
            break;
          case 's':
            payload.s_size = item.quantity;
            break;
          case 'm':
            payload.m_size = item.quantity;
            break;
          case 'l':
            payload.l_size = item.quantity;
            break;
          case 'xl':
            payload.xl_size = item.quantity;
            break;
          case 'xxl':
            payload.xxl_size = item.quantity;
            break;
        }
      }

      return updateProductStock(payload);
    });

    await Promise.all(stockUpdates);
    console.log('All stock updates completed successfully');
  } catch (error) {
    console.error('Error updating stock for cart items:', error);
    throw error;
  }
};