
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

interface CGVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CGVModal = ({ isOpen, onClose }: CGVModalProps) => {
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
              Conditions générales de vente
            </DialogTitle>
            <div className="w-24 h-1 bg-gradient-to-r from-sweet-mint to-light-coral rounded-full"></div>
          </div>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-slate-700 mb-2 font-baloo">
              CONDITIONS GÉNÉRALES DE VENTE – MYLITTLEHERO
            </h2>
          </div>

          <div className="prose prose-lg max-w-none text-slate-700 space-y-6 font-baloo">
            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">Préambule</h3>
              <p className="leading-relaxed">
                Les présentes Conditions Générales de Vente (ci-après les « CGV ») régissent l'ensemble des ventes 
                conclues entre MyLittleHero, (ci-après « l'Éditeur » ou « nous »), et tout client (ci-après « le Client » 
                ou « vous ») passant commande de livres personnalisés pour enfants via le site internet mylittlehero.co 
                ou par tout autre moyen commercial.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">1. Objet</h3>
              <p className="leading-relaxed">
                Les présentes CGV ont pour objet de définir les modalités de commande, de paiement, de livraison et 
                d'exécution des ventes de livres personnalisés proposés par l'Éditeur.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">2. Commande</h3>
              <p className="leading-relaxed">
                Le Client sélectionne le livre souhaité, procède à sa personnalisation via les outils mis à disposition 
                et valide sa commande en confirmant l'exactitude des informations fournies.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">3. Prix et paiement</h3>
              <p className="leading-relaxed">
                Les prix sont indiqués en euros TTC. Le règlement s'effectue en ligne par carte bancaire ou tout autre 
                moyen de paiement sécurisé proposé.
              </p>
            </section>
          </div>

          <div className="text-center bg-gradient-to-r from-pastel-blue to-powder-pink p-6 rounded-2xl">
            <Button
              onClick={handlePersonalizeClick}
              className="bg-gradient-to-r from-sweet-mint to-pastel-lavender hover:from-sweet-mint/80 hover:to-pastel-lavender/80 text-black px-8 py-3 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-baloo"
            >
              ✨ Créer l'histoire de mon enfant ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CGVModal;
