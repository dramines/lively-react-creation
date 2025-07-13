
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ContactModal from '@/components/modals/ContactModal';
import StoreFinderModal from '@/components/modals/StoreFinderModal';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('checkout');
  const [searchParams] = useSearchParams();
  const [isContactOpen, setIsContactOpen] = React.useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = React.useState(false);

  const errorMessage = searchParams.get('error');

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar onStoreFinderOpen={() => setIsStoreFinderOpen(true)} />
      <Header 
        onMenuClick={() => {}} 
        onContactOpen={() => setIsContactOpen(true)}
        onBookingOpen={() => {}}
      />
      
      <div className="min-h-screen bg-gray-50 pt-40 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className="text-3xl font-serif text-gray-900 mb-4">
                Échec du paiement
              </h1>
              
              <p className="text-gray-600 mb-6">
                Une erreur est survenue lors du traitement de votre paiement. Votre commande n'a pas été validée.
              </p>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/checkout')} 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer le paiement
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setIsContactOpen(true)}
                  className="w-full"
                >
                  Contacter le service client
                </Button>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                <p>Si le problème persiste, n'hésitez pas à nous contacter.</p>
                <p>Aucun montant n'a été débité de votre compte.</p>
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

export default PaymentFailure;
