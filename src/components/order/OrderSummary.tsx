import React from 'react';
import { motion } from 'framer-motion';

interface OrderSummaryProps {
  total: number;
  shipping: number;
  finalTotal: number;
}

const OrderSummary = ({ total, shipping, finalTotal }: OrderSummaryProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6 mb-6"
    >
      <h2 className="text-xl font-medium mb-4 text-[#471818]">Résumé de la commande</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Sous-total</span>
          <span>{total.toFixed(2)} TND</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Livraison</span>
          <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} TND`}</span>
        </div>
        <div className="flex justify-between font-medium text-lg pt-3 border-t">
          <span>Total</span>
          <span>{finalTotal.toFixed(2)} TND</span>
        </div>
        <p className="text-sm text-gray-500">TVA incluse</p>
        <div className="mt-4 p-4 bg-[#F8F8F8] rounded-lg">
          <h3 className="font-medium mb-2">Informations importantes</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Paiement à la livraison disponible</li>
            <li>• Livraison gratuite à partir de 500 TND</li>
            <li>• Retours gratuits sous 14 jours</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;