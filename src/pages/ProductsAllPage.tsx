import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, List, Grid3X3, Filter, SlidersHorizontal, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductsHero, ProductTestimonials, PartnersSection } from '../components/products';
import { PRODUCTS, NAVIGATION_STRUCTURE } from '../config/products';
import ProductCard from '../components/products/ProductCard';
import type { Product, ProductCategory } from '../types';
import { getProductTranslationPath } from '../utils/productTranslations';
import { customProductSort } from '../lib/utils';

const ITEMS_PER_PAGE = 9;

const ProductsAllPage = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<'default' | 'name-asc' | 'name-desc'>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);

  // Apply our custom sorting to the products
  const products = customProductSort([...PRODUCTS]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCertifications = selectedCertifications.length === 0 || 
                                 (product.isOrganic && selectedCertifications.includes('organic')) ||
                                 (product.isFairTrade && selectedCertifications.includes('fairTrade'));
    
    const matchesCategories = selectedCategories.length === 0 ||
                             selectedCategories.includes(product.category as any);
    
    return matchesSearch && matchesCertifications && matchesCategories;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'name-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'name-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCertifications, selectedCategories, sortOption]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleSelectProduct = (id: string) => {
    if (window.dispatchEvent) {
      const customEvent = new CustomEvent('navigateToProduct', { detail: { productId: id } });
      window.dispatchEvent(customEvent);
    }
  };

  const handleCategoryToggle = (category: ProductCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category as any)
        ? prev.filter(c => c !== category)
        : [...prev, category as any]
    );
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1);
        items.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push('ellipsis');
        items.push(currentPage - 1);
        items.push(currentPage);
        items.push(currentPage + 1);
        items.push('ellipsis');
        items.push(totalPages);
      }
    }

    return items;
  };

  const paginationItems = generatePaginationItems();

  const handleNavigateToRevendeurs = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.dispatchEvent) {
      const customEvent = new CustomEvent('navigateToPage', { detail: { page: 'revendeurs' } });
      window.dispatchEvent(customEvent);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <ProductsHero />
      
      <div className="container mx-auto px-4 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h1 className="text-3xl font-playfair text-[#700100] mb-3">{t('products.all_products')}</h1>
          <p className="text-gray-600 mb-6">{t('products.discover_range')}</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 transition-opacity ${isSearchFocused ? 'opacity-100 text-[#96cc39]' : 'opacity-70'}`}>
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder={t('products.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#96cc39] transition-all"
              />
            </div>
            
          {/*   <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              <Filter size={18} />
              <span>{t('products.filters')}</span>
            </motion.button> */}
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <SlidersHorizontal size={16} />
                        {t('products.categories')}
                      </h3>
                      
                      {NAVIGATION_STRUCTURE.map((group) => (
                        <div key={group.type} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <h4 className="font-medium text-[#700100] mb-2">{t(`navbar.${group.type.replace(/-/g, '_')}`)}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {group.items.map((item) => (
                              <button
                                key={item.category}
                                onClick={() => handleCategoryToggle(item.category as any)}
                                className={`px-3 py-2 text-sm border rounded transition-colors text-left ${
                                  selectedCategories.includes(item.category as any)
                                    ? 'bg-[#96cc39] bg-opacity-20 border-[#96cc39] text-[#700100]'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {t(`navbar.${item.category.replace(/-/g, '_')}`)}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{t('products.display')}:</span>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#96cc39] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Grid3X3 size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#96cc39] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <List size={18} />
              </motion.button>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">{t('products.sort_by')}:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#96cc39]"
              >
                <option value="default">{t('products.sort_default')}</option>
                <option value="name-asc">{t('products.sort_name_asc')}</option>
                <option value="name-desc">{t('products.sort_name_desc')}</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            {t('products.showing')} <span className="font-medium text-gray-700">{sortedProducts.length}</span> {t('products.products')}
            {searchQuery && (
              <span> {t('products.for')} "<span className="italic">{searchQuery}</span>"</span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <div key={viewMode}>
              {paginatedProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-gray-500 text-lg">{t('products.no_products_found')}</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCertifications([]);
                      setSelectedCategories([]);
                    }}
                    className="mt-4 text-[#96cc39] hover:text-[#700100] transition-colors"
                  >
                    {t('products.clear_filters')}
                  </button>
                </motion.div>
              ) : viewMode === 'grid' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {paginatedProducts.map((product, index) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: index * 0.1 } 
                      }}
                    >
                      <ProductCard product={product as any} onSelect={handleSelectProduct} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {paginatedProducts.map((product: Product, index) => {
                    const translationInfo = getProductTranslationPath(product.title);
                    return (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: index * 0.1 } 
                        }}
                        className="flex flex-col md:flex-row gap-6 p-5 border rounded-lg hover:shadow-md transition-all cursor-pointer bg-white hover:bg-gray-50"
                        onClick={() => handleSelectProduct(product.id)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="w-full md:w-1/4 aspect-square overflow-hidden rounded-lg relative group">
                          <img 
                            src={product.image}
                            alt={translationInfo.key ? t(translationInfo.key) : translationInfo.fallback}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </div>
                        <div className="w-full md:w-3/4 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-playfair text-[#700100]">
                                {translationInfo.key ? t(translationInfo.key) : translationInfo.fallback}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-wrap gap-2">
                              {product.isOrganic && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  {t('products.organic')}
                                </span>
                              )}
                            
                            </div>
                            <motion.button 
                              className="text-[#96cc39] hover:text-[#700100] transition-colors text-sm font-medium flex items-center gap-1"
                              whileHover={{ x: 5 }}
                            >
                              {t('products.view_details')} <ChevronRight size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                
                {paginationItems.map((item, index) => (
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <motion.button
                      key={`page-${item}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePageChange(item as number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === item
                          ? 'bg-[#96cc39] text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item}
                    </motion.button>
                  )
                ))}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </nav>
            </div>
          )}
        </motion.div>
        
        <ProductTestimonials />
        
        <PartnersSection onNavigateToRevendeurs={handleNavigateToRevendeurs} />
      </div>
    </div>
  );
};

export default ProductsAllPage;
