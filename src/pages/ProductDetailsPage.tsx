
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import ProductDetailsContent from '@/components/product/ProductDetailsContent';
import { trackVisitor } from '@/utils/visitorTracking';

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

const ProductDetailsPage = () => {
  const { t } = useTranslation(['products']);
  const { id } = useParams();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      trackVisitor(`Product Details: ${id}`);
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/get_single_product.php?id=${id}`);
      const result = await response.json();
      
      console.log('Product API response:', result);
      
      if (result.success) {
        setProduct(result.data);
      } else {
        console.error('API error:', result.message);
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <div className="aspect-[4/5] bg-slate-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-20 bg-slate-200 rounded"></div>
                  <div className="h-12 bg-slate-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            <h1 className="text-2xl font-serif text-slate-900 mb-4">Product Not Found</h1>
            <p className="text-slate-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ProductDetailsContent product={product} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
