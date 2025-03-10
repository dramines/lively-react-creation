import { useState, useEffect } from 'react';
import { Plus, Minus, Save, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { InvoicesService } from '../services/invoices.service';
import { AuthService } from '../services/auth.service';

interface InvoiceItem {
  description: string;
  quantite: number;
  prixUnitaire: number;
  taxes: number;
}

const NouveauDevis = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InvoiceItem[]>([{
    description: '',
    quantite: 1,
    prixUnitaire: 0,
    taxes: 19
  }]);
  const [formData, setFormData] = useState({
    numeroFacture: '',
    dateFacture: format(new Date(), 'yyyy-MM-dd'),
    dateEcheance: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    clientName: '',
    notes: ''
  });
  const [totals, setTotals] = useState({
    montantHT: 0,
    montantTVA: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    generateNextInvoiceNumber();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [items]);

  const generateNextInvoiceNumber = async () => {
    try {
      // Get the latest invoices from the API
      const invoices = await InvoicesService.getAllInvoices();
      
      // Find the highest invoice number
      let highestNumber = 0;
      invoices.forEach((invoice: any) => {
        const invoiceNum = parseInt(invoice.numeroFacture.replace(/\D/g, ''));
        if (!isNaN(invoiceNum) && invoiceNum > highestNumber) {
          highestNumber = invoiceNum;
        }
      });
      
      // Set the next invoice number
      const nextNumber = String(highestNumber + 1).padStart(3, '0');
      
      setFormData(prev => ({
        ...prev,
        numeroFacture: nextNumber
      }));
    } catch (error) {
      console.error('Error generating invoice number:', error);
      // Fallback to a default if API fails
      setFormData(prev => ({
        ...prev,
        numeroFacture: '001'
      }));
    }
  };

  const calculateTotals = () => {
    const montantHT = items.reduce((sum, item) => 
      sum + (item.quantite * item.prixUnitaire), 0
    );
    
    const montantTVA = items.reduce((sum, item) => 
      sum + (item.quantite * item.prixUnitaire * (item.taxes / 100)), 0
    );

    setTotals({
      montantHT,
      montantTVA,
      total: montantHT + montantTVA + 1 // Adding 1€ for "Timbre Fiscal"
    });
  };

  const handleAddItem = () => {
    setItems([...items, {
      description: '',
      quantite: 1,
      prixUnitaire: 0,
      taxes: 19
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: typeof value === 'string' && field !== 'description' ? parseFloat(value) || 0 : value
    };
    setItems(newItems);
  };

  const handleSaveInvoice = async () => {
    setLoading(true);
    setError('');
    
    try {
      const currentUser = AuthService.getCurrentUser();
      
      const invoiceData = {
        ...formData,
        ...totals,
        items,
        user_id: currentUser?.id
      };
      
      await InvoicesService.createInvoice(invoiceData);
      navigate('/finances');
    } catch (err) {
      console.error('Error saving invoice:', err);
      setError('Une erreur est survenue lors de l\'enregistrement du devis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/finances')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-white">Nouveau devis</h1>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Numéro de facture
            </label>
            <input
              type="text"
              className="input"
              value={formData.numeroFacture}
              onChange={(e) => setFormData({ ...formData, numeroFacture: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Client
            </label>
            <input
              type="text"
              className="input"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Nom du client"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Date de facturation
            </label>
            <input
              type="date"
              className="input"
              value={formData.dateFacture}
              onChange={(e) => setFormData({ ...formData, dateFacture: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Date d'échéance
            </label>
            <input
              type="date"
              className="input"
              value={formData.dateEcheance}
              onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Articles</h2>
            <button
              onClick={handleAddItem}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un article
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Description de l'article"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={item.quantite}
                    onChange={(e) => handleItemChange(index, 'quantite', e.target.value)}
                    min="1"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Prix unitaire
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={item.prixUnitaire}
                    onChange={(e) => handleItemChange(index, 'prixUnitaire', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    TVA (%)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={item.taxes}
                    onChange={(e) => handleItemChange(index, 'taxes', e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 pt-7">
                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-700 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Montant HT</span>
                <span>{totals.montantHT.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TVA</span>
                <span>{totals.montantTVA.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Timbre Fiscal</span>
                <span>1.00 €</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                <span>Total TTC</span>
                <span>{totals.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Notes
            </label>
            <textarea
              className="input h-24 resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes ou conditions particulières..."
            />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => navigate('/finances')}
              className="btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              onClick={handleSaveInvoice}
              className="btn-primary flex items-center gap-2"
              disabled={loading}
            >
              <Save className="h-5 w-5" />
              {loading ? 'Chargement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NouveauDevis;
