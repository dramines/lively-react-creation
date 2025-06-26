import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import { DateFilter } from '@/components/admin/filters/DateFilter';
import { useTableSort } from '@/hooks/useTableSort';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Search, 
  Filter, 
  Download,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

const AdminClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://draminesaid.com/lucci/api/get_all_customers.php');
      const result = await response.json();
      
      if (result.success) {
        setClients(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les clients',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client: any) => {
    const matchesSearch = client.nom_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ville_customer.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const clientDate = new Date(client.date_creation_customer);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = clientDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = clientDate >= weekAgo && clientDate <= today;
          break;
        case 'month':
          matchesDate = clientDate.getMonth() === today.getMonth() && 
                       clientDate.getFullYear() === today.getFullYear();
          break;
        case 'year':
          matchesDate = clientDate.getFullYear() === today.getFullYear();
          break;
      }
    }

    return matchesSearch && matchesDate;
  });

  const { sortedData: sortedClients, sortConfig, requestSort } = useTableSort(filteredClients, 'date_creation_customer');

  // Calculate stats
  const statsData = {
    totalClients: clients.length,
    newThisMonth: clients.filter((c: any) => {
      const clientDate = new Date(c.date_creation_customer);
      const today = new Date();
      return clientDate.getMonth() === today.getMonth() && clientDate.getFullYear() === today.getFullYear();
    }).length,
    averageSpent: clients.length > 0 ? clients.reduce((sum: number, c: any) => sum + parseFloat(c.total_spent || 0), 0) / clients.length : 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-playfair font-bold text-gray-900">
                  Gestion des Clients
                </h1>
                <p className="text-gray-600 mt-1">
                  Base de données clients et informations de contact
                </p>
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">
                  Total Clients
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{statsData.totalClients}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">
                  Nouveaux ce Mois
                </CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{statsData.newThisMonth}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">
                  Panier Moyen
                </CardTitle>
                <Mail className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">€{statsData.averageSpent.toFixed(0)}</div>
                <p className="text-xs text-orange-600">
                  Par client
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Clients Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle className="font-playfair text-gray-900">
                    Liste des Clients
                  </CardTitle>
                  <CardDescription>
                    Informations de contact et historique des achats (cliquez sur les en-têtes pour trier)
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? 'bg-gray-100' : ''}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {showFilters && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <DateFilter
                    value={dateFilter}
                    onValueChange={setDateFilter}
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTableHead 
                        sortKey="nom_customer" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Client
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="email_customer" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Contact
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="ville_customer" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Adresse
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="total_orders" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Commandes
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="total_spent" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Total Dépensé
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="last_order_date" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Dernière Commande
                      </SortableTableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedClients.map((client: any) => {
                      return (
                        <TableRow key={client.id_customer}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {client.prenom_customer} {client.nom_customer}
                              </div>
                              <div className="text-sm text-gray-500">
                                Client depuis {new Date(client.date_creation_customer).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="mr-2 h-3 w-3 text-gray-400" />
                                {client.email_customer}
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="mr-2 h-3 w-3 text-gray-400" />
                                {client.telephone_customer}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start text-sm">
                              <MapPin className="mr-2 h-3 w-3 text-gray-400 mt-1" />
                              <div>
                                <div>{client.adresse_customer}</div>
                                <div className="text-gray-500">
                                  {client.code_postal_customer} {client.ville_customer}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {client.total_orders}
                          </TableCell>
                          <TableCell className="font-semibold">
                            €{parseFloat(client.total_spent || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {client.last_order_date ? new Date(client.last_order_date).toLocaleDateString('fr-FR') : 'Aucune'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminClients;
