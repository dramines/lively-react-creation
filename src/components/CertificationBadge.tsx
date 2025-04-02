
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield } from 'lucide-react';

const CertificationBadge = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-collapse after 5 seconds if expanded
    let timeout: NodeJS.Timeout;
    if (isExpanded) {
      timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isExpanded]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-20 md:top-[17%] right-0 z-50"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <motion.div
        className={`rounded-l-lg shadow-lg bg-white flex items-center ${
          isExpanded ? 'pl-4' : ''
        } border border-gray-200`}
        animate={{ width: isExpanded ? 'auto' : 'auto' }}
        transition={{ duration: 0.3 }}
      >
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="mr-1 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#700100]" />
              <p className="text-sm font-medium text-[#700100]">Certifications Excellence</p>
            </div>
            <p className="text-xs text-gray-700 font-medium">Standards Internationaux</p>
            <button 
              className="text-xs text-gray-500 mt-2 self-start hover:text-[#700100] transition-colors"
              onClick={() => setIsVisible(false)}
            >
              Masquer
            </button>
          </motion.div>
        )}
        
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative flex items-center justify-center p-2 rounded-lg group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src="/goldcertif.png" 
            alt="Certification Or" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          {!isExpanded && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2, type: "spring" }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-[#700100] rounded-full flex items-center justify-center"
            >
              <Award className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CertificationBadge;
