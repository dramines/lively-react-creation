
import React from 'react';
import { Filter, X } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

const ProductFilters = () => {
  const { filters, updateFilters, filteredProducts } = useProducts();
  const [isOpen, setIsOpen] = React.useState(false);

  // Get unique categories, sizes, and colors from all products
  const categories = ['Costume', 'Chemise', 'Accessoires', 'Chaussures'];
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const allColors = ['Noir', 'Blanc', 'Bleu', 'Gris', 'Marron'];

  const clearFilters = () => {
    updateFilters({
      category: '',
      minPrice: 0,
      maxPrice: 5000,
      size: '',
      color: '',
      sortBy: 'name'
    });
  };

  const hasActiveFilters = filters.category || filters.size || filters.color || 
                          filters.minPrice > 0 || filters.maxPrice < 5000;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={16} />
            Filtres
            {hasActiveFilters && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {[filters.category, filters.size, filters.color].filter(Boolean).length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
              >
                <X size={14} />
                Effacer les filtres
              </button>
            )}
            
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="name">Trier par nom</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
              <option value="newest">Nouveautés</option>
            </select>
          </div>
        </div>

        {/* Filter panel */}
        {isOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category filter */}
              <div>
                <h3 className="font-medium mb-3">Catégorie</h3>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price filter */}
              <div>
                <h3 className="font-medium mb-3">Prix (TND)</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => updateFilters({ minPrice: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice === 5000 ? '' : filters.maxPrice}
                      onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) || 5000 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Size filter */}
              <div>
                <h3 className="font-medium mb-3">Taille</h3>
                <select
                  value={filters.size}
                  onChange={(e) => updateFilters({ size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Toutes les tailles</option>
                  {allSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Color filter */}
              <div>
                <h3 className="font-medium mb-3">Couleur</h3>
                <select
                  value={filters.color}
                  onChange={(e) => updateFilters({ color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Toutes les couleurs</option>
                  {allColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
