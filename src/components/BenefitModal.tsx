
import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  icon: React.ReactNode;
}

const BenefitModal = ({ isOpen, onClose, title, content, icon }: BenefitModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-[90%] sm:w-[80%] md:w-[60%] max-w-lg bg-white 
                       rounded-2xl shadow-2xl z-50 overflow-hidden"
            style={{ 
              maxHeight: 'min(calc(100vh - 4rem), 600px)',
              minHeight: '200px'
            }}
          >
            <div className="h-2 bg-gradient-to-r from-[#96cc39] to-[#7ba82f]" />
            
            <div className="relative p-4 sm:p-6 overflow-y-auto" 
                 style={{ maxHeight: 'calc(100vh - 6rem)' }}>
              <button
                onClick={onClose}
                className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100 
                         transition-colors duration-200 focus:outline-none focus:ring-2 
                         focus:ring-[#96cc39] focus:ring-opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#96cc39] to-[#7ba82f] 
                              shadow-lg transform -rotate-3">
                  <div className="transform rotate-3">
                    {React.cloneElement(icon as React.ReactElement, {
                      className: "w-5 h-5 text-white"
                    })}
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-playfair text-gray-900 leading-tight">
                  {title}
                </h2>
              </div>

              <div className="prose max-w-none prose-headings:font-playfair 
                            prose-headings:text-gray-900 prose-p:text-gray-600 
                            prose-strong:text-gray-900 prose-strong:font-semibold">
                <div dangerouslySetInnerHTML={{ __html: content }} 
                     className="space-y-3 [&_ul]:space-y-1.5 [&_li]:text-gray-600" />
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  Les informations fournies sont à titre indicatif. Consultez un professionnel de santé 
                  pour des conseils personnalisés.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BenefitModal;
