import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { Plus, Eye, Trash, Edit, Save, DollarSign, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../components/InvoicePDF';
import { InvoicesService } from '../services/invoices.service';
import { TransactionsService, Transaction } from '../services/transactions.service';
import { AuthService } from '../services/auth.service';

interface Invoice {
  id: string;
  numeroFacture: string;
  dateFacture: string;
  dateEcheance: string;
  clientName: string;
  montantHT: number;
  montantTVA: number;
  total: number;
  items: Array<{
    description: string;
    quantite: number;
    prixUnitaire: number;
    taxes: number;
  }>;
  notes?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Finances = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    artist_supplier: '',
    description: '',
    amount: 0,
    category: 'autre',
    status: 'en_attente',
    type: 'dépense'
  });

  useEffect(() => {
    fetchTransactions();
    fetchInvoices();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await TransactionsService.getAllTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Erreur lors du chargement des transactions.');
    }
  };

  const fetchInvoices = async () => {
    try {
      const data = await InvoicesService.getAllInvoices();
      
      // Map API response to frontend model
      const mappedInvoices: Invoice[] = data.map((invoice: any) => ({
        id: invoice.id,
        numeroFacture: invoice.numeroFacture,
        dateFacture: invoice.dateFacture,
        dateEcheance: invoice.dateEcheance,
        clientName: invoice.clientName,
        montantHT: parseFloat(invoice.montantHT),
        montantTVA: parseFloat(invoice.montantTVA),
        total: parseFloat(invoice.total),
        items: invoice.items,
        notes: invoice.notes
      }));
      
      setInvoices(mappedInvoices);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Erreur lors du chargement des factures.');
    }
  };

  const handleAddTransaction = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (isEditMode && selectedTransaction) {
        await TransactionsService.updateTransaction({
          ...newTransaction,
          id: selectedTransaction.id
        } as Transaction);
      } else {
        await TransactionsService.createTransaction(newTransaction as Transaction);
      }
      
      // Refresh the transactions list
      await fetchTransactions();
      
      // Reset form and close modal
      setIsNewTransactionModalOpen(false);
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        artist_supplier: '',
        description: '',
        amount: 0,
        category: 'autre',
        status: 'en_attente',
        type: 'dépense'
      });
      setIsEditMode(false);
      setSelectedTransaction(null);
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError('Une erreur est survenue lors de l\'enregistrement de la transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewTransaction(transaction);
    setIsEditMode(true);
    setIsNewTransactionModalOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await TransactionsService.deleteTransaction(id);
      
      // Refresh the transactions list
      await fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Une erreur est survenue lors de la suppression de la transaction.');
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewInvoiceModalOpen(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await InvoicesService.deleteInvoice(id);
      
      // Refresh the invoices list
      await fetchInvoices();
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setError('Une erreur est survenue lors de la suppression du devis.');
    }
  };

  // Prepare data for charts
  const monthlyData = transactions.reduce((acc: any[], transaction) => {
    const month = format(new Date(transaction.date), 'MMMM');
    const existingMonth = acc.find(item => item.month === month);
    
    const amount = transaction.type === 'dépense' ? -transaction.amount : transaction.amount;
    
    if (existingMonth) {
      existingMonth.montant += amount;
    } else {
      acc.push({ month, montant: amount });
    }
    
    return acc;
  }, []);

  const categoryData = transactions.reduce((acc: any[], transaction) => {
    const existingCategory = acc.find(item => item.name === transaction.category);
    
    if (existingCategory) {
      existingCategory.value += transaction.amount;
    } else {
      acc.push({ name: transaction.category, value: transaction.amount });
    }
    
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Finances</h1>
        <div className="flex gap-2">
          <button 
            className="btn-secondary flex items-center gap-2"
            onClick={() => {
              setIsEditMode(false);
              setSelectedTransaction(null);
              setNewTransaction({
                date: new Date().toISOString().split('T')[0],
                artist_supplier: '',
                description: '',
                amount: 0,
                category: 'autre',
                status: 'en_attente',
                type: 'dépense'
              });
              setIsNewTransactionModalOpen(true);
            }}
          >
            <DollarSign className="h-5 w-5" />
            Nouvelle transaction
          </button>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate('/finances/nouveau-devis')}
          >
            <Plus className="h-5 w-5" />
            Nouveau devis
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Évolution mensuelle</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="montant" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Répartition par catégorie</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Transactions récentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 font-semibold text-gray-400">Date</th>
                <th className="pb-3 font-semibold text-gray-400">Type</th>
                <th className="pb-3 font-semibold text-gray-400">Description</th>
                <th className="pb-3 font-semibold text-gray-400">Montant</th>
                <th className="pb-3 font-semibold text-gray-400">Catégorie</th>
                <th className="pb-3 font-semibold text-gray-400">Statut</th>
                <th className="pb-3 font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-700/50">
                  <td className="py-3">{format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'dépense' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-3">{transaction.description}</td>
                  <td className={`py-3 font-semibold ${
                    transaction.type === 'dépense' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {transaction.type === 'dépense' ? '-' : '+'}{transaction.amount.toLocaleString('fr-FR')} €
                  </td>
                  <td className="py-3">{transaction.category}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'payé' ? 'bg-green-500/20 text-green-300' :
                      transaction.status === 'en_attente' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="p-1 hover:text-white text-gray-400"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-1 hover:text-red-400 text-gray-400"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Devis récents</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 font-semibold text-gray-400">N° Facture</th>
                <th className="pb-3 font-semibold text-gray-400">Client</th>
                <th className="pb-3 font-semibold text-gray-400">Date</th>
                <th className="pb-3 font-semibold text-gray-400">Échéance</th>
                <th className="pb-3 font-semibold text-gray-400">Total</th>
                <th className="pb-3 font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-700/50">
                  <td className="py-3">{invoice.numeroFacture}</td>
                  <td className="py-3">{invoice.clientName}</td>
                  <td className="py-3">{format(new Date(invoice.dateFacture), 'dd/MM/yyyy')}</td>
                  <td className="py-3">{format(new Date(invoice.dateEcheance), 'dd/MM/yyyy')}</td>
                  <td className="py-3 font-semibold">{invoice.total.toLocaleString('fr-FR')} €</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="p-1 hover:text-white text-gray-400"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <PDFDownloadLink
                        document={<InvoicePDF invoice={invoice} />}
                        fileName={`facture_${invoice.numeroFacture}.pdf`}
                        className="p-1 hover:text-white text-gray-400"
                      >
                        {() => <Download className="h-4 w-4" />}
                      </PDFDownloadLink>
                      <button 
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="p-1 hover:text-red-400 text-gray-400"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      <Modal
        isOpen={isNewTransactionModalOpen}
        onClose={() => {
          setIsNewTransactionModalOpen(false);
          setIsEditMode(false);
          setSelectedTransaction(null);
        }}
        title={isEditMode ? "Modifier la transaction" : "Nouvelle transaction"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Date
              </label>
              <input
                type="date"
                className="input w-full"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Type
              </label>
              <select
                className="input w-full"
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'dépense' | 'revenu' })}
              >
                <option value="dépense">Dépense</option>
                <option value="revenu">Revenu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Artiste/Fournisseur
            </label>
            <input
              type="text"
              className="input w-full"
              value={newTransaction.artist_supplier}
              onChange={(e) => setNewTransaction({ ...newTransaction, artist_supplier: e.target.value })}
              placeholder="Nom de l'artiste ou du fournisseur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <input
              type="text"
              className="input w-full"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              placeholder="Description de la transaction"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Montant (€)
              </label>
              <input
                type="number"
                className="input w-full"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Catégorie
              </label>
              <select
                className="input w-full"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              >
                <option value="autre">Autre</option>
                <option value="matériel">Matériel</option>
                <option value="service">Service</option>
                <option value="salaire">Salaire</option>
                <option value="location">Location</option>
                <option value="marketing">Marketing</option>
                <option value="transport">Transport</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Statut
            </label>
            <select
              className="input w-full"
              value={newTransaction.status}
              onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value as 'payé' | 'en_attente' | 'annulé' })}
            >
              <option value="en_attente">En attente</option>
              <option value="payé">Payé</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="btn-secondary"
              onClick={() => {
                setIsNewTransactionModalOpen(false);
                setIsEditMode(false);
                setSelectedTransaction(null);
              }}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleAddTransaction}
              disabled={loading}
            >
              <Save className="h-4 w-4" />
              {loading ? 'Chargement...' : (isEditMode ? "Mettre à jour" : "Enregistrer")}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        isOpen={isViewInvoiceModalOpen}
        onClose={() => {
          setIsViewInvoiceModalOpen(false);
          setSelectedInvoice(null);
        }}
        title={`Devis N° ${selectedInvoice?.numeroFacture}`}
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Client</h3>
                <p className="text-white">{selectedInvoice.clientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Date</h3>
                <p className="text-white">{format(new Date(selectedInvoice.dateFacture), 'dd/MM/yyyy')}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Articles</h3>
              <div className="space-y-2">
                {selectedInvoice.items.map((item, index) => (
                  <div key={index} className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>{item.description}</span>
                      <span>{(item.quantite * item.prixUnitaire).toFixed(2)} €</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.quantite} x {item.prixUnitaire.toFixed(2)} € ({item.taxes}% TVA)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant HT</span>
                  <span>{selectedInvoice.montantHT.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TVA</span>
                  <span>{selectedInvoice.montantTVA.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total TTC</span>
                  <span>{selectedInvoice.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {selectedInvoice.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Notes</h3>
                <p className="text-gray-300">{selectedInvoice.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsViewInvoiceModalOpen(false);
                  setSelectedInvoice(null);
                }}
              >
                Fermer
              </button>
              <PDFDownloadLink
                document={<InvoicePDF invoice={selectedInvoice} />}
                fileName={`facture_${selectedInvoice.numeroFacture}.pdf`}
                className="btn-primary flex items-center gap-2"
              >
                {() => (
                  <>
                    <Download className="h-4 w-4" />
                    Télécharger
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Finances;
