
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X } from 'lucide-react';
import MobileFilterSheet from './MobileFilterSheet';

interface FilterBarProps {
  totalResults: number;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  itemGroups: string[];
  sizes: string[];
  priceSort: 'asc' | 'desc' | '';
  colors: string[];
  categories: string[];
}

const FilterBar = ({ totalResults, onFilterChange }: FilterBarProps) => {
  const { t } = useTranslation(['products', 'common']);
  
  const [filters, setFilters] = useState<FilterState>({
    itemGroups: [],
    sizes: [],
    priceSort: '',
    colors: [],
    categories: []
  });

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
    setFilters(updatedFilters);
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
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return filters.itemGroups.length + 
           filters.colors.length + 
           filters.categories.length + 
           (filters.priceSort ? 1 : 0);
  };

  const FilterDropdown = ({ 
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-11 px-6 text-sm font-medium text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 justify-between min-w-[160px] rounded-sm"
        >
          <span className="flex items-center gap-2">
            {title}
            {selectedValues.length > 0 && (
              <span className="text-xs bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {selectedValues.length}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto bg-white border border-gray-200 shadow-lg">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selectedValues.includes(option)}
            onCheckedChange={() => onToggle(option)}
            className="capitalize text-gray-700 hover:bg-gray-50"
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="bg-white border-b border-gray-200 py-6 mb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Mobile Filter - Show only on small screens */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between">
            <MobileFilterSheet 
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                onFilterChange(newFilters);
              }}
              totalResults={totalResults}
            />
            
            <span className="text-sm text-gray-600">
              ({totalResults} Résultats)
            </span>
          </div>
          
          {/* Active Filters Display for Mobile */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {filters.itemGroups.map(item => (
                <Badge key={item} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {item}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('itemGroups', item)}
                  />
                </Badge>
              ))}
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('categories', category)}
                  />
                </Badge>
              ))}
              {filters.colors.map(color => (
                <Badge key={color} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {color}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('colors', color)}
                  />
                </Badge>
              ))}
              {filters.priceSort && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {filters.priceSort === 'asc' ? 'Prix: Croissant' : 'Prix: Décroissant'}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ priceSort: '' })}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Desktop Filter - Show only on medium screens and up */}
        <div className="hidden md:block">
          {/* Single row filter bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FilterDropdown
                title="TYPE DE PRODUIT"
                options={itemGroupOptions}
                selectedValues={filters.itemGroups}
                onToggle={(value) => toggleArrayFilter('itemGroups', value)}
              />

              <FilterDropdown
                title="CATÉGORIE"
                options={categoryOptions}
                selectedValues={filters.categories}
                onToggle={(value) => toggleArrayFilter('categories', value)}
              />

              <FilterDropdown
                title="COULEUR"
                options={colorOptions}
                selectedValues={filters.colors}
                onToggle={(value) => toggleArrayFilter('colors', value)}
              />
            </div>

            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600">
                ({totalResults} Résultats)
              </span>
              
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-black underline p-0 h-auto"
                >
                  SUPPRIMER TOUS LES FILTRES
                </Button>
              )}

              <Select
                value={filters.priceSort}
                onValueChange={(value) => updateFilters({ priceSort: value === 'none' ? '' : value as 'asc' | 'desc' })}
              >
                <SelectTrigger className="w-[160px] h-11 border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-sm">
                  <SelectValue placeholder="TRIER PAR" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="asc">Prix croissant</SelectItem>
                  <SelectItem value="desc">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display for Desktop */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
              {filters.itemGroups.map(item => (
                <Badge key={item} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {item}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('itemGroups', item)}
                  />
                </Badge>
              ))}
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('categories', category)}
                  />
                </Badge>
              ))}
              {filters.colors.map(color => (
                <Badge key={color} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {color}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('colors', color)}
                  />
                </Badge>
              ))}
              {filters.priceSort && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {filters.priceSort === 'asc' ? 'Prix: Croissant' : 'Prix: Décroissant'}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ priceSort: '' })}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
