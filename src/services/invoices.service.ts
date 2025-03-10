
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
  dateFacture: string;
  dateEcheance: string;
  items: InvoiceItem[];
  montantHT: number;
  montantTVA: number;
  total: number;
  notes?: string;
  user_id?: string;
}

export const InvoicesService = {
  getAllInvoices: async (userId?: string) => {
    const params = userId ? { user_id: userId } : {};
    try {
      const data = await fetchData(`${ENDPOINT}/read.php`, params);
      
      // Map database fields to frontend fields
      return data.map((item: any) => ({
        id: item.id,
        numeroFacture: item.invoice_number,
        clientName: item.client_name,
        dateFacture: item.issue_date,
        dateEcheance: item.due_date,
        items: item.items || [],
        montantHT: parseFloat(item.subtotal),
        montantTVA: parseFloat(item.tax_amount),
        total: parseFloat(item.total_amount),
        notes: item.notes,
        user_id: item.user_id
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  getInvoice: async (id: string) => {
    try {
      const data = await fetchData(`${ENDPOINT}/read_one.php`, { id });
      
      // Map database fields to frontend fields
      return {
        id: data.id,
        numeroFacture: data.invoice_number,
        clientName: data.client_name,
        dateFacture: data.issue_date,
        dateEcheance: data.due_date,
        items: data.items || [],
        montantHT: parseFloat(data.subtotal),
        montantTVA: parseFloat(data.tax_amount),
        total: parseFloat(data.total_amount),
        notes: data.notes,
        user_id: data.user_id
      };
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  createInvoice: async (invoiceData: InvoiceDto) => {
    try {
      // Map frontend fields to database fields
      const apiData = {
        numeroFacture: invoiceData.numeroFacture,
        clientName: invoiceData.clientName,
        dateFacture: invoiceData.dateFacture,
        dateEcheance: invoiceData.dateEcheance,
        items: invoiceData.items,
        montantHT: invoiceData.montantHT,
        montantTVA: invoiceData.montantTVA,
        total: invoiceData.total,
        notes: invoiceData.notes,
        user_id: invoiceData.user_id
      };
      
      return await createData(`${ENDPOINT}/create.php`, apiData);
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoice: async (invoiceData: InvoiceDto) => {
    try {
      return await updateData(`${ENDPOINT}/update.php`, invoiceData);
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  deleteInvoice: async (id: string, userId?: string) => {
    const data = { id, user_id: userId };
    return createData(`${ENDPOINT}/delete.php`, data);
  }
};
