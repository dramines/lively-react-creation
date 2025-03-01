
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '@/config/products';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';

const metierTitles: { [key: string]: string } = {
  'Industrie': 'Industrie & Boucherie',
  'Transport': 'Services & Transport',
  'Restauration': 'Restauration & Cuisine',
  'Médical': 'Secteur Médical',
  'Marketing': 'Marketing & Communication',
  'Bâtiment': 'Bâtiment & Construction'
};

const MetierProducts = () => {
  const { metierType } = useParams();
  const navigate = useNavigate();
  
  const metierProducts = products.filter(product => 
    product.metier_type === decodeURIComponent(metierType || '')
  );

  // Get unique categories for this métier
  const categories = Array.from(new Set(metierProducts.map(product => product.type)));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const title = metierTitles[decodeURIComponent(metierType || '')] || decodeURIComponent(metierType || '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative bg-[#1a9edc] text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="relative container mx-auto px-4 py-20">
          <Button 
            variant="ghost" 
            className="mb-6 text-white hover:bg-white/20" 
            onClick={() => navigate('/metiers')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux métiers
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Découvrez notre gamme complète de produits professionnels, conçue spécialement 
              pour répondre aux besoins spécifiques de votre secteur.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {categories.map((category) => (
            <motion.section
              key={category}
              variants={itemVariants}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold capitalize mb-2">
                    {category.replace('-', ' ')}
                  </h2>
                  <p className="text-gray-600">
                    Trouvez les meilleurs {category.toLowerCase()} pour votre activité
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center gap-2"
                  onClick={() => navigate(`/categories/${category.toLowerCase()}`)}
                >
                  Voir tout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {metierProducts
                  .filter(product => product.type === category)
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        description={product.description}
                        price={product.startingPrice}
                        image={product.image || '/placeholder.png'}
                        isPersonalizable={product.isPersonalizable}
                      />
                    </motion.div>
                  ))}
              </div>

              <div className="flex justify-center md:hidden">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(`/categories/${category.toLowerCase()}`)}
                >
                  Voir tous les {category.toLowerCase()}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.section>
          ))}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-primary text-white py-16 mt-16"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Besoin d'aide pour choisir vos équipements ?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Notre équipe d'experts est là pour vous guider dans votre choix et 
              répondre à toutes vos questions.
            </p>
            <Button 
              onClick={() => navigate('/devis')}
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Demander un devis gratuit
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MetierProducts;
