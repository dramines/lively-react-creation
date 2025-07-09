
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Mail, Phone, MapPin, Calendar, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Customer {
  id_customer: number;
  nom_customer: string;
  prenom_customer: string;
  email_customer: string;
  telephone_customer: string;
  adresse_customer: string;
  ville_customer: string;
  code_postal_customer: string;
  pays_customer: string;
  date_creation_customer: string;
  date_modification_customer: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
}

// Helper function to safely convert to number and handle toFixed
const safeToFixed = (value: any, decimals: number = 2): string => {
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }
  
  const num = parseFloat(String(value));
  if (isNaN(num)) {
    return '0.00';
  }
  
  return num.toFixed(decimals);
};

// Helper function to safely convert to number
const safeToNumber = (value: any): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  const num = parseFloat(String(value));
  return isNaN(num) ? 0 : num;
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Try multiple API endpoints to ensure reliability
      const apiUrls = [
        'https://draminesaid.com/lucci/api/get_all_customers.php',
        'https://www.draminesaid.com/lucci/api/get_all_customers.php',
        'https://draminesaid.com/luccy/api/get_all_customers.php'
      ];
      
      let data = null;
      let success = false;
      
      for (const url of apiUrls) {
        try {
          console.log(`Trying customers API URL: ${url}`);
          const response = await fetch(url);
          const responseData = await response.json();
          console.log(`Customers API response from ${url}:`, responseData);
          
          if (responseData.success) {
            data = responseData.data;
            success = true;
            break;
          }
        } catch (error) {
          console.error(`Error with ${url}:`, error);
          continue;
        }
      }
      
      if (success && data) {
        setCustomers(data);
      } else {
        console.error('All customer API endpoints failed');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.nom_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.prenom_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.ville_customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerCategory = (totalSpent: number) => {
    const spent = safeToNumber(totalSpent);
    if (spent >= 1000) return { label: 'VIP', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    if (spent >= 500) return { label: 'Premium', color: 'bg-gold-100 text-yellow-800 border-yellow-200' };
    if (spent >= 100) return { label: 'Fidèle', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    return { label: 'Nouveau', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  const vipCustomers = customers.filter(c => safeToNumber(c.total_spent) >= 1000);
  const totalRevenue = customers.reduce((acc, c) => acc + safeToNumber(c.total_spent), 0);
  const totalOrders = customers.reduce((acc, c) => acc + safeToNumber(c.total_orders), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Clients
          </h1>
          <p className="text-muted-foreground text-lg">
            Gérez votre base de clients ({customers.length} clients)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clients VIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{vipCustomers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{safeToFixed(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Panier Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">€{safeToFixed(averageOrderValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Liste des clients</CardTitle>
          <CardDescription>
            Tous vos clients enregistrés avec leurs informations détaillées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un client..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtrer</span>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des clients...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun client trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-center">Commandes</TableHead>
                    <TableHead className="text-center">Total Dépensé</TableHead>
                    <TableHead>Dernière Commande</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    const category = getCustomerCategory(customer.total_spent || 0);
                    return (
                      <TableRow key={customer.id_customer}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {customer.nom_customer.charAt(0)}{customer.prenom_customer.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {customer.nom_customer} {customer.prenom_customer}
                              </div>
                              <div className="text-sm text-gray-500">
                                Inscrit le {new Date(customer.date_creation_customer).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="mr-2 h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-48">{customer.email_customer}</span>
                            </div>
                            {customer.telephone_customer && (
                              <div className="flex items-center text-sm">
                                <Phone className="mr-2 h-3 w-3 text-gray-400" />
                                {customer.telephone_customer}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start text-sm">
                            <MapPin className="mr-2 h-3 w-3 text-gray-400 mt-1" />
                            <div>
                              <div className="truncate max-w-32">{customer.adresse_customer}</div>
                              <div className="text-gray-500">
                                {customer.code_postal_customer} {customer.ville_customer}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={category.color} variant="outline">
                            {category.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {safeToNumber(customer.total_orders)}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          €{safeToFixed(customer.total_spent)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-sm">
                            {customer.last_order_date ? (
                              <>
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(customer.last_order_date).toLocaleDateString('fr-FR')}
                              </>
                            ) : (
                              <span className="text-gray-500">Aucune</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <ShoppingBag className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
