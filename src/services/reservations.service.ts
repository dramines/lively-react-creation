
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
      return await fetchData('/reservations/read.php', params);
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
      const response = await this.getReservations({ order_id: orderId });
      return response && response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error fetching reservation by order ID:', error);
      return null;
    }
  }
}
