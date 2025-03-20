
import { fetchData } from '../utils/api';

export interface Reservation {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  event_name: string;
  event_id: number;
  places: number;
  unit_price: number;
  total_price: number;
  order_id: string;
  payment_ref: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface ReservationsResponse {
  total: number;
  offset: number;
  limit: number | null;
  data: Reservation[];
}

export class ReservationsService {
  static async getReservations(params = {}) {
    try {
      console.log('Fetching reservations with params:', params);
      const response = await fetchData('/reservations/read.php', params);
      console.log('Reservations response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }

  static async getDistinctEvents() {
    try {
      const response = await this.getReservations();
      if (!response || !response.data) return [];
      
      // Extract distinct event names from all reservations
      const distinctEvents = [...new Set(response.data.map((res: Reservation) => res.event_name))];
      return distinctEvents;
    } catch (error) {
      console.error('Error fetching distinct events:', error);
      return [];
    }
  }

  static async getReservationByOrderId(orderId: string) {
    try {
      console.log('Fetching reservation with order ID:', orderId);
      const response = await this.getReservations({ order_id: orderId });
      console.log('Reservation by order ID response:', response);

      // Add retry logic if the first attempt fails
      if (!response || !response.data || response.data.length === 0) {
        // Wait a short moment and try again
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryResponse = await this.getReservations({ order_id: orderId });
        return retryResponse && retryResponse.data && retryResponse.data.length > 0 
          ? retryResponse.data[0] 
          : null;
      }

      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching reservation by order ID:', error);
      return null;
    }
  }
  
  static async validateReservation(orderId: string) {
    try {
      console.log('Validating reservation:', orderId);
      const reservation = await this.getReservationByOrderId(orderId);
      
      return {
        success: !!reservation,
        reservation: reservation,
        message: reservation 
          ? `Réservation ${orderId} validée` 
          : `Aucune réservation trouvée pour ${orderId}`
      };
    } catch (error) {
      console.error('Error validating reservation:', error);
      return {
        success: false,
        reservation: null,
        message: 'Erreur lors de la validation de la réservation'
      };
    }
  }
}
