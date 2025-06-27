import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface ProductDropdownProps {
  isOpen: boolean;
  activeCategory: string | null;
  onClose: () => void;
}

const ProductDropdown = ({ isOpen, activeCategory, onClose }: ProductDropdownProps) => {
  const { t } = useTranslation('products');
  const navigate = useNavigate();

  if (!isOpen || !activeCategory) return null;

  const handleCategoryClick = (category: string, item?: string) => {
    console.log('Category clicked:', category, item);
    
    // Navigate to the appropriate category page
    if (item) {
      // Navigate to subcategory page
      navigate(`/category/${category}/${item}`);
    } else {
      // Navigate to main category page
      navigate(`/category/${category}`);
    }
    
    onClose();
  };

  // Prevent dropdown from closing when clicking inside
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const renderSurMesureContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Homme */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {t('surMesure.homme.title')}
          </h4>
          <div className="space-y-2">
            {Object.entries(t('surMesure.homme', { returnObjects: true }) as Record<string, string>)
              .filter(([key]) => key !== 'title')
              .map(([key, value]) => (
                <button
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick('surMesure', `homme-${key}`);
                  }}
                  className="block text-gray-600 hover:text-blue-600 transition-colors text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-50"
                >
                  {value}
                </button>
              ))}
          </div>
        </div>

        {/* Femme */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {t('surMesure.femme.title')}
          </h4>
          <div className="space-y-2">
            {Object.entries(t('surMesure.femme', { returnObjects: true }) as Record<string, string>)
              .filter(([key]) => key !== 'title')
              .map(([key, value]) => (
                <button
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick('surMesure', `femme-${key}`);
                  }}
                  className="block text-gray-600 hover:text-blue-600 transition-colors text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-50"
                >
                  {value}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative group cursor-pointer" onClick={() => handleCategoryClick('surMesure')}>
        <img
          src="/lovable-uploads/187386b2-1a7f-4401-ab51-7965f2c25e8c.png"
          alt="Collection Sur Mesure"
          className="w-full h-64 object-cover object-top rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-end p-6">
          <div className="text-white">
            <h4 className="font-semibold text-lg">Collection Sur Mesure</h4>
            <p className="text-sm opacity-90">Découvrir la collection</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPretAPorterContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {t('categories.pretAPorter')}
        </h4>
        <div className="space-y-2">
          {Object.entries(t('pretAPorter', { returnObjects: true }) as Record<string, string>).map(([key, value]) => (
            <button
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick('pretAPorter', key);
              }}
              className="block text-gray-600 hover:text-blue-600 transition-colors text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-50"
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative group cursor-pointer" onClick={() => handleCategoryClick('pretAPorter')}>
        <img
          src="/lovable-uploads/49627e2d-81f4-410f-82e9-b2c89dfb56a7.png"
          alt="Prêt à Porter Collection"
          className="w-full h-64 object-cover object-top rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-end p-6">
          <div className="text-white">
            <h4 className="font-semibold text-lg">Prêt à Porter</h4>
            <p className="text-sm opacity-90">Voir la collection</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessoiresContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {t('categories.accessoires')}
        </h4>
        <div className="space-y-2">
          {Object.entries(t('accessoires', { returnObjects: true }) as Record<string, string>).map(([key, value]) => (
            <button
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick('accessoires', key);
              }}
              className="block text-gray-600 hover:text-blue-600 transition-colors text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-50"
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative group cursor-pointer" onClick={() => handleCategoryClick('accessoires')}>
        <img
          src="/lovable-uploads/1f13be60-8b8e-4827-9e4b-b21cdac42202.png"
          alt="Accessoires Collection"
          className="w-full h-64 object-cover object-top rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-end p-6">
          <div className="text-white">
            <h4 className="font-semibold text-lg">Accessoires</h4>
            <p className="text-sm opacity-90">Découvrir les accessoires</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'surMesure':
        return renderSurMesureContent();
      case 'pretAPorter':
        return renderPretAPorterContent();
      case 'accessoires':
        return renderAccessoiresContent();
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-x-0 z-50 bg-white shadow-lg border-t border-gray-100" 
      style={{ top: 'calc(42px + 88px - 1px)' }}
      onClick={handleDropdownClick}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProductDropdown;
