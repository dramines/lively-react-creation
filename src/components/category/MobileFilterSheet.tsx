
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X } from 'lucide-react';
import { FilterState } from './FilterBar';

interface MobileFilterSheetProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
}

const MobileFilterSheet = ({ filters, onFilterChange, totalResults }: MobileFilterSheetProps) => {
  const { t } = useTranslation(['products', 'common']);
  const [isOpen, setIsOpen] = useState(false);

  // Available filter options
  const itemGroupOptions = [
    'blazers', 'blouson', 'manteau', 'djine', 'slack', 'pantalon',
    'chemise', 'costume', 'blazer', 'tshirt', 'polo', 'chaussure',
    'ceinture', 'maroquinerie', 'cravate', 'pochette', 'autre'
  ];

  const colorOptions = [
    'noir', 'blanc', 'bleu', 'rouge', 'vert', 'gris', 'marron', 'beige'
  ];

  const categoryOptions = ['homme', 'femme'];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    onFilterChange(updatedFilters);
  };

  const toggleArrayFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ [type]: newArray });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      itemGroups: [],
      sizes: [],
      priceSort: '',
      colors: [],
      categories: []
    };
    onFilterChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return filters.itemGroups.length + 
           filters.colors.length + 
           filters.categories.length + 
           (filters.priceSort ? 1 : 0);
  };

  const FilterSection = ({ 
    title, 
    options, 
    selectedValues, 
    onToggle 
  }: {
    title: string;
    options: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
  }) => (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">{title}</h3>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => onToggle(option)}
              className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <span className="text-sm text-gray-700 capitalize">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="h-11 px-4 text-sm font-medium text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          FILTRES
          {getActiveFiltersCount() > 0 && (
            <span className="text-xs bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto bg-white">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-semibold">Filtres</SheetTitle>
          <SheetDescription>
            ({totalResults} Résultats)
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Sort Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">TRIER PAR</h3>
            <Select
              value={filters.priceSort}
              onValueChange={(value) => updateFilters({ priceSort: value === 'none' ? '' : value as 'asc' | 'desc' })}
            >
              <SelectTrigger className="w-full h-11 border border-gray-300 bg-white text-sm text-gray-900">
                <SelectValue placeholder="Choisir un tri" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]" position="popper">
                <SelectItem value="none" className="text-gray-900">Aucun tri</SelectItem>
                <SelectItem value="asc" className="text-gray-900">Prix croissant</SelectItem>
                <SelectItem value="desc" className="text-gray-900">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Type Filter */}
          <FilterSection
            title="TYPE DE PRODUIT"
            options={itemGroupOptions}
            selectedValues={filters.itemGroups}
            onToggle={(value) => toggleArrayFilter('itemGroups', value)}
          />

          {/* Category Filter */}
          <FilterSection
            title="CATÉGORIE"
            options={categoryOptions}
            selectedValues={filters.categories}
            onToggle={(value) => toggleArrayFilter('categories', value)}
          />

          {/* Color Filter */}
          <FilterSection
            title="COULEUR"
            options={colorOptions}
            selectedValues={filters.colors}
            onToggle={(value) => toggleArrayFilter('colors', value)}
          />

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">FILTRES ACTIFS</h3>
              <div className="flex flex-wrap gap-2">
                {filters.itemGroups.map(item => (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
                    {item}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleArrayFilter('itemGroups', item)}
                    />
                  </Badge>
                ))}
                {filters.categories.map(category => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
                    {category}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleArrayFilter('categories', category)}
                    />
                  </Badge>
                ))}
                {filters.colors.map(color => (
                  <Badge key={color} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
                    {color}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleArrayFilter('colors', color)}
                    />
                  </Badge>
                ))}
                {filters.priceSort && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
                    {filters.priceSort === 'asc' ? 'Prix: Croissant' : 'Prix: Décroissant'}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilters({ priceSort: '' })}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex-1 h-11"
              >
                EFFACER TOUT
              </Button>
            )}
            <Button
              onClick={() => setIsOpen(false)}
              className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white"
            >
              APPLIQUER ({totalResults})
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterSheet;
