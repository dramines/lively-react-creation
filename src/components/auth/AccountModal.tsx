
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  User, 
  ShoppingBag, 
  Baby, 
  CreditCard, 
  Crown, 
  Settings,
  ExternalLink
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const AccountModal = ({ isOpen, onClose, userEmail }: AccountModalProps) => {
  const navigate = useNavigate();

  const handleNavigateToAccount = () => {
    onClose();
    navigate('/account');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            Mon Compte
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-4 bg-white/60 rounded-lg border border-orange-200">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold text-slate-800">Connecté en tant que:</p>
            <p className="text-slate-600 truncate">{userEmail}</p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleNavigateToAccount}
              variant="outline"
              className="w-full justify-between border-orange-200 text-slate-700 hover:bg-orange-50"
            >
              <div className="flex items-center">
                <User className="w-4 h-4 mr-3 text-orange-500" />
                Profil et paramètres
              </div>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleNavigateToAccount}
              variant="outline"
              className="w-full justify-between border-orange-200 text-slate-700 hover:bg-orange-50"
            >
              <div className="flex items-center">
                <ShoppingBag className="w-4 h-4 mr-3 text-orange-500" />
                Mes commandes
              </div>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleNavigateToAccount}
              variant="outline"
              className="w-full justify-between border-orange-200 text-slate-700 hover:bg-orange-50"
            >
              <div className="flex items-center">
                <Baby className="w-4 h-4 mr-3 text-orange-500" />
                Mes enfants
              </div>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleNavigateToAccount}
              variant="outline"
              className="w-full justify-between border-orange-200 text-slate-700 hover:bg-orange-50"
            >
              <div className="flex items-center">
                <Crown className="w-4 h-4 mr-3 text-orange-500" />
                Mon abonnement
              </div>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            onClick={handleNavigateToAccount}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Settings className="w-4 h-4 mr-2" />
            Accéder à mon compte complet
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountModal;
