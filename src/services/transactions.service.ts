
import { getData, postData, putData } from './api';
import { Transaction as TransactionType } from '../types';

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

export class TransactionsService {
  static async getAllTransactions(): Promise<Transaction[]> {
    const response = await getData('transactions/read.php');
    return response.records || [];
  }

  static async getTransactionById(id: string): Promise<Transaction> {
    const response = await getData(`transactions/read_one.php?id=${id}`);
    return response;
  }

  static async createTransaction(transaction: Transaction): Promise<Transaction> {
    const response = await postData('transactions/create.php', transaction);
    return response;
  }

  static async updateTransaction(transaction: Transaction): Promise<Transaction> {
    const response = await putData('transactions/update.php', transaction);
    return response;
  }

  static async deleteTransaction(id: string): Promise<any> {
    // Use standard fetch for delete to have better control over the request
    const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions/delete.php`, {
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
