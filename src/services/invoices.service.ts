
import { getData, postData, putData } from './api';
import { Invoice } from '../types';

// This will match the API endpoints
export class InvoicesService {
  static async getAllInvoices(): Promise<Invoice[]> {
    const response = await getData('invoices/read.php');
    return response.records || [];
  }

  static async getInvoiceById(id: string): Promise<Invoice> {
    const response = await getData(`invoices/read_one.php?id=${id}`);
    return response;
  }

  static async createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    const response = await postData('invoices/create.php', invoice);
    return response;
  }

  static async updateInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    const response = await putData('invoices/update.php', invoice);
    return response;
  }

  static async deleteInvoice(id: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices/delete.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}
