import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard } from 'lucide-react';
import TopNavbar from '@/components/TopNavbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import DeliveryDetails from '@/components/order/DeliveryDetails';
import OrderItems from '@/components/order/OrderItems';
import OrderSummary from '@/components/order/OrderSummary';
import { HoldToConfirmButton } from '@/components/order/HoldToConfirmButton';

const OrderPreviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleConfirmOrder = () => {
    toast({
      title: "Commande confirmée",
      description: "Votre commande a été confirmée avec succès",
      style: {
        backgroundColor: '#700100',
        color: 'white',
        border: '1px solid #590000',
      },
    });
    navigate('/payment-success');
  };

  if (!state?.orderDetails) {
    navigate('/cart');
    return null;
  }

  const { items, userDetails, total, shipping, finalTotal } = state.orderDetails;

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <TopNavbar />
      <div className="container mx-auto px-4 py-8 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-[#700100] hover:text-[#591C1C] mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour au panier
          </button>

          <h1 className="text-3xl font-serif text-[#1A1F2C] mb-8">
            Aperçu de votre commande
          </h1>
          
          <DeliveryDetails userDetails={userDetails} />
          <OrderItems items={items} />
          <OrderSummary 
            total={total}
            shipping={shipping}
            finalTotal={finalTotal}
          />

          <HoldToConfirmButton onConfirm={handleConfirmOrder} />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderPreviewPage;