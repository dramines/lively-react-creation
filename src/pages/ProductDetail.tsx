import { motion } from 'framer-motion';
import { ChevronLeft, Leaf, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PRODUCTS } from '../config/products';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { getProductTranslationPath } from '../utils/productTranslations';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

type TabType = 'description' | 'ingredients' | 'nutrition';

const ProductDetail = ({ productId, onBack }: ProductDetailProps) => {
  const { t } = useTranslation();
  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('description');
  
  // Get client type directly from cookies - same approach as navbar
  const clientType = Cookies.get('clientType');
  console.log("Direct client type check:", clientType);
  
  // Find the product by ID from our products config
  const product = PRODUCTS.find(p => p.id === productId);
  
  // If product not found, use fallback data
  const fallbackProduct = {
    title: 'Dattes Deglet Nour Premium',
    description: 'Nos dattes Deglet Nour sont soigneusement sélectionnées et récoltées à la main au moment optimal de leur maturité. Leur texture moelleuse et leur goût équilibré en font un produit d\'exception, parfait pour une collation saine ou pour vos créations culinaires.',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    isOrganic: true,
    isFairTrade: true,
    certifications: [],
    ingredients: [
      "Dattes Deglet Nour",
      "Sans additifs",
      "Sans conservateurs",
      "100% naturel"
    ]
  };
  
  const productData = product || fallbackProduct;
  
  // Get translation info for the product title
  const titleTranslation = getProductTranslationPath(productData.title);

  // Check product type to determine nutritional info
  const isDatePackage = productData.title?.includes('1kg') || productData.title?.includes('500G');
  const isCoffretDattes = productData.title?.includes('Coffret Dattes');
  const isBarquetteDattes = productData.title?.includes('Barquette Dattes');
  const isDattesStandard = productData.title?.includes('Dattes Standard');
  const isFiguesSechees = productData.title?.includes('Figues Séchées');
  const isCafeDattes = productData.title?.includes('Café de Noyaux');
  const isSucreDattes = productData.title?.includes('Poudre (Sucre)');
  const isSiropDattes = productData.title?.includes('Sirop de Dattes');
  
  // Show nutrition info for all products that have calorie information
  const showNutritionInfo = isDatePackage || isCoffretDattes || isBarquetteDattes || 
                           isDattesStandard || isFiguesSechees || isCafeDattes || 
                           isSucreDattes || isSiropDattes;

  // Get nutritional facts based on product type
  const getNutritionFacts = () => {
    if (isDatePackage || isCoffretDattes || isBarquetteDattes || isDattesStandard) {
      return [
        { name: 'Énergie / Energie', value: '306', unit: 'kcal/1279kJ', dailyValue: '15.3%' },
        { name: 'Glucides / Carbohydrates', value: '70', unit: 'g', dailyValue: '26.9%' },
        { name: 'dont Sucres / Of which sugars', value: '70', unit: 'g', dailyValue: '77.8%' },
        { name: 'Fibres / Fiber', value: '6.25', unit: 'g', dailyValue: '25%' },
        { name: 'Protéines / Protein', value: '2.2', unit: 'g', dailyValue: '4.4%' },
        { name: 'Matières grasses / Fat', value: '0.2', unit: 'g', dailyValue: '0.3%' },
        { name: 'Sel / Salt', value: '0.1', unit: 'g', dailyValue: '1.7%' },
      ];
    } else if (isFiguesSechees) {
      return [
        { name: 'Énergie / Energie', value: '252', unit: 'kcal/1054kJ', dailyValue: '12.6%' },
        { name: 'Glucides / Carbohydrates', value: '50', unit: 'g', dailyValue: '19.2%' },
        { name: 'dont Sucres / Of which sugars', value: '50', unit: 'g', dailyValue: '55.6%' },
        { name: 'Fibres / Fiber', value: '6.25', unit: 'g', dailyValue: '25%' },
        { name: 'Protéines / Protein', value: '3.4', unit: 'g', dailyValue: '6.8%' },
        { name: 'Matières grasses / Fat', value: '0.4', unit: 'g', dailyValue: '0.6%' },
        { name: 'Sel / Salt', value: '0.1', unit: 'g', dailyValue: '1.7%' },
      ];
    } else if (isCafeDattes) {
      return [
        { name: 'Énergie / Energie', value: '15', unit: 'kcal/63kJ', dailyValue: '0.75%' },
        { name: 'Glucides / Carbohydrates', value: '0.5', unit: 'g', dailyValue: '0.2%' },
        { name: 'dont Sucres / Of which sugars', value: '0.5', unit: 'g', dailyValue: '0.6%' },
        { name: 'Fibres / Fiber', value: '0', unit: 'g', dailyValue: '0%' },
        { name: 'Protéines / Protein', value: '0.5', unit: 'g', dailyValue: '1%' },
        { name: 'Matières grasses / Fat', value: '0.5', unit: 'g', dailyValue: '0.7%' },
        { name: 'Sel / Salt', value: '0', unit: 'g', dailyValue: '0%' },
      ];
    } else if (isSucreDattes) {
      return [
        { name: 'Énergie / Energie', value: '349', unit: 'kcal/1460kJ', dailyValue: '17.5%' },
        { name: 'Glucides / Carbohydrates', value: '80.1', unit: 'g', dailyValue: '30.8%' },
        { name: 'dont Sucres / Of which sugars', value: '80.1', unit: 'g', dailyValue: '89%' },
        { name: 'Fibres / Fiber', value: '3.2', unit: 'g', dailyValue: '12.8%' },
        { name: 'Protéines / Protein', value: '0', unit: 'g', dailyValue: '0%' },
        { name: 'Matières grasses / Fat', value: '0', unit: 'g', dailyValue: '0%' },
        { name: 'Sel / Salt', value: '0', unit: 'g', dailyValue: '0%' },
      ];
    } else if (isSiropDattes) {
      return [
        { name: 'Énergie / Energie', value: '300', unit: 'kcal/1255kJ', dailyValue: '15%' },
        { name: 'Glucides / Carbohydrates', value: '71', unit: 'g', dailyValue: '27.3%' },
        { name: 'dont Sucres / Of which sugars', value: '71', unit: 'g', dailyValue: '78.9%' },
        { name: 'Fibres / Fiber', value: '0.5', unit: 'g', dailyValue: '2%' },
        { name: 'Protéines / Protein', value: '1.29', unit: 'g', dailyValue: '2.6%' },
        { name: 'Matières grasses / Fat', value: '0.3', unit: 'g', dailyValue: '0.4%' },
        { name: 'Sel / Salt', value: '0', unit: 'g', dailyValue: '0%' },
      ];
    }
    
    // Default nutrition facts
    return [
      { name: 'Énergie / Energie', value: '306', unit: 'kcal/1279kJ', dailyValue: '15.3%' },
      { name: 'Glucides / Carbohydrates', value: '70', unit: 'g', dailyValue: '26.9%' },
      { name: 'dont Sucres / Of which sugars', value: '70', unit: 'g', dailyValue: '77.8%' },
      { name: 'Fibres / Fiber', value: '2.5', unit: 'g', dailyValue: '10%' },
      { name: 'Protéines / Protein', value: '2.2', unit: 'g', dailyValue: '4.4%' },
      { name: 'Matières grasses / Fat', value: '0.2', unit: 'g', dailyValue: '0.3%' },
      { name: 'Sel / Salt', value: '0.1', unit: 'g', dailyValue: '1.7%' },
    ];
  };

  // Get calorie display value based on product type
  const getCalorieDisplayValue = () => {
    if (isDatePackage || isCoffretDattes || isBarquetteDattes || isDattesStandard) {
      return "306 kcal";
    } else if (isFiguesSechees) {
      return "252 kcal";
    } else if (isCafeDattes) {
      return "15 kcal";
    } else if (isSucreDattes) {
      return "349 kcal";
    } else if (isSiropDattes) {
      return "300 kcal";
    }
    return "306 kcal";
  };

  const nutritionFacts = getNutritionFacts();
  const calorieDisplay = getCalorieDisplayValue();

  const packagingData = [
    {
      designation: 'Coffret cadeau dattes naturelles 1kg en bois',
      paquetsCarton: '10',
      cartonsPalette: '64',
      poidsNetPal: '640',
      poidsBrutPal: '780',
      hteurPal: '1,8',
      palSR: '33',
      palConteneur: '10'
    },
    {
      designation: 'Coffret cadeau dattes naturelles 500g en bois',
      paquetsCarton: '20',
      cartonsPalette: '64',
      poidsNetPal: '640',
      poidsBrutPal: '780',
      hteurPal: '1,8',
      palSR: '33',
      palConteneur: '10'
    }
  ];

  const technicalSpecs = [
    { label: 'Description', value: 'Datte Deglet Nour branchée de couleur jaune à brune' },
    { label: 'Conservation', value: '12 mois – température de 0°C à 4°C HR<65%' },
    { label: 'Période de récolte', value: 'Octobre à décembre' },
    { label: 'Région', value: 'Zaafrane-Douz-Kébili' },
    { label: 'Usage', value: 'Consommation' },
    { label: 'Etat', value: 'Avec noyaux' },
    { label: 'Type', value: 'Grasse comprise entre 20% et 30%' }
  ];

  // Get translated description based on product type
  const getTranslatedDescription = () => {
    let descriptionKey = '';
    
    if (product?.category === 'dattes-fraiches' || product?.category === 'dattes-transformees' || product?.category === 'dattes-en-vrac') {
      descriptionKey = 'products.dates_description_premium';
    } else if (product?.category === 'figues-sechees' || 
              product?.category === 'figues-sechees-toujane' || 
              product?.category === 'figues-sechees-zidi' || 
              product?.category === 'figues-sechees-vrac' || 
              product?.category === 'figues-sechees-djebaa') {
      descriptionKey = 'products.figs_description_premium';
    } else if (product?.category === 'cafe-dattes') {
      descriptionKey = 'products.date_coffee_description';
    } else if (product?.category === 'sucre-dattes') {
      descriptionKey = 'products.date_sugar_description';
    } else if (product?.category === 'sirop-dattes') {
      descriptionKey = 'products.date_syrup_description';
    }
    
    return descriptionKey ? t(descriptionKey) : '';
  };

  // Get translated ingredient note
  const getTranslatedIngredientNote = () => {
    if (product?.category === 'dattes-fraiches' || product?.category === 'dattes-transformees' || product?.category === 'dattes-en-vrac') {
      return t('products.dates_ingredient_note');
    } else {
      return t('products.general_ingredient_note');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6F0]/50 to-white/50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center text-[#700100] hover:text-[#96cc39] transition-colors bg-transparent px-4 py-2 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            {t('products.back_to_products')}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100">
              <img
                src={productData.image}
                alt={titleTranslation.key ? t(titleTranslation.key) : titleTranslation.fallback}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                {productData.isOrganic && (
                  <span className="bg-[#96cc39] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                    <Leaf className="w-4 h-4" />
                    {t('products.organic')}
                  </span>
                )}
              
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-playfair text-[#700100] mb-4">
                {titleTranslation.key ? t(titleTranslation.key) : titleTranslation.fallback}
              </h1>
              
              {/* Display calories information when available */}
              {showNutritionInfo && (
                <div className="mb-4 bg-[#96cc39]/10 p-3 rounded-lg inline-block">
                  <p className="text-sm font-medium text-[#700100]">
                    <span className="font-bold">{calorieDisplay}</span>
                    <span className="ml-1 text-gray-600">{t('products.per_portion')}</span>
                  </p>
                </div>
              )}
              
              {/* Tabs Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <button 
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'description' 
                      ? 'text-[#700100] border-b-2 border-[#700100]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('products.description')}
                </button>
               {/*  <button 
                  onClick={() => setActiveTab('ingredients')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'ingredients' 
                      ? 'text-[#700100] border-b-2 border-[#700100]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('products.ingredients')}
                </button> */}
                <button 
                  onClick={() => setActiveTab('nutrition')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'nutrition' 
                      ? 'text-[#700100] border-b-2 border-[#700100]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('products.nutritional_values')}
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="min-h-[200px]">
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-600 leading-relaxed text-lg"
                  >
                    {/* Only show one description, prioritizing the translated one if available */}
                    {getTranslatedDescription() || productData.description}
                  </motion.div>
                )}
                
                {/* Ingredients Tab */}
                {activeTab === 'ingredients' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ul className="space-y-2">
                      {productData.ingredients?.map((ingredient, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-[#96cc39] mr-3 flex-shrink-0"></span>
                          <span className="text-gray-600">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 text-gray-600 text-sm italic">
                      {getTranslatedIngredientNote()}
                    </p>
                  </motion.div>
                )}
                
                {/* Nutrition Tab */}
                {activeTab === 'nutrition' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                  >
                    <div className="divide-y divide-gray-100">
                      {nutritionFacts.map((fact, index) => (
                        <motion.div
                          key={fact.name}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-gray-700 font-medium">{fact.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-[#700100] font-semibold">
                              {fact.value} {fact.unit}
                            </span>
                            {fact.dailyValue && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {fact.dailyValue}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-50 text-xs text-gray-500 italic">
                      {t('products.nutrition_note')}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* B2B Only Section */}
        {clientType === 'B2B' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 space-y-12"
          >
            <div>
              <h2 className="text-2xl font-playfair text-[#700100] mb-6">
                {t('products.packaging_info')}
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-gradient-to-br from-[#64381b] to-[#4e2b15] text-white">
                        <th className="px-6 py-4 text-left text-sm font-semibold">{t('products.packaging_designation')}</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">{t('products.packaging_packs_carton')}</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">{t('products.packaging_cartons_pallet')}</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">{t('products.packaging_net_weight')}</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">{t('products.packaging_gross_weight')}</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">{t('products.packaging_height')}</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">{t('products.packaging_pal_sr')}</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">{t('products.packaging_pal_container')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {packagingData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.designation}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.paquetsCarton}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.cartonsPalette}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.poidsNetPal}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.poidsBrutPal}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.hteurPal}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.palSR}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.palConteneur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-[#700100] mb-6">
                {t('products.technical_specs')}
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="px-6 py-4 bg-gradient-to-br from-[#64381b] to-[#4e2b15]">
                  <h3 className="text-xl font-playfair text-white">{t('products.technical_sheet')}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {technicalSpecs.map((spec, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors gap-2">
                      <span className="text-sm font-medium text-[#700100]">{spec.label}</span>
                      <span className="text-sm text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
       
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;