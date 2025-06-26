
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

interface CategoryBreadcrumbProps {
  category?: string;
  subcategory?: string;
}

const CategoryBreadcrumb = ({ category, subcategory }: CategoryBreadcrumbProps) => {
  const { t } = useTranslation(['products']);

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
    <div className="mb-8">
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
              <Link to="/produits" className="text-slate-600 hover:text-slate-900">
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
                      {t(`products:categories.${category}`)}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-slate-900 font-medium">
                    {t(`products:categories.${category}`)}
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
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CategoryBreadcrumb;
