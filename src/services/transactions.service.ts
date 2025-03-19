
import { fetchData, createData, updateData, deleteData } from '../utils/api';

const ENDPOINT = '/transactions';

export interface Transaction {
  id?: string;
  date: string;
  description: string;
  montant: number;
  categorie: string;
  statut: 'payé' | 'en_attente' | 'annulé';
  type: 'dépense' | 'revenu';
  artiste?: string;
  user_id?: string;
}

export const TransactionsService = {
  getAllTransactions: async (userId?: string) => {
    const params = userId ? { user_id: userId } : {};
    try {
      const data = await fetchData(`${ENDPOINT}/read.php`, params);
      
      // Check if data is an array before mapping
      if (!Array.isArray(data)) {
        console.error('Expected array of transactions but got:', data);
        return [];
      }
      
      // Map database fields to frontend fields and ensure we have valid data
      return data.map((item: any) => ({
        id: item.id,
        date: item.date || new Date().toISOString().split('T')[0],
        artiste: item.artist_supplier || '',
        description: item.description || '',
        montant: parseFloat(item.amount) || 0,
        categorie: item.category || 'autre',
        statut: item.status || 'en_attente',
        type: item.type || 'dépense'
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  createTransaction: async (transactionData: Transaction) => {
    try {
      // Map frontend fields to database fields
      const apiData = {
        date: transactionData.date,
        description: transactionData.description,
        amount: transactionData.montant,
        category: transactionData.categorie,
        status: transactionData.statut,
        type: transactionData.type,
        artist_supplier: transactionData.artiste || null,
        user_id: transactionData.user_id
      };
      
      return await createData(`${ENDPOINT}/create.php`, apiData);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  updateTransaction: async (transactionData: Transaction) => {
    try {
      if (!transactionData.id) {
        throw new Error('Transaction ID is required for update');
      }
      
      // Map frontend fields to database fields
      const apiData = {
        id: transactionData.id,
        date: transactionData.date,
        description: transactionData.description,
        amount: transactionData.montant,
        category: transactionData.categorie,
        status: transactionData.statut,
        type: transactionData.type,
        artist_supplier: transactionData.artiste || null,
        user_id: transactionData.user_id
      };
      
      return await updateData(`${ENDPOINT}/update.php`, apiData);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  deleteTransaction: async (id: string, userId: string) => {
    if (!id || !userId) {
      throw new Error('Missing required parameters');
    }
    try {
      return await deleteData(`${ENDPOINT}/delete.php?id=${id}&user_id=${userId}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
};
