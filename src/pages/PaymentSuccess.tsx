
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowRight, Download } from 'lucide-react';
import Header from '@/components/layout/Header';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ContactModal from '@/components/modals/ContactModal';
import StoreFinderModal from '@/components/modals/StoreFinderModal';
import { fetchOrderDetails } from '@/services/orderDetailsService';
import { generateOrderReceiptPDF } from '@/utils/orderReceiptGenerator';
import { confirmPaymentAndUpdateOrder } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('checkout');
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [isContactOpen, setIsContactOpen] = React.useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = React.useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [autoDownloadAttempted, setAutoDownloadAttempted] = useState(false);
  const { toast } = useToast();

  const paymentRef = searchParams.get('payment_ref');
  const orderId = searchParams.get('order_id');
  const paymentMethod = searchParams.get('payment_method');
  const testMode = searchParams.get('test_mode');

  const confirmPayment = async () => {
    if (!orderId || !paymentRef || orderConfirmed) return;

    try {
      console.log('Confirming payment for order:', orderId, 'with payment ref:', paymentRef);
      await confirmPaymentAndUpdateOrder(orderId, paymentRef);
      setOrderConfirmed(true);
      console.log('Payment confirmed successfully');
    } catch (error) {
      console.error('Error confirming payment:', error);
      // Don't throw error to prevent blocking the success page
    }
  };

  const generateAndDownloadReceipt = async () => {
    if (!orderId || isGeneratingPDF) {
      if (!orderId) {
        toast({
          title: "Erreur",
          description: "Impossible de générer le reçu : ID de commande manquant",
          variant: "destructive",
        });
      }
      return;
    }

    setIsGeneratingPDF(true);
    try {
      console.log('Starting receipt generation for order:', orderId);
      const orderDetails = await fetchOrderDetails(orderId);
      console.log('Order details fetched for receipt:', orderDetails);
      
      await generateOrderReceiptPDF(orderDetails, i18n.language as 'fr' | 'en');
      console.log('Receipt PDF generated successfully');
      
      toast({
        title: "Succès",
        description: "Reçu généré et téléchargé avec succès",
      });
    } catch (error) {
      console.error('Error generating receipt PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le reçu. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    // Clear the cart after successful payment - only once
    clearCart();
    
    // Confirm payment if it's a card payment (Konnect)
    if (paymentRef && orderId && paymentMethod !== 'cash_on_delivery' && paymentMethod !== 'test') {
      console.log('Card payment detected, confirming payment...');
      confirmPayment();
    } else if (paymentMethod === 'cash_on_delivery') {
      console.log('Cash on delivery payment - no confirmation needed');
      setOrderConfirmed(true);
    } else if (paymentMethod === 'test' || testMode) {
      console.log('Test payment - marking as confirmed');
      setOrderConfirmed(true);
    }
  }, []); // Empty dependency array to run only once

  // Separate effect for auto-download that runs only once when order is ready
  useEffect(() => {
    if (orderId && orderConfirmed && !autoDownloadAttempted) {
      setAutoDownloadAttempted(true);
      console.log('Auto-downloading receipt for confirmed order');
      // Add a small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        generateAndDownloadReceipt();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [orderId, orderConfirmed, autoDownloadAttempted]);

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'cash_on_delivery':
        return 'Paiement à la livraison';
      case 'test':
        return 'Test (Mode développement)';
      default:
        return 'Paiement par carte';
    }
  };

  const getSuccessMessage = () => {
    if (testMode || paymentMethod === 'test') {
      return 'Commande test créée avec succès !';
    }
    if (paymentMethod === 'cash_on_delivery') {
      return 'Commande confirmée ! Vous paierez à la livraison.';
    }
    return t('orderSuccess.title');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky container for announcement bar and header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar onStoreFinderOpen={() => setIsStoreFinderOpen(true)} />
        <Header 
          onMenuClick={() => {}} 
          onContactOpen={() => setIsContactOpen(true)}
          onBookingOpen={() => {}}
        />
      </div>
      
      <div className="min-h-screen bg-gray-50 pt-40 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-serif text-gray-900 mb-4">
                {getSuccessMessage()}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {testMode || paymentMethod === 'test' 
                  ? 'Votre commande test a été enregistrée avec succès.'
                  : paymentMethod === 'cash_on_delivery'
                  ? 'Votre commande a été enregistrée. Vous recevrez un appel pour confirmer la livraison.'
                  : t('orderSuccess.message')
                }
              </p>

              {orderId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Numéro de commande:</p>
                  <p className="font-mono text-lg font-medium text-gray-900">#{orderId}</p>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Mode de paiement:</p>
                <p className="font-medium text-gray-900">{getPaymentMethodDisplay()}</p>
                {(testMode || paymentMethod === 'test') && (
                  <Badge variant="outline" className="mt-2">Mode Test</Badge>
                )}
              </div>

              {paymentRef && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Référence de paiement:</p>
                  <p className="font-mono text-sm text-gray-900">{paymentRef}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/')} 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {t('orderSuccess.button')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                {orderId && (
                  <Button 
                    variant="outline"
                    onClick={generateAndDownloadReceipt}
                    disabled={isGeneratingPDF}
                    className="w-full"
                  >
                    {isGeneratingPDF ? (
                      <>Génération du reçu...</>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger le reçu
                      </>
                    )}
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/contact?order=${orderId}`)}
                  className="w-full"
                >
                  Contacter le service client
                </Button>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                <p>Un email de confirmation a été envoyé à votre adresse.</p>
                {paymentMethod === 'cash_on_delivery' ? (
                  <p>Votre commande sera préparée et vous recevrez un appel pour organiser la livraison.</p>
                ) : testMode || paymentMethod === 'test' ? (
                  <p className="text-blue-600">⚠️ Ceci est une commande test - aucun paiement réel n'a été effectué.</p>
                ) : (
                  <p>Votre commande sera traitée dans les plus brefs délais.</p>
                )}
                {autoDownloadAttempted && (
                  <p className="text-green-600 mt-2">✓ Reçu téléchargé automatiquement</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={() => setIsStoreFinderOpen(false)} />
    </div>
  );
};

export default PaymentSuccess;
