import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Eye, Download, Package, Clock, CheckCircle, XCircle, AlertCircle, User, MapPin, CreditCard, Calendar, FileText, Truck, Globe, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchOrderDetails, OrderDetails } from '@/services/orderDetailsService';
import { generateOrderReceiptPDF } from '@/utils/orderReceiptGenerator';

interface Order {
  id_order: number;
  numero_commande: string;
  sous_total_order: number;
  discount_amount_order: number;
  discount_percentage_order: number;
  delivery_cost_order: number;
  total_order: number;
  status_order: string;
  payment_status: string;
  payment_method: string;
  date_creation_order: string;
  date_confirmation_order: string;
  date_livraison_order: string;
  date_livraison_souhaitee: string;
  notes_order: string;
  vue_par_admin: string;
  date_vue_admin: string;
  nom_customer: string;
  prenom_customer: string;
  email_customer: string;
  telephone_customer: string;
  adresse_customer: string;
  ville_customer: string;
  code_postal_customer: string;
  pays_customer: string;
  customer: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
  };
  items: Array<{
    id_order_item: string;
    nom_product_snapshot: string;
    reference_product_snapshot: string;
    price_product_snapshot: number;
    quantity_ordered: number;
    total_item: number;
    size_selected: string;
    color_selected: string;
    subtotal_item: number;
    discount_item: number;
    img_product: string;
  }>;
  delivery_address: any;
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

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);

  const getProductImageUrl = (imgProduct?: string): string => {
    if (!imgProduct) {
      return '/placeholder.svg';
    }
    
    // If it's already a full URL, return as is
    if (imgProduct.startsWith('http')) {
      return imgProduct;
    }
    
    // Construct the full URL with the base path
    return `https://draminesaid.com/lucci/${imgProduct}`;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const apiUrls = [
        'https://draminesaid.com/lucci/api/get_all_orders.php',
        'https://www.draminesaid.com/lucci/api/get_all_orders.php',
        'https://draminesaid.com/luccy/api/get_all_orders.php'
      ];
      
      let data = null;
      let success = false;
      
      for (const url of apiUrls) {
        try {
          console.log(`Trying orders API URL: ${url}`);
          const response = await fetch(url);
          const responseData = await response.json();
          console.log(`Orders API response from ${url}:`, responseData);
          
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
        setOrders(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order: Order) => {
    setOrderDetailsLoading(true);
    try {
      setSelectedOrder(order);
    } catch (error) {
      console.error('Error setting order details:', error);
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const handleDownloadReceipt = async (order: Order, language: 'fr' | 'en' = 'fr') => {
    try {
      console.log('Generating receipt for order:', order);
      
      // Transform the order data to ensure compatibility with PDF generator
      const orderForPDF = {
        ...order,
        numero_commande: order.numero_commande,
        date_creation_order: order.date_creation_order,
        customer: {
          nom: order.nom_customer,
          prenom: order.prenom_customer,
          email: order.email_customer,
          telephone: order.telephone_customer,
          adresse: order.adresse_customer,
          ville: order.ville_customer,
          code_postal: order.code_postal_customer,
          pays: order.pays_customer
        },
        items: order.items || [],
        delivery_address: order.delivery_address,
        sous_total_order: order.sous_total_order,
        discount_amount_order: order.discount_amount_order,
        delivery_cost_order: order.delivery_cost_order,
        total_order: order.total_order
      };
      
      generateOrderReceiptPDF(orderForPDF, language);
      console.log('PDF generation completed');
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert(`Erreur lors de la génération du PDF: ${error}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Annulée</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status || 'Non défini'}</Badge>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.numero_commande.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status_order === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((acc, order) => acc + safeToNumber(order.total_order), 0);
  const confirmedOrders = orders.filter(o => o.status_order === 'confirmed');
  const pendingOrders = orders.filter(o => o.status_order === 'pending');

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Commandes
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg">
            Gérez toutes les commandes ({orders.length} commandes)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">Total Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-blue-600">{orders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">Confirmées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-green-600">{confirmedOrders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-yellow-600">{pendingOrders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">Chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-purple-600">{safeToFixed(totalRevenue)} TND</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl font-semibold">Liste des commandes</CardTitle>
          <CardDescription>
            Toutes les commandes avec leurs détails et statuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher une commande..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des commandes...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:gap-6">
              {filteredOrders.map((order) => (
                <Card key={order.id_order} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status_order)}
                          <h3 className="font-semibold text-base lg:text-lg">{order.numero_commande}</h3>
                          {getStatusBadge(order.status_order)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{order.customer.prenom} {order.customer.nom}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.date_creation_order).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4" />
                            <span>{order.payment_method}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{order.customer.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-xl lg:text-2xl font-bold text-primary">{order.items?.length || 0}</p>
                            <p className="text-xs text-muted-foreground">Articles</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl lg:text-2xl font-bold text-green-600">{safeToFixed(order.total_order)} TND</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center space-x-2"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>Voir détails</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[98vw] sm:max-w-6xl max-h-[98vh] overflow-hidden flex flex-col">
                            <DialogHeader className="border-b pb-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div>
                                  <DialogTitle className="text-xl font-semibold">Détails de la commande</DialogTitle>
                                  <DialogDescription className="text-base">
                                    Commande #{selectedOrder?.numero_commande}
                                  </DialogDescription>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleDownloadReceipt(selectedOrder || order, 'fr')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    PDF FR
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDownloadReceipt(selectedOrder || order, 'en')}
                                  >
                                    <Globe className="h-4 w-4 mr-2" />
                                    PDF EN
                                  </Button>
                                </div>
                              </div>
                            </DialogHeader>
                            
                            <div className="flex-1 overflow-y-auto p-1">
                              {orderDetailsLoading ? (
                                <div className="text-center py-12">
                                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                  <p className="text-lg">Chargement des détails...</p>
                                </div>
                              ) : selectedOrder && (
                                <div className="space-y-6 p-2">
                                  {/* Professional Header Cards */}
                                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center text-blue-700">
                                          <Package className="mr-2 h-5 w-5" />
                                          Statut Commande
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-medium">Statut:</span>
                                          {getStatusBadge(selectedOrder.status_order)}
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600">
                                          {selectedOrder.items?.length || 0} Articles
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100/50">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center text-green-700">
                                          <CreditCard className="mr-2 h-5 w-5" />
                                          Paiement
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <p className="text-xs text-muted-foreground">Méthode</p>
                                          <p className="font-semibold text-sm">{selectedOrder.payment_method}</p>
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">
                                          {safeToFixed(selectedOrder.total_order)} TND
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100/50">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center text-purple-700">
                                          <Calendar className="mr-2 h-5 w-5" />
                                          Dates Importantes
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div>
                                          <p className="text-xs text-muted-foreground">Création</p>
                                          <p className="font-semibold text-sm">{new Date(selectedOrder.date_creation_order).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        {selectedOrder.date_confirmation_order && (
                                          <div>
                                            <p className="text-xs text-muted-foreground">Confirmation</p>
                                            <p className="font-semibold text-sm">{new Date(selectedOrder.date_confirmation_order).toLocaleDateString('fr-FR')}</p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100/50">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center text-orange-700">
                                          <Truck className="mr-2 h-5 w-5" />
                                          Livraison
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div>
                                          <p className="text-xs text-muted-foreground">Frais</p>
                                          <p className="font-semibold text-sm">{safeToFixed(selectedOrder.delivery_cost_order)} TND</p>
                                        </div>
                                        {selectedOrder.date_livraison_souhaitee && (
                                          <div>
                                            <p className="text-xs text-muted-foreground">Date souhaitée</p>
                                            <p className="font-semibold text-sm">{new Date(selectedOrder.date_livraison_souhaitee).toLocaleDateString('fr-FR')}</p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Customer and Delivery Information */}
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="shadow-sm">
                                      <CardHeader className="bg-slate-50 border-b">
                                        <CardTitle className="text-base flex items-center">
                                          <User className="mr-2 h-5 w-5 text-slate-600" />
                                          Informations Client
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="p-4 space-y-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-600" />
                                          </div>
                                          <div>
                                            <p className="font-semibold">{selectedOrder.prenom_customer} {selectedOrder.nom_customer}</p>
                                            <p className="text-sm text-muted-foreground">Client</p>
                                          </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedOrder.email_customer}</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedOrder.telephone_customer}</span>
                                          </div>
                                          <div className="flex items-start space-x-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                              <p>{selectedOrder.adresse_customer}</p>
                                              <p>{selectedOrder.ville_customer} {selectedOrder.code_postal_customer}</p>
                                              <p>{selectedOrder.pays_customer}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Always show delivery address section */}
                                    <Card className="shadow-sm">
                                      <CardHeader className="bg-slate-50 border-b">
                                        <CardTitle className="text-base flex items-center">
                                          <Truck className="mr-2 h-5 w-5 text-slate-600" />
                                          Adresse de Livraison
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="p-4">
                                        <div className="space-y-3">
                                          <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                              <Truck className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                              <p className="font-semibold">
                                                {selectedOrder.delivery_address?.prenom_destinataire || selectedOrder.prenom_customer} {selectedOrder.delivery_address?.nom_destinataire || selectedOrder.nom_customer}
                                              </p>
                                              <p className="text-sm text-muted-foreground">Destinataire</p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                              <Phone className="h-4 w-4 text-muted-foreground" />
                                              <span>{selectedOrder.delivery_address?.telephone_destinataire || selectedOrder.telephone_customer}</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                              <div>
                                                <p>{selectedOrder.delivery_address?.adresse_livraison || selectedOrder.adresse_customer}</p>
                                                <p>{selectedOrder.delivery_address?.ville_livraison || selectedOrder.ville_customer} {selectedOrder.delivery_address?.code_postal_livraison || selectedOrder.code_postal_customer}</p>
                                                <p>{selectedOrder.delivery_address?.pays_livraison || selectedOrder.pays_customer}</p>
                                              </div>
                                            </div>
                                            {selectedOrder.delivery_address?.instructions_livraison && (
                                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                                <p className="text-sm font-medium text-blue-800">Instructions de livraison:</p>
                                                <p className="text-sm text-blue-700 mt-1">{selectedOrder.delivery_address.instructions_livraison}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Order Items */}
                                  <Card className="shadow-sm">
                                    <CardHeader className="bg-slate-50 border-b">
                                      <CardTitle className="text-base flex items-center justify-between">
                                        <div className="flex items-center">
                                          <Package className="mr-2 h-5 w-5 text-slate-600" />
                                          Articles commandés
                                        </div>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                          {selectedOrder.items?.length || 0} articles
                                        </Badge>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                      <div className="space-y-4">
                                        {(selectedOrder.items || []).map((item, index) => (
                                          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-l-blue-400 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                                              {item.img_product && (
                                                <div className="relative">
                                                  <img
                                                    src={getProductImageUrl(item.img_product)}
                                                    alt={item.nom_product_snapshot}
                                                    className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm"
                                                    onError={(e) => {
                                                      e.currentTarget.src = '/placeholder.svg';
                                                    }}
                                                  />
                                                </div>
                                              )}
                                              <div className="space-y-1">
                                                <p className="font-semibold text-base">{item.nom_product_snapshot}</p>
                                                <p className="text-sm text-muted-foreground">
                                                  Réf: <span className="font-mono">{item.reference_product_snapshot}</span>
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                  {item.size_selected && (
                                                    <Badge variant="outline" className="text-xs">
                                                      Taille: {item.size_selected}
                                                    </Badge>
                                                  )}
                                                  {item.color_selected && (
                                                    <Badge variant="outline" className="text-xs">
                                                      Couleur: {item.color_selected}
                                                    </Badge>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-right space-y-1 w-full sm:w-auto">
                                              <p className="font-bold text-lg text-green-600">{safeToFixed(item.total_item)} TND</p>
                                              <p className="text-sm text-muted-foreground">
                                                {safeToFixed(item.price_product_snapshot)} TND × {item.quantity_ordered}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      
                                      {/* Order Summary */}
                                      <div className="mt-6 pt-6 border-t bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                                        <div className="space-y-3">
                                          <div className="flex justify-between text-base">
                                            <span className="font-medium">Sous-total:</span>
                                            <span className="font-semibold">{safeToFixed(selectedOrder.sous_total_order)} TND</span>
                                          </div>
                                          {safeToNumber(selectedOrder.discount_amount_order) > 0 && (
                                            <div className="flex justify-between text-base text-green-600">
                                              <span className="font-medium">Remise ({safeToFixed(selectedOrder.discount_percentage_order)}%):</span>
                                              <span className="font-semibold">-{safeToFixed(selectedOrder.discount_amount_order)} TND</span>
                                            </div>
                                          )}
                                          <div className="flex justify-between text-base">
                                            <span className="font-medium">Livraison:</span>
                                            <span className="font-semibold">{safeToFixed(selectedOrder.delivery_cost_order)} TND</span>
                                          </div>
                                          <div className="flex justify-between font-bold text-xl pt-3 border-t-2 border-gray-300">
                                            <span>Total:</span>
                                            <span className="text-green-600">{safeToFixed(selectedOrder.total_order)} TND</span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Notes */}
                                  {selectedOrder.notes_order && (
                                    <Card className="shadow-sm">
                                      <CardHeader className="bg-amber-50 border-b">
                                        <CardTitle className="text-base flex items-center">
                                          <FileText className="mr-2 h-5 w-5 text-amber-600" />
                                          Notes de commande
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="p-4">
                                        <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                                          <p className="text-sm leading-relaxed">{selectedOrder.notes_order}</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Admin Notes */}
                                  {selectedOrder.vue_par_admin === '1' && selectedOrder.date_vue_admin && (
                                    <Card className="shadow-sm border-blue-200">
                                      <CardHeader className="bg-blue-50 border-b">
                                        <CardTitle className="text-base flex items-center">
                                          <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
                                          Information Administrative
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="p-4">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                          <p className="text-sm text-blue-800">
                                            <strong>Vue par l'administrateur le:</strong> {new Date(selectedOrder.date_vue_admin).toLocaleDateString('fr-FR')} à {new Date(selectedOrder.date_vue_admin).toLocaleTimeString('fr-FR')}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="flex items-center space-x-2 flex-1"
                            onClick={() => handleDownloadReceipt(order, 'fr')}
                          >
                            <Download className="h-4 w-4" />
                            <span>PDF FR</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-2"
                            onClick={() => handleDownloadReceipt(order, 'en')}
                          >
                            <Globe className="h-4 w-4" />
                            <span>EN</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
