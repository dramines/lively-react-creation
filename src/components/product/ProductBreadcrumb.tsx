
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';

interface ProductBreadcrumbProps {
  category?: string;
  subcategory?: string;
  productName: string;
}

const ProductBreadcrumb = ({ category, subcategory, productName }: ProductBreadcrumbProps) => {
  const { t } = useTranslation(['products']);

  const getCategoryLink = () => {
    if (!category) return '/';
    if (subcategory) return `/category/${category}/${subcategory}`;
    return `/category/${category}`;
  };

  const getCategoryName = () => {
    if (!category) return 'Home';
    
    if (subcategory) {
      // Try direct translation first
      const directKey = `${category}-${subcategory}`;
      const directTranslation = t(`products:${directKey}`, { defaultValue: null });
      if (directTranslation) {
        return directTranslation;
      }
      
      // Fallback to nested translation
      return t(`products:${category}.${subcategory}`, { 
        defaultValue: t(`products:categories.${category}`) 
      });
    }
    
    return t(`products:categories.${category}`);
  };

  return (
    <nav className="hidden md:flex items-center space-x-2 text-sm text-slate-600 mb-4">
      <Link 
        to="/" 
        className="hover:text-slate-900 transition-colors uppercase tracking-wide"
      >
        HOME
      </Link>
      
      {category && (
        <>
          <ChevronRight className="w-4 h-4" />
          <Link 
            to={getCategoryLink()} 
            className="hover:text-slate-900 transition-colors uppercase tracking-wide"
          >
            {getCategoryName()}
          </Link>
        </>
      )}
      
      <ChevronRight className="w-4 h-4" />
      <span className="text-slate-900 uppercase tracking-wide">
        {productName}
      </span>
    </nav>
  );
};

export default ProductBreadcrumb;
