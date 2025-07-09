import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SocialSidebar from '@/components/SocialSidebar';
import ProductCard from '@/components/ProductCard';
import CategoryFilters, { CategoryFilters as CategoryFiltersType } from '@/components/CategoryFilters';
import { Button } from '@/components/ui/button';

interface Product {
  id_product: string;
  reference_product: string;
  nom_product: string;
  img_product: string;
  img2_product?: string;
  img3_product?: string;
  img4_product?: string;
  description_product: string;
  type_product: string;
  category_product: string;
  itemgroup_product: string;
  price_product: string;
  qnty_product: string;
  color_product: string;
  status_product: string;
  discount_product?: string;
  createdate_product: string;
  // Size fields
  xs_size?: string;
  s_size?: string;
  m_size?: string;
  l_size?: string;
  xl_size?: string;
  xxl_size?: string;
  '3xl_size'?: string;
  '4xl_size'?: string;
  '48_size'?: string;
  '50_size'?: string;
  '52_size'?: string;
  '54_size'?: string;
  '56_size'?: string;
  '58_size'?: string;
}

const Category = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category mapping
  const getCategoryInfo = () => {
    const categoryMap = {
      all: {
        title: 'Tous les Produits',
        description: 'Découvrez toute notre collection',
        typeFilter: ''
      },
      surMesure: {
        title: 'Sur Mesure',
        description: 'Collections sur mesure premium',
        typeFilter: 'sur mesure'
      },
      pretAPorter: {
        title: 'Prêt à Porter',
        description: 'Collections prêt à porter',
        typeFilter: 'prêt à porter'
      },
      accessoires: {
        title: 'Accessoires',
        description: 'Accessoires de luxe',
        typeFilter: 'accessoires'
      }
    };

    return categoryMap[category as keyof typeof categoryMap] || {
      title: 'Collection',
      description: 'Nos produits',
      typeFilter: ''
    };
  };

  const getSubcategoryInfo = () => {
    if (!subcategory) return null;

    const parts = subcategory.split('-');
    if (parts.length === 2) {
      const [categoryPart, itemGroup] = parts;
      return {
        categoryFilter: categoryPart === 'homme' ? 'homme' : categoryPart === 'femme' ? 'femme' : '',
        itemGroupFilter: itemGroup
      };
    }
    
    // For simple subcategories like 'chemise', 'tshirt', etc.
    return {
      categoryFilter: '',
      itemGroupFilter: subcategory
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://draminesaid.com/lucci/api/get_all_products.php');
        const result = await response.json();
        
        if (result.success) {
          let filteredProducts = result.data;
          const categoryInfo = getCategoryInfo();
          const subcategoryInfo = getSubcategoryInfo();

          // Filter by main category (type_product)
          if (categoryInfo.typeFilter) {
            filteredProducts = filteredProducts.filter((product: Product) => 
              product.type_product.toLowerCase() === categoryInfo.typeFilter.toLowerCase()
            );
          }

          // Filter by subcategory if exists
          if (subcategoryInfo) {
            if (subcategoryInfo.categoryFilter) {
              filteredProducts = filteredProducts.filter((product: Product) => 
                product.category_product.toLowerCase() === subcategoryInfo.categoryFilter.toLowerCase()
              );
            }
            
            if (subcategoryInfo.itemGroupFilter) {
              filteredProducts = filteredProducts.filter((product: Product) => 
                product.itemgroup_product.toLowerCase() === subcategoryInfo.itemGroupFilter.toLowerCase()
              );
            }
          }

          // Filter by URL query parameters
          const discountParam = searchParams.get('discount');
          const minPriceParam = searchParams.get('minPrice');

          // Filter by discount if discount=true
          if (discountParam === 'true') {
            filteredProducts = filteredProducts.filter((product: Product) => 
              product.discount_product && parseFloat(product.discount_product) > 0
            );
          }

          // Filter by minimum price
          if (minPriceParam) {
            const minPrice = parseFloat(minPriceParam);
            filteredProducts = filteredProducts.filter((product: Product) => 
              parseFloat(product.price_product) >= minPrice
            );
          }

          setAllProducts(filteredProducts);
          setFilteredProducts(filteredProducts);
          setProducts(filteredProducts);
        } else {
          setError('Erreur lors du chargement des produits');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory, searchParams]);

  // Function to apply additional filters
  const applyFilters = (filters: CategoryFiltersType) => {
    let filtered = [...allProducts];

    // Apply item group filter
    if (filters.itemGroup) {
      filtered = filtered.filter((product) => 
        product.itemgroup_product.toLowerCase() === filters.itemGroup.toLowerCase()
      );
    }

    // Apply price filters
    if (filters.minPrice > 0) {
      filtered = filtered.filter((product) => 
        parseFloat(product.price_product) >= filters.minPrice
      );
    }

    if (filters.maxPrice < 5000) {
      filtered = filtered.filter((product) => 
        parseFloat(product.price_product) <= filters.maxPrice
      );
    }

    // Apply size filter
    if (filters.size) {
      filtered = filtered.filter((product) => {
        const sizeFields = ['xs_size', 's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', '48_size', '50_size', '52_size', '54_size', '56_size', '58_size'];
        return sizeFields.some(field => {
          const fieldValue = product[field as keyof Product];
          return fieldValue && parseInt(fieldValue as string) > 0 && field.includes(filters.size.toLowerCase());
        });
      });
    }

    // Apply color filter
    if (filters.color) {
      filtered = filtered.filter((product) => 
        product.color_product.toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => parseFloat(a.price_product) - parseFloat(b.price_product));
        break;
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.price_product) - parseFloat(a.price_product));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdate_product).getTime() - new Date(a.createdate_product).getTime());
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.nom_product.localeCompare(b.nom_product));
        break;
    }

    setFilteredProducts(filtered);
    setProducts(filtered);
  };

  const categoryInfo = getCategoryInfo();
  const subcategoryInfo = getSubcategoryInfo();

  const getPageTitle = () => {
    if (subcategory) {
      const parts = subcategory.split('-');
      if (parts.length === 2) {
        const [categoryPart, itemGroup] = parts;
        const categoryLabel = categoryPart === 'homme' ? 'Homme' : categoryPart === 'femme' ? 'Femme' : categoryPart;
        return `${categoryLabel} - ${itemGroup.charAt(0).toUpperCase() + itemGroup.slice(1)}`;
      }
      return subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
    }
    return categoryInfo.title;
  };

  const getBreadcrumb = () => {
    const breadcrumbs = [
      { label: 'Accueil', path: '/' },
      { label: categoryInfo.title, path: `/category/${category}` }
    ];

    if (subcategory) {
      breadcrumbs.push({ 
        label: getPageTitle(), 
        path: `/category/${category}/${subcategory}` 
      });
    }

    return breadcrumbs;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-montserrat">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600 font-hm-sans">Chargement des produits...</p>
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
        <SocialSidebar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white font-montserrat">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-red-600 font-hm-sans mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
        <SocialSidebar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <Header />
      <main>
        {/* Header section */}
        <div className="bg-gray-50 border-b border-gray-200 pt-16">{/* Reduced spacing for header */}
          <div className="container mx-auto px-4 py-6">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 font-hm-sans"
            >
              <ChevronLeft size={20} />
              Retour
            </button>

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-2 text-sm mb-6 font-hm-sans">{/* Added flex-wrap for mobile */}
              {getBreadcrumb().map((item, index) => (
                <React.Fragment key={item.path}>
                  {index > 0 && <span className="text-gray-400">/</span>}
                  <button
                    onClick={() => navigate(item.path)}
                    className={`hover:text-black transition-colors text-xs sm:text-sm ${
                      index === getBreadcrumb().length - 1 
                        ? 'text-black font-medium' 
                        : 'text-gray-600'
                    }`}
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </nav>

            {/* Page title */}
            <div className="text-center">{/* Page title section */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-black mb-4 font-hm-sans">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 font-hm-sans max-w-2xl mx-auto text-sm sm:text-base">
                {subcategory 
                  ? `Découvrez notre sélection de ${getPageTitle().toLowerCase()}`
                  : categoryInfo.description
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Filters section */}
        <CategoryFilters 
          onFiltersChange={applyFilters}
          resultsCount={products.length}
        />
        
        {/* Products section */}
        <div className="container mx-auto px-4 py-8 sm:py-12">{/* Responsive padding */}
          {products.length > 0 ? (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <p className="text-gray-600 font-hm-sans text-sm sm:text-base">
                  {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
                </p>
              </div>
              {/* Products grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">{/* Responsive grid and gap */}
              {products.map((product) => {
                // Convert API product to ProductCard format
                const imageUrl = product.img_product.startsWith('uploads/') 
                  ? `https://draminesaid.com/lucci/${product.img_product}`
                  : product.img_product;
                
                // Debug logging for images
                console.log('Product image debug:', {
                  productName: product.nom_product,
                  originalImg: product.img_product,
                  constructedUrl: imageUrl
                });
                
                // Convert TND to EUR (approximate rate: 1 EUR = 3.3 TND)
                const tndToEurRate = 0.303; // 1 TND = ~0.303 EUR
                const priceInEur = Math.round(parseFloat(product.price_product) * tndToEurRate * 100) / 100;
                const originalPriceInEur = product.discount_product && parseFloat(product.discount_product) > 0 
                  ? Math.round(parseFloat(product.price_product) * tndToEurRate * 100) / 100
                  : undefined;
                
                const adaptedProduct = {
                  id: product.id_product,
                  name: product.nom_product,
                  price: priceInEur,
                  originalPrice: originalPriceInEur,
                  image: imageUrl,
                  images: [
                    imageUrl,
                    product.img2_product ? `https://draminesaid.com/lucci/${product.img2_product}` : imageUrl,
                    product.img3_product ? `https://draminesaid.com/lucci/${product.img3_product}` : imageUrl,
                    product.img4_product ? `https://draminesaid.com/lucci/${product.img4_product}` : imageUrl
                  ].filter(Boolean),
                  category: product.type_product,
                  sizes: ['S', 'M', 'L', 'XL'], // Default sizes, you can enhance this later
                  colors: [product.color_product || 'Noir'],
                  isNew: false,
                  isOnSale: product.discount_product && parseFloat(product.discount_product) > 0,
                  description: product.description_product,
                  rating: 4.5, // Default rating
                  reviews: 12, // Default reviews
                  stock: parseInt(product.qnty_product) || 10,
                  // Include size data and itemgroup for size logic
                  itemgroup_product: product.itemgroup_product,
                  xs_size: product.xs_size,
                  s_size: product.s_size,
                  m_size: product.m_size,
                  l_size: product.l_size,
                  xl_size: product.xl_size,
                  xxl_size: product.xxl_size,
                  '3xl_size': product['3xl_size'],
                  '4xl_size': product['4xl_size'],
                  '48_size': product['48_size'],
                  '50_size': product['50_size'],
                  '52_size': product['52_size'],
                  '54_size': product['54_size'],
                  '56_size': product['56_size'],
                  '58_size': product['58_size'],
                  qnty_product: product.qnty_product
                };
                
                return <ProductCard key={product.id_product} product={adaptedProduct} />;
              })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto px-4">
                <div className="bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">{/* Responsive icon size */}
                  <Filter className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 font-hm-sans">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 font-hm-sans text-sm sm:text-base mb-4 sm:mb-6">{/* Responsive text and margin */}
                  Aucun produit ne correspond à cette catégorie pour le moment.
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="mt-4 sm:mt-6"
                >
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      <SocialSidebar />
    </div>
  );
};

export default Category;