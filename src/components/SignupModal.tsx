
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SignupModal = ({ isOpen, onClose, onSuccess }: SignupModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name && formData.email && formData.password && 
                     formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user info in localStorage for demo
      localStorage.setItem('user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        isLoggedIn: true
      }));

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto bg-white border-2 border-slate-200 mx-2">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold text-slate-800 px-2">
            Créer un compte
          </DialogTitle>
          <p className="text-center text-slate-600 text-xs sm:text-sm mt-2 px-2">
            Pour gérer vos commandes et accéder à vos livres
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 px-2 sm:px-0">
          <div className="space-y-2">
            <Label htmlFor="signupName" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
              <User className="w-4 h-4 mr-2 text-orange-500" />
              Nom complet
            </Label>
            <Input
              id="signupName"
              type="text"
              value={formData.name}
              onChange={(e) => updateForm('name', e.target.value)}
              className="border-slate-200 focus:border-orange-400 focus:ring-orange-400 text-sm sm:text-base"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signupEmail" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
              <Mail className="w-4 h-4 mr-2 text-orange-500" />
              Email
            </Label>
            <Input
              id="signupEmail"
              type="email"
              value={formData.email}
              onChange={(e) => updateForm('email', e.target.value)}
              className="border-slate-200 focus:border-orange-400 focus:ring-orange-400 text-sm sm:text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signupPassword" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
              <Lock className="w-4 h-4 mr-2 text-orange-500" />
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="signupPassword"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateForm('password', e.target.value)}
                className="border-slate-200 focus:border-orange-400 focus:ring-orange-400 pr-10 text-sm sm:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
              <Lock className="w-4 h-4 mr-2 text-orange-500" />
              Confirmer le mot de passe
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => updateForm('confirmPassword', e.target.value)}
                className="border-slate-200 focus:border-orange-400 focus:ring-orange-400 pr-10 text-sm sm:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-xs">Les mots de passe ne correspondent pas</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={!isFormValid || isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            {isLoading ? "Création en cours..." : "Créer mon compte"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
