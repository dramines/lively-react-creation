
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Book, Calendar, Home } from 'lucide-react';

const Confirmation = () => {
  const location = useLocation();
  const { children, plan, amount } = location.state || {};

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated celebration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Confetti-like elements */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 rotate-45 animate-bounce opacity-60`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              backgroundColor: ['#f59e0b', '#ec4899', '#10b981', '#3b82f6'][Math.floor(Math.random() * 4)]
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-8">
            <CheckCircle className="w-24 h-24 text-green-500 animate-pulse" />
            <div className="absolute inset-0 w-24 h-24 border-4 border-green-200 rounded-full animate-ping"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-700 mb-4">
            Merci ! 🎉
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Votre livre personnalisé est en route
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"> ✨</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Order Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Book className="w-8 h-8 text-orange-500 mr-3" />
              <h3 className="text-2xl font-bold text-slate-700">Votre commande</h3>
            </div>

            <div className="space-y-4">
              {children?.map((child: any, index: number) => (
                <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
                  <h4 className="font-semibold text-slate-700 text-lg">
                    Le héros : {child.name} ⭐
                  </h4>
                  <p className="text-slate-600">Âge : {child.age} ans</p>
                  {child.message && (
                    <p className="text-slate-600 text-sm mt-2 italic">
                      "{child.message}"
                    </p>
                  )}
                </div>
              ))}

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-700">
                    {plan === 'subscription' ? 'Abonnement mensuel' : 'Achat unique'}
                  </span>
                  <span className="text-2xl font-bold text-green-500">{amount}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Delivery Info */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 text-blue-500 mr-3" />
              <h3 className="text-2xl font-bold text-slate-700">Livraison</h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                <h4 className="font-semibold text-slate-700 mb-2">Date de livraison estimée</h4>
                <p className="text-xl font-bold text-blue-600">
                  {deliveryDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-slate-600">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Commande confirmée
                </div>
                <div className="flex items-center text-slate-600">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  Création en cours
                </div>
                <div className="flex items-center text-slate-400">
                  <div className="w-4 h-4 bg-slate-300 rounded-full mr-3"></div>
                  Impression et expédition
                </div>
                <div className="flex items-center text-slate-400">
                  <div className="w-4 h-4 bg-slate-300 rounded-full mr-3"></div>
                  Livraison
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <p className="text-green-700 text-sm">
                  📧 Vous recevrez un email de confirmation avec le suivi de votre commande
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-700 mb-4">
              Partagez la magie ! ✨
            </h3>
            <p className="text-slate-600 mb-6">
              Dites à vos amis à quel point les histoires personnalisées sont magiques
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full">
                📘 Partager sur Facebook
              </Button>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full">
                📸 Partager sur Instagram
              </Button>
            </div>
          </div>

          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Créer un autre livre
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
