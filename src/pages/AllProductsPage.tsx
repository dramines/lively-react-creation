
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from "@/components/layout/Layout";
import CategoryProducts from '@/components/category/CategoryProducts';
import { Button } from '@/components/ui/button';
import { trackVisitor } from "@/utils/visitorTracking";

interface Product {
  id_product: number;
  nom_product: string;
  price_product: string;
  discount_product?: string;
  img_product: string;
  img2?: string;
  category_product: string;
  itemgroup_product: string;
  type_product: string;
}

const AllProductsPage = () => {
  const { t } = useTranslation(['allProducts', 'common']);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Track visitor to all products page
    trackVisitor('All Products');
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/get_all_products.php');
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching all products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Layout>
      {() => (
        <div className="min-h-screen bg-white">
          {/* Header Section */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
              {/* Back Button */}
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 p-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('allProducts:backButton')}
                </Button>
              </div>

              {/* Page Title */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 mb-6 tracking-wide">
                  {t('allProducts:title')}
                </h1>
                <div className="w-12 md:w-16 h-px bg-slate-900 mx-auto mb-8"></div>
                <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
                  {t('allProducts:description', { count: products.length })}
                </p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-600">{t('allProducts:loading')}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600">{t('allProducts:noProducts')}</p>
              </div>
            ) : (
              <CategoryProducts
                products={products}
                loading={loading}
                likedProducts={likedProducts}
                onToggleLike={handleToggleLike}
              />
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllProductsPage;
