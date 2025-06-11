
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Save } from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  onSave: (userInfo: { name: string; email: string; phone?: string }) => void;
}

const AccountSettingsModal = ({ isOpen, onClose, userInfo, onSave }: AccountSettingsModalProps) => {
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [phone, setPhone] = useState(userInfo.phone || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, phone });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw] sm:w-full bg-white border-2 border-slate-200 mx-2">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold text-slate-800 px-2">
            Paramètres du compte
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 px-2 sm:px-0">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              Nom complet
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
              <Mail className="w-4 h-4 mr-2 text-blue-500" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
              <Phone className="w-4 h-4 mr-2 text-blue-500" />
              Téléphone (optionnel)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModal;
