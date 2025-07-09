import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ProductAddModal } from '@/components/admin/ProductAddModal';

interface Product {
  id_product: number;
  reference_product: string;
  nom_product: string;
  description_product: string;
  price_product: number;
  qnty_product: number;
  status_product: string;
  img_product: string;
  category_product: string;
  discount_product: number;
  createdate_product: string;
  color_product: string;
  itemgroup_product: string;
}

// Helper function to safely get string value
const safeString = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Try multiple API endpoints in case of redirect issues
      const apiUrls = [
        'https://draminesaid.com/lucci/api/get_all_products.php',
        'https://www.draminesaid.com/lucci/api/get_all_products.php',
        'https://www.draminesaid.com/luccy/api/get_all_products.php'
      ];
      
      let data = null;
      let success = false;
      
      for (const url of apiUrls) {
        try {
          console.log(`Trying products API URL: ${url}`);
          const response = await fetch(url);
          console.log(`Products API response status: ${response.status}`);
          
          if (response.ok) {
            data = await response.json();
            console.log('Products API Response:', data);
            success = true;
            break;
          }
        } catch (error) {
          console.error(`Error with ${url}:`, error);
          continue;
        }
      }
      
      if (success && data?.success) {
        setProducts(data.data || []);
      } else {
        console.log('Using fallback empty products data due to API failure');
        setProducts([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = () => {
    fetchProducts(); // Refresh the products list
  };

  const filteredProducts = products.filter(product =>
    safeString(product.nom_product).toLowerCase().includes(searchTerm.toLowerCase()) ||
    safeString(product.reference_product).toLowerCase().includes(searchTerm.toLowerCase()) ||
    safeString(product.category_product).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'draft':
        return 'Brouillon';
      default:
        return status;
    }
  };

  const lowStockProducts = products.filter(p => p.qnty_product < 10);
  const activeProducts = products.filter(p => p.status_product === 'active');

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Produits
          </h1>
          <p className="text-muted-foreground text-lg">
            Gérez votre catalogue de produits ({products.length} produits)
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 shadow-md"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produits Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeProducts.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Faible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valeur Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              €{products.reduce((acc, p) => acc + (p.price_product * p.qnty_product), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold">Liste des produits</CardTitle>
              <CardDescription>
                Gérez tous vos produits en un seul endroit
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un produit..." 
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
              <p className="text-muted-foreground">Chargement des produits...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {products.length === 0 ? 'Aucun produit disponible' : 'Aucun produit trouvé'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card key={product.id_product} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="relative">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-50">
                      {product.img_product ? (
                        <img 
                          src={`https://www.draminesaid.com/lucci/${product.img_product}`}
                          alt={safeString(product.nom_product)}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Package className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className={getStatusColor(product.status_product)} variant="outline">
                          {getStatusText(product.status_product)}
                        </Badge>
                      </div>
                      {product.discount_product > 0 && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-500 text-white">
                            -{product.discount_product}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                          {safeString(product.nom_product)}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          Réf: {safeString(product.reference_product)}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {safeString(product.itemgroup_product)} • {safeString(product.color_product)}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">€{product.price_product}</span>
                          {product.discount_product > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                              €{(product.price_product / (1 - product.discount_product / 100)).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${product.qnty_product < 10 ? 'text-red-600' : 'text-green-600'}`}>
                            Stock: {product.qnty_product}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.qnty_product < 10 ? 'Stock faible' : 'En stock'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-3">
                          Créé le {new Date(product.createdate_product).toLocaleDateString('fr-FR')}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id_product}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                            {product.img_product ? (
                              <img 
                                src={`https://www.draminesaid.com/lucci/${product.img_product}`}
                                alt={safeString(product.nom_product)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{safeString(product.nom_product)}</p>
                            <p className="text-sm text-gray-500 capitalize">{safeString(product.itemgroup_product)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{safeString(product.reference_product)}</TableCell>
                      <TableCell>
                        <div>
                          <span className="font-bold text-primary">€{product.price_product}</span>
                          {product.discount_product > 0 && (
                            <Badge className="ml-2 bg-red-100 text-red-800">-{product.discount_product}%</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${product.qnty_product < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.qnty_product}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status_product)} variant="outline">
                          {getStatusText(product.status_product)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <ProductAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default AdminProducts;
