
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RefundPolicyModal = ({ isOpen, onClose }: RefundPolicyModalProps) => {
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
              Politique de remboursement
            </DialogTitle>
            <div className="w-24 h-1 bg-gradient-to-r from-sweet-mint to-light-coral rounded-full"></div>
          </div>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none text-slate-700 space-y-6 font-baloo">
            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">Droit de rétractation</h3>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30">
                <p className="leading-relaxed">
                  Conformément à l'article L221-28 du Code de la consommation, vous disposez d'un délai de 
                  14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation, 
                  sans avoir à justifier de motifs ni à payer de pénalités.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">Conditions de retour</h3>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30">
                <p className="leading-relaxed">
                  Les produits personnalisés ne peuvent être retournés que s'ils présentent un défaut de fabrication 
                  ou ne correspondent pas à votre commande. Dans ce cas, nous procédons à l'échange ou au remboursement 
                  intégral sous 30 jours.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">Modalités de remboursement</h3>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-powder-pink/30">
                <p className="leading-relaxed">
                  Le remboursement s'effectue dans un délai de 14 jours suivant la réception de votre demande, 
                  par le même moyen de paiement que celui utilisé lors de votre achat.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-pastel-lavender mb-3">Satisfaction garantie</h3>
              <p className="leading-relaxed">
                Votre satisfaction est notre priorité. En cas de problème, notre équipe s'engage à trouver 
                une solution rapide et adaptée. N'hésitez pas à nous contacter à contact@mylittlehero.fr.
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

export default RefundPolicyModal;
