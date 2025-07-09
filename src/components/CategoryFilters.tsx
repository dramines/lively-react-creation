import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface CategoryFiltersProps {
  onFiltersChange: (filters: CategoryFilters) => void;
  resultsCount: number;
}

interface CategoryFilters {
  itemGroup: string;
  minPrice: number;
  maxPrice: number;
  size: string;
  color: string;
  sortBy: string;
}

const CategoryFilters = ({ onFiltersChange, resultsCount }: CategoryFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<CategoryFilters>({
    itemGroup: '',
    minPrice: 0,
    maxPrice: 5000,
    size: '',
    color: '',
    sortBy: 'name'
  });

  // Available filter options based on your API data
  const itemGroups = [
    'blazers', 'blouson', 'manteau', 'djine', 'slack', 'pantalon', 
    'chemise', 'costume', 'blazer', 'tshirt', 'polo', 'chaussure'
  ];
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '48', '50', '52', '54', '56', '58'];
  const allColors = ['Noir', 'Blanc', 'Bleu', 'Gris', 'Marron', 'Navy', 'Black', 'White', 'Charcoal', 'Gray', 'Burgundy'];

  const updateFilters = (newFilters: Partial<CategoryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      itemGroup: '',
      minPrice: 0,
      maxPrice: 5000,
      size: '',
      color: '',
      sortBy: 'name'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.itemGroup || filters.size || filters.color || 
                          filters.minPrice > 0 || filters.maxPrice < 5000;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-hm-sans"
          >
            <Filter size={16} />
            Filtres
            {hasActiveFilters && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {[filters.itemGroup, filters.size, filters.color].filter(Boolean).length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-black flex items-center gap-1 font-hm-sans"
              >
                <X size={14} />
                Effacer les filtres
              </button>
            )}
            
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-hm-sans"
            >
              <option value="name">Trier par nom</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="newest">Nouveautés</option>
            </select>
          </div>
        </div>

        {/* Filter panel */}
        {isOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Item Group filter */}
              <div>
                <h3 className="font-medium mb-3 font-hm-sans">Type de produit</h3>
                <select
                  value={filters.itemGroup}
                  onChange={(e) => updateFilters({ itemGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-hm-sans"
                >
                  <option value="">Tous les types</option>
                  {itemGroups.map(itemGroup => (
                    <option key={itemGroup} value={itemGroup}>
                      {itemGroup.charAt(0).toUpperCase() + itemGroup.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price filter */}
              <div>
                <h3 className="font-medium mb-3 font-hm-sans">Prix (TND)</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => updateFilters({ minPrice: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-hm-sans"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice === 5000 ? '' : filters.maxPrice}
                      onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) || 5000 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-hm-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Size filter */}
              <div>
                <h3 className="font-medium mb-3 font-hm-sans">Taille</h3>
                <select
                  value={filters.size}
                  onChange={(e) => updateFilters({ size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-hm-sans"
                >
                  <option value="">Toutes les tailles</option>
                  {allSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Color filter */}
              <div>
                <h3 className="font-medium mb-3 font-hm-sans">Couleur</h3>
                <select
                  value={filters.color}
                  onChange={(e) => updateFilters({ color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-hm-sans"
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
              <p className="text-sm text-gray-600 font-hm-sans">
                {resultsCount} produit{resultsCount > 1 ? 's' : ''} trouvé{resultsCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilters;
export type { CategoryFilters };