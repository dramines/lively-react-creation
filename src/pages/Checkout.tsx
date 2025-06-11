import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Shield, Lock, Truck, Star, Check, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const children = location.state?.children || [];
  const selectedPlan = location.state?.selectedPlan || 'onetime';
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const plans = {
    onetime: { price: 29.99, title: 'PAIEMENT UNIQUE' },
    subscription: { price: 22.49, title: 'Abonnement mensuel' }
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  const handlePayment = () => {
    if (!isFormValid) return;

    navigate('/confirmation', { 
      state: { 
        children, 
        plan: selectedPlan, 
        amount: plans[selectedPlan].price 
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

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 relative z-10 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-slate-800">
            Finalisation de votre commande
            </span>
          </h1>
          <p className="text-sm md:text-lg text-slate-600">
            Dernière étape avant de recevoir votre livre personnalisé
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
            <div className="w-8 h-8 bg-sweet-mint rounded-full flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-slate-700" />
            </div>
            <div className="w-6 md:w-8 h-1 bg-sweet-mint"></div>
            <div className="w-8 h-8 bg-light-coral rounded-full flex items-center justify-center shadow-md">
              <span className="text-slate-700 text-sm font-bold">4</span>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-4 md:space-y-6">
          {/* TRUSTPILOT - Enhanced but smaller */}
          <div className="bg-white rounded-xl p-3 shadow-lg border border-green-100">
            <div className="flex items-center justify-center mb-3">
              <img 
                src="https://i.ibb.co/9mjzbfTr/image.png" 
                alt="Trustpilot" 
                className="h-6 object-contain"
              />
            </div>
            <div className="text-center mb-3">
              <div className="flex items-center justify-center mb-1">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-bold text-slate-700">4.8/5</span>
              </div>
              <p className="text-xs text-slate-600 font-semibold">Excellent • 2,847 avis vérifiés</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-green-50 p-2 rounded-lg border-l-4 border-green-400">
                <div className="flex items-center mb-1">
                  <div className="flex mr-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-green-500 fill-current" />
                    ))}
                  </div>
                  <CheckCircle className="w-2 h-2 text-green-500 ml-1" />
                </div>
                <p className="text-slate-700 font-medium">"Service exceptionnel, mon fils adore son livre !"</p>
                <span className="text-slate-500 text-xs">Marie P. • Achat vérifié</span>
              </div>
              <div className="bg-green-50 p-2 rounded-lg border-l-4 border-green-400">
                <div className="flex items-center mb-1">
                  <div className="flex mr-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-green-500 fill-current" />
                    ))}
                  </div>
                  <CheckCircle className="w-2 h-2 text-green-500 ml-1" />
                </div>
                <p className="text-slate-700 font-medium">"Qualité parfaite, livraison rapide. Je recommande !"</p>
                <span className="text-slate-500 text-xs">Thomas L. • Achat vérifié</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-center">
              <div className="flex items-center justify-center space-x-3 text-xs text-slate-600">
                <div className="flex items-center">
                  <Shield className="w-2 h-2 text-green-500 mr-1" />
                  <span>Avis vérifiés</span>
                </div>
                <div className="flex items-center">
                  <Lock className="w-2 h-2 text-green-500 mr-1" />
                  <span>Site sécurisé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé de commande - Second on mobile */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-slate-700 mb-4">Résumé de commande</h3>
            
            <div className="space-y-3 mb-4">
              {children.map((child: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  {child.photoUrl && (
                    <img 
                      src={child.photoUrl} 
                      alt={child.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
                    />
                  )}
                  <div className="flex-1">
                    <span className="text-slate-600 text-sm">Livre pour {child.name}</span>
                  </div>
                  <span className="text-sm">✨</span>
                </div>
              ))}
            </div>

            <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Plan sélectionné:</span>
              </div>
              <span className="text-orange-600 font-bold text-sm">{plans[selectedPlan].title}</span>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{plans[selectedPlan].price}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison</span>
                <span className="text-green-600 font-semibold">GRATUITE</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-500">{plans[selectedPlan].price}€</span>
              </div>
            </div>
          </div>

          {/* INFO LIVRAISON - Third on mobile */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center mb-4">
              <Truck className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-bold text-slate-700">INFO LIVRAISON</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">Nom complet *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Nom et prénom"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">Adresse de livraison *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  placeholder="Adresse complète"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Ville *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    placeholder="Ville"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Code postal *</label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) => updateForm('postalCode', e.target.value)}
                    placeholder="75000"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-slate-600 bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span>📦 Livraison standard (France)</span>
                <span className="font-semibold text-green-600">GRATUITE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>⚡ Délai de livraison</span>
                <span className="font-semibold">5-7 jours ouvrés</span>
              </div>
            </div>
          </div>

          {/* Info bancaire - Fourth on mobile */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-lg font-bold text-slate-700">Info bancaire</h3>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">Numéro de carte *</label>
                <Input
                  value={formData.cardNumber}
                  onChange={(e) => updateForm('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Date d'expiration *</label>
                  <Input
                    value={formData.expiryDate}
                    onChange={(e) => updateForm('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">CVV *</label>
                  <Input
                    value={formData.cvv}
                    onChange={(e) => updateForm('cvv', e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-green-50 p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <Shield className="w-3 h-3 text-green-500 mr-2" />
                <span>Paiement 100% sécurisé SSL 256 bits</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-3 h-3 text-green-500 mr-2" />
                <span>Données bancaires cryptées et protégées</span>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={!isFormValid}
              className={`
                w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-300 text-sm
                ${isFormValid 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105' 
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              <Lock className="w-4 h-4" />
              PAYER {plans[selectedPlan].price}€
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left Column - Info Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* ENHANCED TRUSTPILOT SECTION - smaller */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-green-100">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="https://i.ibb.co/9mjzbfTr/image.png" 
                  alt="Trustpilot" 
                  className="h-8 object-contain"
                />
              </div>
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-green-500 fill-current" />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-slate-700">4.8/5</span>
                </div>
                <p className="text-base text-slate-600 font-semibold">Excellent • 2,847 avis vérifiés</p>
                <p className="text-sm text-slate-500 mt-1">97% de nos clients recommandent nos livres</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-1">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                      ))}
                    </div>
                    <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1 text-sm">"Service exceptionnel, mon fils adore son livre !"</p>
                  <span className="text-slate-500 text-xs">Marie P. • Achat vérifié • Il y a 2 jours</span>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-1">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                      ))}
                    </div>
                    <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1 text-sm">"Qualité parfaite, livraison rapide. Je recommande !"</p>
                  <span className="text-slate-500 text-xs">Thomas L. • Achat vérifié • Il y a 1 semaine</span>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-1">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                      ))}
                    </div>
                    <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1 text-sm">"Mon enfant se voit comme un vrai héros !"</p>
                  <span className="text-slate-500 text-xs">Sophie M. • Achat vérifié • Il y a 3 jours</span>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-1">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                      ))}
                    </div>
                    <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1 text-sm">"Livre magnifique, très bien fait. Bravo !"</p>
                  <span className="text-slate-500 text-xs">Lucas D. • Achat vérifié • Il y a 5 jours</span>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 text-green-500 mr-1" />
                      <span>Avis vérifiés</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-3 h-3 text-green-500 mr-1" />
                      <span>Site sécurisé</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                      <span>Achats protégés</span>
                    </div>
                  </div>
                  <a 
                    href="https://trustpilot.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Voir tous les avis →
                  </a>
                </div>
              </div>
            </div>

            {/* INFO LIVRAISON */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-6">
                <Truck className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-bold text-slate-700">INFO LIVRAISON</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Nom complet *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="Nom et prénom"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Adresse de livraison *</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    placeholder="Adresse complète"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">Ville *</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      placeholder="Ville"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">Code postal *</label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => updateForm('postalCode', e.target.value)}
                      placeholder="75000"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-slate-600 bg-blue-50 p-3 md:p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>📦 Livraison standard (France)</span>
                  <span className="font-semibold text-green-600">GRATUITE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>⚡ Délai de livraison</span>
                  <span className="font-semibold">5-7 jours ouvrés</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🚚 Transporteur</span>
                  <span className="font-semibold">Colissimo / Chronopost</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>📍 Suivi de colis</span>
                  <span className="font-semibold text-blue-600">Inclus</span>
                </div>
              </div>
            </div>

            {/* Info bancaire */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-slate-700">Info bancaire</h3>
              </div>

              <div className="space-y-3 md:space-y-4 mb-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Numéro de carte *</label>
                  <Input
                    value={formData.cardNumber}
                    onChange={(e) => updateForm('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">Date d'expiration *</label>
                    <Input
                      value={formData.expiryDate}
                      onChange={(e) => updateForm('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">CVV *</label>
                    <Input
                      value={formData.cvv}
                      onChange={(e) => updateForm('cvv', e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-slate-600 bg-green-50 p-3 md:p-4 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-3 h-3 text-green-500 mr-2" />
                  <span>Paiement 100% sécurisé SSL 256 bits</span>
                </div>
                <div className="flex items-center">
                  <Lock className="w-3 h-3 text-green-500 mr-2" />
                  <span>Données bancaires cryptées et protégées</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-3 h-3 text-green-500 mr-2" />
                  <span>Cartes acceptées: Visa, Mastercard, CB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
              <h3 className="text-xl font-bold text-slate-700 mb-6">Résumé de commande</h3>
              
              <div className="space-y-3 md:space-y-4 mb-4">
                {children.map((child: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    {child.photoUrl && (
                      <img 
                        src={child.photoUrl} 
                        alt={child.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
                      />
                    )}
                    <div className="flex-1">
                      <span className="text-slate-600 text-sm">Livre pour {child.name}</span>
                    </div>
                    <span className="text-sm">✨</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Plan sélectionné:</span>
                </div>
                <span className="text-orange-600 font-bold text-sm">{plans[selectedPlan].title}</span>
              </div>

              <div className="space-y-2 md:space-y-3 mb-4 pb-4 border-b border-slate-200">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{plans[selectedPlan].price}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span className="text-green-600 font-semibold">GRATUITE</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">{plans[selectedPlan].price}€</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-4 md:mb-6 text-xs text-slate-500">
                <div className="flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>Données cryptées</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!isFormValid}
                className={`
                  w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-300 text-sm
                  ${isFormValid 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
              >
                <Lock className="w-4 h-4" />
                PAYER {plans[selectedPlan].price}€
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto mt-6 md:mt-8 gap-4">
          <Button
            onClick={() => navigate('/plan-selection', { state: { children } })}
            variant="outline"
            className="w-full md:w-auto flex items-center gap-2 px-4 md:px-6 py-3 rounded-full border-2 border-slate-300 hover:border-orange-300 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
      </div>

      <TestimonialsCarousel />
    </div>
  );
};

export default Checkout;
