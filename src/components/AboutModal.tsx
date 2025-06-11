
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Star, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  const navigate = useNavigate();

  const handlePersonalizeClick = () => {
    onClose();
    window.scrollTo(0, 0);
    navigate('/children');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-[95vw] max-w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto bg-gradient-to-br from-cream-beige via-pastel-blue/20 to-powder-pink/20 border-none shadow-2xl font-baloo">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4 mb-6">
            <Logo size="lg" />
            <DialogTitle className="text-center text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pastel-blue via-powder-pink to-pastel-lavender font-baloo">
              À propos de My Little Hero
            </DialogTitle>
            <div className="w-24 h-1 bg-gradient-to-r from-sweet-mint to-light-coral rounded-full"></div>
          </div>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-slate-700 leading-relaxed font-baloo">
              Nous créons des histoires magiques où votre enfant devient le héros de ses propres aventures. 
              Chaque livre est personnalisé avec le nom, l'apparence et les préférences de votre enfant 
              pour une expérience de lecture unique et inoubliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-light-coral to-powder-pink rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-baloo">Notre Mission</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-baloo">
                Encourager l'amour de la lecture en rendant chaque enfant le héros de sa propre histoire, 
                créant des souvenirs magiques qui dureront toute une vie.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pastel-blue to-sweet-mint rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-baloo">Nos Livres</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-baloo">
                Des histoires captivantes avec des illustrations magnifiques et une personnalisation complète 
                pour que chaque enfant vive une aventure unique.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-sweet-mint to-pastel-lavender rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-baloo">Notre Équipe</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-baloo">
                Auteurs, illustrateurs et développeurs passionnés par l'enfance, unis pour créer 
                des expériences de lecture extraordinaires.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pale-yellow to-light-coral rounded-full flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-baloo">Satisfaction</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-baloo">
                Plus de 10,000 familles heureuses et des milliers d'histoires créées avec amour 
                pour émerveiller petits et grands.
              </p>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-pastel-blue to-powder-pink p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4 font-baloo">Rejoignez l'aventure !</h3>
            <p className="text-lg leading-relaxed mb-6 font-baloo">
              Créez dès aujourd'hui une histoire unique pour votre enfant et regardez ses yeux s'illuminer 
              en découvrant qu'il est le héros de sa propre aventure.
            </p>
            <Button
              onClick={handlePersonalizeClick}
              className="bg-gradient-to-r from-sweet-mint to-pastel-lavender hover:from-sweet-mint/80 hover:to-pastel-lavender/80 text-black px-8 py-3 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-baloo"
            >
              ✨ Personnaliser un livre pour mon enfant ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
