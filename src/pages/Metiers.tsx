
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "@/config/products";

// Helper function to count products per métier
const getProductCountByMetier = (metierType: string) => {
  return products.filter(product => product.metier_type === metierType).length;
};

const metiers = [
  {
    title: 'Boucherie',
    image: '/Metier/BoucherieMetier.png',
    description: 'Vêtements professionnels et accessoires pour les bouchers',
    categories: ['Tabliers', 'Vestes', 'Accessoires', 'Protection'],
    color: 'from-[#1a9edc] to-[#1a9edc]/80',
    metier_type: 'Industrie'
  },
  {
    title: 'Industrie',
    image: '/Metier/IndustryMetier.png',
    description: 'Équipements de protection et vêtements techniques industriels',
    categories: ['EPI', 'Combinaisons', 'Chaussures de sécurité', 'Gants'],
    color: 'from-[#1a9edc] to-[#1a9edc]/80',
    metier_type: 'Industrie'
  },
  {
    title: 'Services',
    image: '/Metier/ServicesMetier.png',
    description: 'Tenues professionnelles pour le secteur des services',
    categories: ['Uniformes', 'Tenues d\'accueil', 'Accessoires', 'Badges'],
    color: 'from-[#1a9edc] to-[#1a9edc]/80',
    metier_type: 'Transport'
  },
  {
    title: 'Restauration',
    image: '/Metier/RestaurentMetier.png',
    description: 'Tenues élégantes et pratiques pour la restauration',
    categories: ['Vestes de cuisine', 'Tabliers', 'Pantalons', 'Toques'],
    color: 'from-[#1a9edc] to-[#1a9edc]/80',
    metier_type: 'Restauration'
  },
  {
    title: 'Médical',
    image: '/Metier/MédicalMetier.png',
    description: 'Vêtements et équipements pour les professionnels de santé',
    categories: ['Blouses', 'Uniformes', 'Chaussures', 'Accessoires'],
    color: 'from-[#1a9edc] to-[#1a9edc]/80',
    metier_type: 'Médical'
  },
  {
    title: 'Marketing',
    image: '/Metier/MarketingMetier.png',
    description: 'Articles et supports publicitaires personnalisables',
    categories: ['Drapeaux', 'Goodies', 'Textiles', 'Signalétique'],
    color: 'from-[#1a9edc] to-[#1a9edc]/80',
    metier_type: 'Marketing'
  }
];

const MetierCard = ({ metier, index }: { metier: typeof metiers[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const productCount = getProductCountByMetier(metier.metier_type);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.5 }}
      className="group relative h-[400px] w-[90%] mx-auto rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/metier/${encodeURIComponent(metier.metier_type)}`)}
    >
      <div className={`absolute bottom-0 w-full h-2/5 bg-gradient-to-br ${metier.color} rounded-2xl transition-all duration-300 group-hover:h-2/3`} />
      
      <div className="absolute inset-0 w-full h-full p-8 flex items-center justify-center">
        <div className="relative w-full h-full overflow-hidden rounded-xl">
          <img 
            src={metier.image} 
            alt={metier.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            style={{
              objectPosition: 'center',
              aspectRatio: '1',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
        <h3 
          className="text-2xl font-bold text-white mb-2"
          style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          {metier.title}
        </h3>
        <p className="text-white/90 text-sm">
          {productCount} produits disponibles
        </p>
      </div>
    </motion.div>
  );
};

const Metiers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b)',
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto h-full flex flex-col justify-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            Nos Métiers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl"
            style={{
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
            }}
          >
            Des solutions professionnelles adaptées à chaque secteur d'activité
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metiers.map((metier, index) => (
            <MetierCard key={metier.title} metier={metier} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metiers;
