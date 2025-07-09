
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, User, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const { t } = useTranslation('contact');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: t('error'),
        description: t('nameRequired'),
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: t('error'),
        description: t('emailRequired'),
        variant: 'destructive'
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: t('error'),
        description: t('emailInvalid'),
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: t('error'),
        description: t('phoneRequired'),
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.message.trim()) {
      toast({
        title: t('error'),
        description: t('messageRequired'),
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch('https://draminesaid.com/lucci/api/insert_message.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom_client: formData.name,
          email_client: formData.email,
          telephone_client: formData.phone,
          message_client: formData.message
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: t('success'),
          description: t('successMessage')
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
        onClose();
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t('error'),
        description: t('errorMessage'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl font-serif mb-2">
            {t('title')}
          </DialogTitle>
          <p className="text-slate-300">
            {t('subtitle')}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2 text-white">
                <User className="w-4 h-4" />
                {t('name')}
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-white focus:outline-none"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-white">
                <Mail className="w-4 h-4" />
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-white focus:outline-none"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2 text-white">
                <Phone className="w-4 h-4" />
                {t('phone')}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-white focus:outline-none"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2 text-white">
                <MessageSquare className="w-4 h-4" />
                {t('message')}
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder={t('messagePlaceholder')}
                className="w-full min-h-[120px] resize-none bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-white focus:outline-none"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-200 py-3 font-medium text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
