
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';

interface Product {
  id_product: number;
  reference_product: string;
  nom_product: string;
  type_product?: string;
  itemgroup_product?: string;
  qnty_product: number;
  [key: string]: any;
}

interface ProductStatsProps {
  products: Product[];
}

export const ProductStats = ({ products }: ProductStatsProps) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    mostBoughtProducts: []
  });

  useEffect(() => {
    const calculateStats = () => {
      const totalProducts = products.length;
      
      // Calculate low stock products
      const lowStockProducts = products.filter(product => {
        // Check if it's an accessory (uses qnty_product)
        if (['accessoires', 'cravate', 'pochette', 'maroquinerie', 'ceinture', 'autre'].includes(product.itemgroup_product)) {
          return product.qnty_product <= 2;
        }

        // Check size-specific stock for clothing items
        const sizeFields = [
          's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', 'xs_size',
          '48_size', '50_size', '52_size', '54_size', '56_size', '58_size',
          '38_size', '39_size', '40_size', '41_size', '42_size', '43_size', '44_size', '45_size', '46_size'
        ];

        return sizeFields.some(field => {
          const sizeStock = product[field];
          return sizeStock !== null && sizeStock !== undefined && sizeStock <= 2 && sizeStock > 0;
        });
      }).length;

      // For most bought products, we'll simulate this data since we don't have sales data
      // In a real app, this would come from order/sales data
      const mostBoughtProducts = products
        .sort((a, b) => (b.qnty_product || 0) - (a.qnty_product || 0))
        .slice(0, 3);

      setStats({
        totalProducts,
        lowStockProducts,
        mostBoughtProducts
      });
    };

    calculateStats();
  }, [products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Produits dans le catalogue
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</div>
          <p className="text-xs text-muted-foreground">
            Produits nécessitant un réapprovisionnement
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plus Vendus</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.mostBoughtProducts.slice(0, 2).map((product, index) => (
              <div key={product.id_product} className="flex items-center justify-between">
                <span className="text-sm truncate flex-1">{product.nom_product}</span>
                <span className="text-sm font-medium ml-2">#{index + 1}</span>
              </div>
            ))}
            {stats.mostBoughtProducts.length === 0 && (
              <p className="text-xs text-muted-foreground">Aucune donnée disponible</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
