
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (name: string, email: string, phone: string, password: string) => void;
  onSwitchToLogin: () => void;
}

const SignupModal = ({ isOpen, onClose, onSignup, onSwitchToLogin }: SignupModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) return;
    
    setIsLoading(true);
    try {
      await onSignup(name, email, phone, password);
      onClose();
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            S'inscrire
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-slate-700 font-semibold flex items-center">
              <User className="w-4 h-4 mr-2 text-orange-500" />
              Nom complet
            </Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Votre nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-slate-700 font-semibold flex items-center">
              <Mail className="w-4 h-4 mr-2 text-orange-500" />
              Email
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-phone" className="text-slate-700 font-semibold flex items-center">
              <Phone className="w-4 h-4 mr-2 text-orange-500" />
              Téléphone
            </Label>
            <Input
              id="signup-phone"
              type="tel"
              placeholder="Votre numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-slate-700 font-semibold flex items-center">
              <Lock className="w-4 h-4 mr-2 text-orange-500" />
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Inscription...' : 'S\'inscrire'}
          </Button>
        </form>
        
        <div className="text-center text-sm text-slate-600">
          <p>Déjà un compte ? 
            <button 
              onClick={onSwitchToLogin}
              className="text-orange-500 hover:underline cursor-pointer ml-1 font-semibold"
            >
              Se connecter
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
