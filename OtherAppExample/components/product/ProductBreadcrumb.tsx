
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface ProductBreadcrumbProps {
  category?: string;
  subcategory?: string;
  productName?: string;
}

const ProductBreadcrumb = ({ category, subcategory, productName }: ProductBreadcrumbProps) => {
  const { t } = useTranslation(['products']);

  const getCategoryTitle = () => {
    if (!category) return '';
    
    // Check for special category mappings
    if (category === 'pretAPorter') {
      return t('products:categories.pretAPorter');
    }
    if (category === 'accessoires') {
      return t('products:categories.accessoires');
    }
    if (category === 'surMesure') {
      return t('products:categories.surMesure');
    }
    
    // Default category translation
    return t(`products:categories.${category}`, { defaultValue: category });
  };

  const getSubcategoryTitle = () => {
    if (!category || !subcategory) return '';
    
    // First try direct subcategory translation
    const subcategoryKey = `${category}-${subcategory}`;
    const directTranslation = t(`products:${subcategoryKey}`, { defaultValue: null });
    if (directTranslation) {
      return directTranslation;
    }
    
    // Fallback to nested translation
    return t(`products:${category}.${subcategory}`, { 
      defaultValue: subcategory 
    });
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="text-slate-600 hover:text-slate-900">
                Accueil
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          <BreadcrumbSeparator />
          
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/category/all" className="text-slate-600 hover:text-slate-900">
                Produits
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {subcategory ? (
                  <BreadcrumbLink asChild>
                    <Link 
                      to={`/category/${category}`} 
                      className="text-slate-600 hover:text-slate-900"
                    >
                      {getCategoryTitle()}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-slate-900 font-medium">
                    {getCategoryTitle()}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}
          
          {subcategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 font-medium">
                  {getSubcategoryTitle()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          
          {productName && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 font-medium">
                  {productName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ProductBreadcrumb;
