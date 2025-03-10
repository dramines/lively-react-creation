
import { fetchData, createData, updateData } from '../utils/api';
import { AuthService } from './auth.service';
import { toast } from 'react-hot-toast';
import { Transaction } from '../types';

const ENDPOINT = '/transactions';

// Create a local Transaction type that matches the backend API
export interface Transaction {
  id?: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: 'payé' | 'en_attente' | 'annulé';
  type: 'dépense' | 'revenu';
  artist_supplier?: string;
  user_id?: string;
}

// Utility function to convert between API and frontend models
const mapApiToFrontend = (data: any): Transaction => ({
  id: data.id,
  date: data.date,
  description: data.description,
  amount: parseFloat(data.montant || data.amount || 0),
  category: data.categorie || data.category || 'autre',
  status: data.statut || data.status || 'en_attente',
  type: data.type || 'dépense',
  artist_supplier: data.artiste || data.artist_supplier || '',
  user_id: data.user_id
});

const mapFrontendToApi = (data: Transaction): any => ({
  id: data.id,
  date: data.date,
  description: data.description,
  montant: data.amount,
  categorie: data.category,
  statut: data.status,
  type: data.type,
  artiste: data.artist_supplier,
  user_id: data.user_id
});

export const TransactionsService = {
  getAllTransactions: async () => {
    const currentUser = AuthService.getCurrentUser();
    const userIdToUse = currentUser?.id;
    const params = userIdToUse ? { user_id: userIdToUse } : {};
    
    try {
      const data = await fetchData(`${ENDPOINT}/read.php`, params);
      
      if (!Array.isArray(data)) {
        console.error('Invalid response format from transactions API:', data);
        return [];
      }
      
      return data.map(mapApiToFrontend);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
      throw error;
    }
  },

  getTransaction: async (id: string) => {
    try {
      const data = await fetchData(`${ENDPOINT}/read_one.php`, { id });
      return mapApiToFrontend(data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Failed to load transaction details');
      throw error;
    }
  },

  createTransaction: async (transactionData: Transaction) => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const dataToSend = {
        ...mapFrontendToApi(transactionData),
        user_id: transactionData.user_id || currentUser?.id
      };
      
      const response = await createData(`${ENDPOINT}/create.php`, dataToSend);
      toast.success('Transaction created successfully');
      return response;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Failed to create transaction');
      throw error;
    }
  },

  updateTransaction: async (transactionData: Transaction) => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const dataToSend = {
        ...mapFrontendToApi(transactionData),
        user_id: transactionData.user_id || currentUser?.id
      };
      
      const response = await updateData(`${ENDPOINT}/update.php`, dataToSend);
      toast.success('Transaction updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const data = { 
        id, 
        user_id: currentUser?.id 
      };
      
      const response = await createData(`${ENDPOINT}/delete.php`, data);
      toast.success('Transaction deleted successfully');
      return response;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
      throw error;
    }
  }
};
