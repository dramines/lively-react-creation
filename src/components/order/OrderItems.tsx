import React from 'react';
import { motion } from 'framer-motion';
import { CartItem } from '@/components/cart/CartProvider';
import { getPersonalizations } from '@/utils/personalizationStorage';

interface OrderItemsProps {
  items: CartItem[];
}

const OrderItems = ({ items }: OrderItemsProps) => {
  const personalizations = getPersonalizations();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6 mb-6"
    >
      <h2 className="text-xl font-medium mb-4 text-[#471818]">Articles commandés</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 py-4 border-b last:border-0 hover:bg-gray-50 transition-colors rounded-lg p-2"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">{item.name}</h3>
              <p className="text-gray-600">Quantité: {item.quantity}</p>
              {personalizations[item.id] && (
                <div className="mt-2 bg-gray-50 p-2 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Personnalisation:</span> {personalizations[item.id]}
                  </p>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium text-lg">{item.price.toFixed(2)} TND</p>
              <p className="text-sm text-gray-500">
                Total: {(item.price * item.quantity).toFixed(2)} TND
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderItems;