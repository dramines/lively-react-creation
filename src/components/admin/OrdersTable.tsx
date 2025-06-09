
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Eye, Package, Search, Filter, Download, Clock, CheckCircle, Truck, Package2 } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  email: string;
  bookTitle: string;
  quantity: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
}

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      bookTitle: 'Les Aventures de Sophie',
      quantity: 2,
      total: 29.98,
      status: 'pending',
      orderDate: '2024-01-15',
      shippingAddress: '123 Rue de la Paix, 75001 Paris',
    },
    {
      id: 'ORD-002',
      customerName: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      bookTitle: 'Conte de Fées Magiques',
      quantity: 1,
      total: 14.99,
      status: 'processing',
      orderDate: '2024-01-14',
      shippingAddress: '456 Avenue des Champs, 69000 Lyon',
    },
    {
      id: 'ORD-003',
      customerName: 'Claire Bernard',
      email: 'claire.bernard@email.com',
      bookTitle: 'Histoires du Soir',
      quantity: 3,
      total: 44.97,
      status: 'shipped',
      orderDate: '2024-01-13',
      shippingAddress: '789 Boulevard Victor Hugo, 13000 Marseille',
    },
    {
      id: 'ORD-004',
      customerName: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      bookTitle: 'Aventures Fantastiques',
      quantity: 1,
      total: 18.50,
      status: 'delivered',
      orderDate: '2024-01-12',
      shippingAddress: '321 Rue de Rivoli, 75004 Paris',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'processing': return <Package2 className="h-3 w-3" />;
      case 'shipped': return <Truck className="h-3 w-3" />;
      case 'delivered': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'Traitement';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportOrders = () => {
    console.log('Exporting orders...');
    // Here you would implement actual export functionality
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-orange-500" />
            Commandes de Livres
          </CardTitle>
          <Button onClick={exportOrders} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par client, ID ou livre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="processing">Traitement</SelectItem>
              <SelectItem value="shipped">Expédié</SelectItem>
              <SelectItem value="delivered">Livré</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">ID Commande</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Livre</TableHead>
                <TableHead className="font-semibold">Quantité</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <TableRow key={order.id} className="hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <TableCell className="font-medium text-orange-600">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.bookTitle}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.quantity}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-green-600">€{order.total.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1 border`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(order.orderDate).toLocaleDateString('fr-FR')}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="processing">Traitement</SelectItem>
                          <SelectItem value="shipped">Expédié</SelectItem>
                          <SelectItem value="delivered">Livré</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="hover-scale">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Package className="mr-2 h-5 w-5 text-orange-500" />
                              Détails de la Commande - {order.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Informations Client</h4>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="font-medium">{order.customerName}</p>
                                  <p className="text-sm text-gray-600">{order.email}</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Informations Commande</h4>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p>Date: {new Date(order.orderDate).toLocaleDateString('fr-FR')}</p>
                                  <p className="flex items-center">
                                    Statut: 
                                    <Badge className={`ml-2 ${getStatusColor(order.status)} flex items-center space-x-1`}>
                                      {getStatusIcon(order.status)}
                                      <span>{getStatusText(order.status)}</span>
                                    </Badge>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900">Détails du Livre</h4>
                              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-orange-900">{order.bookTitle}</p>
                                    <p className="text-orange-700">Quantité: {order.quantity}</p>
                                  </div>
                                  <p className="font-bold text-orange-900">€{order.total.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900">Adresse de Livraison</h4>
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p className="text-blue-900">{order.shippingAddress}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
            <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total des commandes affichées:</span>
            <span className="font-bold text-orange-600">{filteredOrders.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
