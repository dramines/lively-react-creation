
import { fetchData, createData, updateData, deleteData } from '../utils/api';

const ENDPOINT = '/invoices';

export interface InvoiceItem {
  description: string;
  quantite: number;
  prixUnitaire: number;
  taxes: number;
}

export interface InvoiceDto {
  id?: string;
  numeroFacture: string;
  clientName: string;
  clientAddress?: string;
  clientPhone?: string;
  clientTaxNumber?: string;
  dateFacture: string;
  dateEcheance: string;
  items: InvoiceItem[];
  montantHT: number;
  montantTVA: number;
  total: number;
  notes?: string;
  user_id?: string;
  companyName?: string;
  companyTaxNumber?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

export const InvoicesService = {
  getAllInvoices: async (userId?: string) => {
    try {
      const params = userId ? { user_id: userId } : {};
      const data = await fetchData(`${ENDPOINT}/read.php`, params);
      
      // Map database fields to frontend fields
      return data.map((item: any) => ({
        id: item.id,
        numeroFacture: item.invoice_number,
        clientName: item.client_name,
        clientAddress: item.client_address,
        clientPhone: item.client_phone,
        clientTaxNumber: item.client_tax_number,
        dateFacture: item.issue_date,
        dateEcheance: item.due_date,
        items: Array.isArray(item.items) ? item.items : [],
        montantHT: parseFloat(item.subtotal) || 0,
        montantTVA: parseFloat(item.tax_amount) || 0,
        total: parseFloat(item.total_amount) || 0,
        notes: item.notes,
        user_id: item.user_id,
        companyName: 'Vilart Events',
        companyTaxNumber: item.company_tax_number || '1865480/V/A/M/000',
        companyAddress: item.company_address || 'A3, Imm La Coupole, rue Windermere, Lac 1, Tunis 1053',
        companyPhone: item.company_phone || '+216 54 754 704',
        companyEmail: item.company_email || 'vilartprod@gmail.com'
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  getInvoice: async (id: string) => {
    try {
      const data = await fetchData(`${ENDPOINT}/read_one.php`, { id });
      
      // Safely handle potentially missing data
      if (!data) {
        throw new Error('No invoice data returned');
      }
      
      // Map database fields to frontend fields
      return {
        id: data.id,
        numeroFacture: data.invoice_number,
        clientName: data.client_name,
        clientAddress: data.client_address,
        clientPhone: data.client_phone,
        clientTaxNumber: data.client_tax_number,
        dateFacture: data.issue_date,
        dateEcheance: data.due_date,
        items: Array.isArray(data.items) ? data.items : [],
        montantHT: parseFloat(data.subtotal) || 0,
        montantTVA: parseFloat(data.tax_amount) || 0,
        total: parseFloat(data.total_amount) || 0,
        notes: data.notes,
        user_id: data.user_id,
        companyName: 'Vilart Events',
        companyTaxNumber: data.company_tax_number || '1865480/V/A/M/000',
        companyAddress: data.company_address || 'A3, Imm La Coupole, rue Windermere, Lac 1, Tunis 1053',
        companyPhone: data.company_phone || '+216 54 754 704',
        companyEmail: data.company_email || 'vilartprod@gmail.com'
      };
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  createInvoice: async (invoiceData: InvoiceDto) => {
    try {
      // Send the frontend data directly without mapping
      // Backend will handle the field mapping
      return await createData(`${ENDPOINT}/create.php`, invoiceData);
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoice: async (invoiceData: InvoiceDto) => {
    try {
      // Send the frontend data directly without mapping
      // Backend will handle the field mapping
      return await updateData(`${ENDPOINT}/update.php`, invoiceData);
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  deleteInvoice: async (id: string, userId?: string) => {
    try {
      let endpoint = `${ENDPOINT}/delete.php?id=${id}`;
      if (userId) {
        endpoint += `&user_id=${userId}`;
      }
      return await deleteData(endpoint);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
};
