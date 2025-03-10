
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const Projets = () => {
  const [projects, setProjects] = useState([]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Projets</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouveau projet
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Fonctionnalité à venir</h3>
          <p className="text-gray-400">
            La gestion des projets sera bientôt disponible. Restez à l'écoute pour les mises à jour.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Projets;
