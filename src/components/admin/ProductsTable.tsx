import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Edit, Trash2, Search, Image } from 'lucide-react';
import { getProductImage } from '@/utils/imageUtils';

interface Product {
  id_product: number;
  reference_product: string;
  nom_product: string;
  img_product?: string;
  description_product?: string;
  type_product?: string;
  category_product?: string;
  itemgroup_product?: string;
  price_product: number;
  qnty_product: number;
  color_product?: string;
  collection_product?: string;
  status_product: 'active' | 'inactive' | 'draft';
  discount_product: number;
  createdate_product: string;
  [key: string]: any;
}

interface ProductsTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export const ProductsTable = ({ products, onEditProduct, onDeleteProduct }: ProductsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.nom_product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.reference_product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeStyle = (status: string) => {
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

  const getStockStatus = (product: Product) => {
    // Check if it's an accessory (uses qnty_product)
    if (['accessoires', 'cravate', 'pochette', 'maroquinerie', 'ceinture', 'autre'].includes(product.itemgroup_product)) {
      if (product.qnty_product <= 2) {
        return { text: 'Stock faible', color: 'text-red-600' };
      }
      return { text: 'En stock', color: 'text-green-600' };
    }

    // Check size-specific stock for clothing items
    const sizeFields = [
      's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', 'xs_size',
      '48_size', '50_size', '52_size', '54_size', '56_size', '58_size',
      '38_size', '39_size', '40_size', '41_size', '42_size', '43_size', '44_size', '45_size', '46_size'
    ];

    const hasLowStock = sizeFields.some(field => {
      const sizeStock = product[field];
      return sizeStock !== null && sizeStock !== undefined && sizeStock <= 2 && sizeStock > 0;
    });

    if (hasLowStock) {
      return { text: 'Stock faible', color: 'text-red-600' };
    }

    const totalStock = product.qnty_product || 0;
    if (totalStock === 0) return { text: 'Rupture', color: 'text-red-600' };
    return { text: 'En stock', color: 'text-green-600' };
  };

  const getAvailableSizes = (product: Product) => {
    const sizes = [];
    const sizeFields = [
      { field: 'xs_size', label: 'XS' },
      { field: 's_size', label: 'S' },
      { field: 'm_size', label: 'M' },
      { field: 'l_size', label: 'L' },
      { field: 'xl_size', label: 'XL' },
      { field: 'xxl_size', label: 'XXL' },
      { field: '3xl_size', label: '3XL' },
      { field: '4xl_size', label: '4XL' },
      { field: '48_size', label: '48' },
      { field: '50_size', label: '50' },
      { field: '52_size', label: '52' },
      { field: '54_size', label: '54' },
      { field: '56_size', label: '56' },
      { field: '58_size', label: '58' },
      { field: '38_size', label: '38' },
      { field: '39_size', label: '39' },
      { field: '40_size', label: '40' },
      { field: '41_size', label: '41' },
      { field: '42_size', label: '42' },
      { field: '43_size', label: '43' },
      { field: '44_size', label: '44' },
      { field: '45_size', label: '45' },
      { field: '46_size', label: '46' }
    ];

    sizeFields.forEach(({ field, label }) => {
      const stock = product[field];
      if (stock && stock > 0) {
        sizes.push({ label, stock });
      }
    });

    return sizes;
  };

  const renderSizesTable = (sizes: { label: string; stock: number }[]) => {
    if (sizes.length === 0) {
      return (
        <div className="text-sm text-gray-500 p-2">
          Aucune taille disponible
        </div>
      );
    }

    // Group sizes into rows of 3
    const rows = [];
    for (let i = 0; i < sizes.length; i += 3) {
      rows.push(sizes.slice(i, i + 3));
    }

    return (
      <div className="space-y-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-2">
            {row.map((size, index) => (
              <div 
                key={index} 
                className="bg-gray-50 border border-gray-200 rounded-md p-2 text-center min-h-[60px] flex flex-col justify-center"
              >
                <div className="font-medium text-sm">{size.label}</div>
                <div className="text-xs text-gray-600">Stock: {size.stock}</div>
              </div>
            ))}
            {/* Fill empty cells to maintain grid structure */}
            {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[60px]"></div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-48">Tailles Disponibles</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              const availableSizes = getAvailableSizes(product);
              return (
                <TableRow key={product.id_product}>
                  <TableCell>
                    {product.img_product ? (
                      <img
                        src={getProductImage(product.img_product, product.id_product.toString())}
                        alt={product.nom_product}
                        className="w-12 h-12 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = getProductImage('', product.id_product.toString());
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.nom_product}</div>
                      {product.color_product && (
                        <div className="text-sm text-gray-500">{product.color_product}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.reference_product}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.type_product}</Badge>
                  </TableCell>
                  <TableCell>
                    {product.collection_product ? (
                      <Badge variant="secondary" className="text-xs px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200">
                        {product.collection_product}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">{product.price_product}€</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.qnty_product}</div>
                      <div className={`text-xs ${stockStatus.color}`}>{stockStatus.text}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48">
                      {renderSizesTable(availableSizes)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadgeStyle(product.status_product)} border`}>
                      {product.status_product}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-2 min-h-[80px] justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditProduct(product)}
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteProduct(product)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun produit trouvé
        </div>
      )}
    </div>
  );
};
