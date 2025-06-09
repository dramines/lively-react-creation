
import { useState } from 'react';
import { LogOut, ChevronDown, Heart, Gift, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AccountMenuProps {
  isLoggedIn: boolean;
  userEmail: string;
  onShowLogin: () => void;
  onShowSignup: () => void;
  onShowAccount: () => void;
  onLogout: () => void;
}

const AccountMenu = ({ 
  isLoggedIn, 
  userEmail, 
  onShowLogin, 
  onShowSignup, 
  onShowAccount, 
  onLogout 
}: AccountMenuProps) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleShowAccount = () => {
    onShowAccount();
    setShowAccountMenu(false);
  };

  const handleLogout = () => {
    onLogout();
    setShowAccountMenu(false);
  };

  return (
    <Popover open={showAccountMenu} onOpenChange={setShowAccountMenu}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center space-x-1 sm:space-x-2 bg-white/90 backdrop-blur-sm hover:bg-white px-3 sm:px-6 py-3 rounded-xl shadow-lg transition-all duration-300 font-baloo font-medium"
        >
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          <span className="text-slate-700 font-medium text-sm hidden sm:inline">
            Espace client
          </span>
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-white border border-slate-200 shadow-xl" align="end">
        {isLoggedIn ? (
          <div className="p-4 space-y-3">
            <div className="border-b border-slate-200 pb-3">
              <p className="text-sm font-medium text-slate-800">Connecté en tant que:</p>
              <p className="text-sm text-slate-600 truncate">{userEmail}</p>
            </div>
            
            <Button
              onClick={handleShowAccount}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-700 hover:bg-slate-50"
            >
              <Users className="w-4 h-4 mr-2" />
              <span>Mon espace client</span>
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="text-center pb-3 border-b border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">Rejoignez notre univers magique !</h3>
              <p className="text-xs text-slate-600 mt-1">
                Créez un compte pour accéder à vos histoires personnalisées, suivre vos commandes et découvrir des avantages exclusifs.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-xs text-slate-600 mb-2">
                <Gift className="w-3 h-3 mr-1 text-orange-500" />
                <span>Avantages membres :</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 ml-4">
                <li>• Suivi de vos commandes en temps réel</li>
                <li>• Accès à vos histoires sauvegardées</li>
              </ul>
            </div>
            
            <div className="space-y-2 pt-2">
              <Button
                onClick={() => {
                  onShowSignup();
                  setShowAccountMenu(false);
                }}
                size="sm"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                Créer mon compte gratuitement
              </Button>
              
              <Button
                onClick={() => {
                  onShowLogin();
                  setShowAccountMenu(false);
                }}
                variant="outline"
                size="sm"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                J'ai déjà un compte
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AccountMenu;
