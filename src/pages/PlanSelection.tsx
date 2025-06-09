
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Crown, Star, CheckCircle, Check } from 'lucide-react';
import Header from '@/components/Header';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

const PlanSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const children = location.state?.children || [];
  
  const [selectedPlan, setSelectedPlan] = useState<'onetime' | 'subscription'>('subscription');

  const plans = {
    onetime: { 
      price: 29.99, 
      title: 'PAIEMENT UNIQUE', 
      subtitle: 'Un cadeau magique à offrir',
      description: 'Un livre personnalisé pour votre enfant'
    },
    subscription: { 
      price: 22.49, 
      title: 'Abonnement mensuel', 
      subtitle: '1 livre surprise lié à votre objectif par enfant par mois',
      description: '97% des parents choisissent l\'abonnement : une aventure chaque mois pour faire grandir leur héros.',
      savings: 'Économisez 25%'
    }
  };

  const handleContinue = () => {
    navigate('/checkout', { 
      state: { 
        children, 
        selectedPlan 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden font-baloo">
      <Header />
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-200 to-teal-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 relative z-10 pt-20 md:pt-24">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-slate-800">
            Choisissez votre aventure
            </span>
          </h1>
          <p className="text-sm md:text-lg text-slate-600">
            Un cadeau magique à offrir
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-8 h-8 bg-sweet-mint rounded-full flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-slate-700" />
            </div>
            <div className="w-6 md:w-8 h-1 bg-sweet-mint"></div>
            <div className="w-8 h-8 bg-sweet-mint rounded-full flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-slate-700" />
            </div>
            <div className="w-6 md:w-8 h-1 bg-sweet-mint"></div>
            <div className="w-8 h-8 bg-light-coral rounded-full flex items-center justify-center shadow-md">
              <span className="text-slate-700 text-sm font-bold">3</span>
            </div>
            <div className="w-6 md:w-8 h-1 bg-gray-300"></div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-bold">4</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Plan Selection */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg mb-6 md:mb-8">
            <div className="flex items-center mb-4 md:mb-6">
              <Crown className="w-5 h-5 md:w-6 md:h-6 text-purple-500 mr-2 md:mr-3" />
              <h3 className="text-lg md:text-xl font-bold text-slate-700">Choisissez votre aventure</h3>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              {/* Subscription option - Featured */}
              <div
                onClick={() => setSelectedPlan('subscription')}
                className={`
                  p-4 md:p-6 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 border-2 relative
                  ${selectedPlan === 'subscription' 
                    ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-pink-50 shadow-lg transform scale-[1.02]' 
                    : 'border-slate-200 hover:border-slate-300'
                  }
                `}
              >
                {/* Popular badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs md:text-sm font-bold">
                    RECOMMANDÉ
                  </span>
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-700 text-lg md:text-xl mb-2">{plans.subscription.title}</h4>
                    <p className="text-slate-600 text-sm md:text-base mb-3">{plans.subscription.subtitle}</p>
                    <p className="text-slate-600 text-xs md:text-sm mb-4 italic">{plans.subscription.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-3 py-1 text-xs md:text-sm rounded-full bg-green-100 text-green-700 font-semibold">
                        {plans.subscription.savings}
                      </span>
                      <div className="flex items-center text-xs md:text-sm text-orange-600">
                        <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 fill-current" />
                        <span className="font-semibold">97% des parents choisissent cette option</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl md:text-3xl font-bold text-slate-700">{plans.subscription.price}€</p>
                    <p className="text-xs md:text-sm text-slate-500">/mois</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-center">
                  <Button
                    className={`
                      w-full max-w-xs px-6 py-3 rounded-xl font-semibold transition-all duration-300
                      ${selectedPlan === 'subscription' 
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg' 
                        : 'border-2 border-orange-300 text-orange-600 hover:bg-orange-50'
                      }
                    `}
                  >
                    {selectedPlan === 'subscription' ? (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        SÉLECTIONNÉ
                      </div>
                    ) : (
                      'SÉLECTIONNER CETTE OPTION'
                    )}
                  </Button>
                </div>
              </div>

              {/* One-time payment option */}
              <div
                onClick={() => setSelectedPlan('onetime')}
                className={`
                  p-4 md:p-6 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 border-2 relative
                  ${selectedPlan === 'onetime' 
                    ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-pink-50 shadow-lg transform scale-[1.02]' 
                    : 'border-slate-200 hover:border-slate-300'
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-700 text-lg md:text-xl mb-2">{plans.onetime.title}</h4>
                    <p className="text-slate-600 text-sm md:text-base mb-3">{plans.onetime.subtitle}</p>
                    <p className="text-slate-600 text-xs md:text-sm mb-4">{plans.onetime.description}</p>
                    <span className="inline-block px-3 py-1 text-xs md:text-sm rounded-full bg-blue-100 text-blue-700 font-semibold">
                      Achat simple
                    </span>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl md:text-3xl font-bold text-slate-700">{plans.onetime.price}€</p>
                    <p className="text-xs md:text-sm text-slate-500">une fois</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-center">
                  <Button
                    className={`
                      w-full max-w-xs px-6 py-3 rounded-xl font-semibold transition-all duration-300
                      ${selectedPlan === 'onetime' 
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg' 
                        : 'border-2 border-orange-300 text-orange-600 hover:bg-orange-50'
                      }
                    `}
                  >
                    {selectedPlan === 'onetime' ? (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        SÉLECTIONNÉ
                      </div>
                    ) : (
                      'SÉLECTIONNER CETTE OPTION'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto gap-4 mb-8">
          <Button
            onClick={() => navigate('/personalize')}
            variant="outline"
            className="w-full md:w-auto flex items-center gap-2 px-4 md:px-6 py-3 md:py-3 rounded-full border-2 border-slate-300 hover:border-orange-300 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          
          <Button
            onClick={handleContinue}
            className="w-full md:w-auto flex items-center gap-2 px-6 md:px-8 py-3 md:py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
          >
            Continuer vers le checkout
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        </div>

        <TestimonialsCarousel />
      </div>
  );
};

export default PlanSelection;
