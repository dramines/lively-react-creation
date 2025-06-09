
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

interface MentionsLegalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MentionsLegalesModal = ({ isOpen, onClose }: MentionsLegalesModalProps) => {
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
              Mentions légales
            </DialogTitle>
            <div className="w-24 h-1 bg-gradient-to-r from-sweet-mint to-light-coral rounded-full"></div>
          </div>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none text-slate-700 space-y-6 font-baloo">
            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">Éditeur du site</h3>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30">
                <p className="leading-relaxed">
                  <strong>MyLittleHero</strong><br />
                  Société par actions simplifiée<br />
                  Capital social : 10 000 €<br />
                  Siège social : Paris, France<br />
                  RCS Paris : XXX XXX XXX<br />
                  SIRET : XXX XXX XXX XXXXX<br />
                  TVA intracommunautaire : FR XX XXX XXX XXX
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">Directeur de publication</h3>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30">
                <p className="leading-relaxed">
                  Directeur de publication : [Nom du directeur]<br />
                  Contact : contact@mylittlehero.fr
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">Hébergement</h3>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30">
                <p className="leading-relaxed">
                  Site hébergé par : Lovable<br />
                  Adresse : [Adresse de l'hébergeur]
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">Propriété intellectuelle</h3>
              <p className="leading-relaxed">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
              </p>
            </section>
          </div>

          <div className="text-center bg-gradient-to-r from-pastel-blue to-powder-pink p-6 rounded-2xl">
            <Button
              onClick={handlePersonalizeClick}
              className="bg-gradient-to-r from-sweet-mint to-pastel-lavender hover:from-sweet-mint/80 hover:to-pastel-lavender/80 text-white px-8 py-3 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-baloo"
            >
              ✨ Créer l'histoire de mon enfant ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MentionsLegalesModal;
