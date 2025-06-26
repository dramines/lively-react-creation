
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Users, UserPlus, ShoppingCart, Eye, Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Customer {
  id_customer: number;
  prenom_customer: string;
  nom_customer: string;
  email_customer: string;
  telephone_customer: string;
  adresse_customer: string;
  ville_customer: string;
  code_postal_customer: string;
  date_creation_customer: string;
  total_orders?: number;
  total_spent?: number;
  last_order_date?: string;
}

const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await axios.get('https://draminesaid.com/lucci/api/get_all_customers.php');
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch customers');
  }
  return response.data.data;
};

const AdminClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_creation_customer');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    refetchInterval: 30000,
  });

  const filteredCustomers = customers?.filter(customer =>
    customer.nom_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.prenom_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email_customer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aValue = a[sortBy as keyof Customer] || '';
    const bValue = b[sortBy as keyof Customer] || '';
    
    if (sortOrder === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  // Calculate stats
  const totalCustomers = customers?.length || 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newThisMonth = customers?.filter(customer => {
    const customerDate = new Date(customer.date_creation_customer);
    return customerDate.getMonth() === currentMonth && customerDate.getFullYear() === currentYear;
  }).length || 0;

  const totalSpent = customers?.reduce((sum, customer) => sum + (customer.total_spent || 0), 0) || 0;
  const averageBasket = totalCustomers > 0 ? totalSpent / totalCustomers : 0;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600">Erreur lors du chargement des clients</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-playfair font-bold" style={{ color: '#212937' }}>
                  <Users className="mr-3 h-8 w-8 inline" style={{ color: '#212937' }} />
                  Gestion des Clients
                </h1>
                <p className="text-gray-600 mt-2">
                  Gérez votre base de clients LUCCI BY E.Y
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card style={{ backgroundColor: '#212937' }} className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Clients</CardTitle>
                <Users className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{totalCustomers}</div>
                <p className="text-xs text-gray-300">Clients enregistrés</p>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: '#212937' }} className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Nouveaux ce Mois</CardTitle>
                <UserPlus className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{newThisMonth}</div>
                <p className="text-xs text-gray-300">Inscriptions récentes</p>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: '#212937' }} className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Panier Moyen</CardTitle>
                <ShoppingCart className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">€{averageBasket.toFixed(2)}</div>
                <p className="text-xs text-gray-300">Dépense moyenne</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white border" style={{ borderColor: '#212937' }}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par nom, prénom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border" 
                      style={{ borderColor: '#212937' }}
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border" style={{ borderColor: '#212937' }}>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_creation_customer">Date d'inscription</SelectItem>
                    <SelectItem value="nom_customer">Nom</SelectItem>
                    <SelectItem value="email_customer">Email</SelectItem>
                    <SelectItem value="total_spent">Montant dépensé</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                  <SelectTrigger className="w-32 border" style={{ borderColor: '#212937' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Décroissant</SelectItem>
                    <SelectItem value="asc">Croissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card className="bg-white border" style={{ borderColor: '#212937' }}>
            <CardHeader>
              <CardTitle style={{ color: '#212937' }}>
                Liste des Clients ({sortedCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#212937' }}>
                      <th className="text-left p-4 font-medium" style={{ color: '#212937' }}>Client</th>
                      <th className="text-left p-4 font-medium" style={{ color: '#212937' }}>Contact</th>
                      <th className="text-left p-4 font-medium" style={{ color: '#212937' }}>Adresse</th>
                      <th className="text-left p-4 font-medium" style={{ color: '#212937' }}>Inscription</th>
                      <th className="text-left p-4 font-medium" style={{ color: '#212937' }}>Commandes</th>
                      <th className="text-left p-4 font-medium" style={{ color: '#212937' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCustomers.map((customer) => (
                      <tr key={customer.id_customer} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-semibold" style={{ color: '#212937' }}>
                              {customer.prenom_customer} {customer.nom_customer}
                            </div>
                            <div className="text-sm text-gray-600">ID: {customer.id_customer}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="text-gray-900">{customer.email_customer}</div>
                            <div className="text-gray-600">{customer.telephone_customer}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600">
                            {customer.adresse_customer}<br />
                            {customer.code_postal_customer} {customer.ville_customer}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600">
                            {new Date(customer.date_creation_customer).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-semibold text-green-600">
                              {customer.total_orders || 0} commande(s)
                            </div>
                            <div className="text-gray-600">
                              €{(customer.total_spent || 0).toFixed(2)}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                              className="hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminClients;
