
import { Heart, Star, Users, Shield } from 'lucide-react';

const AboutUsSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-28 h-28 bg-sweet-mint rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/5 w-36 h-36 bg-pastel-lavender rounded-full opacity-25 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/6 w-20 h-20 bg-powder-pink rounded-full opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 font-baloo">
                <span className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Notre Mission
                </span>
              </h2>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-6">
                Chez <span className="font-bold text-slate-800">My Little Hero</span>, nous créons des histoires personnalisées qui transforment votre enfant en véritable héros de ses propres aventures.
              </p>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8">
                Chaque livre est soigneusement conçu pour stimuler l'imagination, renforcer la confiance en soi et créer des souvenirs magiques qui dureront toute une vie.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-r from-pastel-blue to-pastel-lavender rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Créé avec Amour</h4>
                  <p className="text-slate-600 text-xs">Chaque détail compte</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-r from-sweet-mint to-pastel-blue rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">100% Personnalisé</h4>
                  <p className="text-slate-600 text-xs">Unique comme votre enfant</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-r from-powder-pink to-sweet-mint rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Famille d'abord</h4>
                  <p className="text-slate-600 text-xs">Des moments partagés</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-r from-pastel-lavender to-powder-pink rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Qualité Garantie</h4>
                  <p className="text-slate-600 text-xs">Excellence assurée</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pastel-blue/30 via-powder-pink/30 to-pastel-lavender/30 rounded-3xl blur-xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 group-hover:scale-105 transition-all duration-500">
                <img
                  src="https://i.ibb.co/S42Fg8Xy/image.png"
                  alt="Parent and child reading together"
                  className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
