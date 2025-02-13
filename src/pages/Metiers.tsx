
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const metiers = [
  {
    title: 'Médical',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c',
    description: 'Blouses, uniformes et accessoires pour les professionnels de santé',
    categories: ['Blouses', 'Uniformes', 'Chaussures', 'Accessoires'],
    color: 'from-blue-100 to-blue-200'
  },
  {
    title: 'Industrie',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    description: 'Équipements de protection et vêtements techniques pour l\'industrie',
    categories: ['EPI', 'Combinaisons', 'Chaussures de sécurité', 'Gants'],
    color: 'from-blue-100 to-blue-200'
  },
  {
    title: 'Bâtiment',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
    description: 'Tenues professionnelles adaptées aux métiers du BTP',
    categories: ['Vestes', 'Pantalons', 'Casques', 'Accessoires'],
    color: 'from-blue-100 to-blue-200'
  },
  {
    title: 'Restauration',
    image: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf',
    description: 'Tenues élégantes et pratiques pour la restauration',
    categories: ['Vestes de cuisine', 'Tabliers', 'Pantalons', 'Toques'],
    color: 'from-blue-100 to-blue-200'
  },
  {
    title: 'Sécurité',
    image: 'https://images.unsplash.com/photo-1587578016785-bea53a782ea8',
    description: 'Équipements professionnels pour les agents de sécurité',
    categories: ['Uniformes', 'Chaussures', 'Accessoires', 'Protection'],
    color: 'from-blue-100 to-blue-200'
  },
  {
    title: 'Transport',
    image: 'https://cdn.manelli.fr/38578-large_default/veste-de-cuisine-homme-turnip-rse-manches-courtes-blanc-lafont.jpg',
    description: 'Tenues adaptées aux professionnels du transport',
    categories: ['Uniformes', 'Vestes', 'Accessoires', 'Chaussures'],
    color: 'from-blue-100 to-blue-200'
  }
];

const MetierCard = ({ metier, index }: { metier: typeof metiers[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.5 }} // 0.5 second delay between each card
      className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Background Container with Gradient */}
      <div className={`absolute bottom-0 w-full h-2/5 bg-gradient-to-br ${metier.color} rounded-2xl transition-all duration-300 group-hover:h-2/3`} />
      
      {/* Image Container with improved sizing */}
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
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
        <h3 
          className="text-2xl font-bold text-white mb-2"
          style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          {metier.title}
        </h3>
      </div>
    </motion.div>
  );
};

const Metiers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
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

      {/* Main Content */}
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
