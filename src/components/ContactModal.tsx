
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
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
              Contactez-nous
            </DialogTitle>
            <div className="w-24 h-1 bg-gradient-to-r from-sweet-mint to-light-coral rounded-full"></div>
          </div>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-slate-700 leading-relaxed font-baloo">
              Notre équipe est là pour vous aider ! N'hésitez pas à nous contacter pour toute question 
              ou demande d'assistance. Nous sommes ravis d'échanger avec vous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-light-coral to-powder-pink rounded-full flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-baloo">Email</h3>
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2 font-baloo">contact@mylittlehero.fr</p>
              <p className="text-slate-600 font-baloo">Réponse garantie sous 24h</p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-sweet-mint to-pastel-blue rounded-full flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-baloo">Téléphone</h3>
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2 font-baloo">01 23 45 67 89</p>
              <p className="text-slate-600 font-baloo">Lundi-Vendredi 9h-18h</p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pastel-blue to-pastel-lavender rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-baloo">Adresse</h3>
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2 font-baloo">Paris, France</p>
              <p className="text-slate-600 font-baloo">Siège social</p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pastel-lavender to-pale-yellow rounded-full flex items-center justify-center mr-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-baloo">Chat en ligne</h3>
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2 font-baloo">Disponible 7j/7</p>
              <p className="text-slate-600 font-baloo">Support instantané</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-pastel-blue to-powder-pink p-6 rounded-2xl text-white">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold font-baloo">Temps de réponse</h3>
              </div>
              <p className="leading-relaxed font-baloo">
                Nous nous engageons à répondre à tous vos messages dans les plus brefs délais, 
                généralement sous 24 heures pour vous offrir le meilleur service.
              </p>
            </div>

            <div className="bg-gradient-to-r from-pastel-lavender to-sweet-mint p-6 rounded-2xl text-white">
              <div className="flex items-center mb-4">
                <Send className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold font-baloo">Une question ?</h3>
              </div>
              <p className="leading-relaxed font-baloo">
                N'hésitez pas à nous écrire ! Que ce soit pour une commande, une personnalisation 
                ou simplement dire bonjour, nous adorons échanger avec nos familles.
              </p>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-pastel-blue to-powder-pink p-6 rounded-2xl">
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

export default ContactModal;
