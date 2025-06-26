
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Clock, Phone, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez corriger les erreurs dans le formulaire',
        variant: "destructive",
      });
      return;
    }

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
          sujet_message: formData.subject,
          contenu_message: formData.message
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Message envoyé',
          description: 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setErrors({});
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi du message',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-serif font-semibold">Contactez-nous</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Desktop Layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Contact Form - More width, less height */}
          <div className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 md:p-8 mb-8 lg:mb-0">
            <div className="mb-6">
              <h2 className="text-2xl font-serif text-white mb-2">Envoyez-nous un message</h2>
              <p className="text-slate-300">
                Nous serions ravis de vous entendre. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Two columns for name and email on desktop */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="Votre nom complet"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Two columns for phone and subject */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="+33 1 23 45 67 89"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="Sujet de votre message"
                  />
                  {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                  placeholder="Décrivez votre demande en détail..."
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-lg disabled:opacity-50 transition-all duration-200"
              >
                {isSubmitting ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Map and Info Section */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-900/50 to-blue-800/50">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Notre Boutique
                </h3>
              </div>
              <div className="aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!4v1705234567890!6m8!1m7!1sCAoSLEFGMVFpcE1tZWJGdlJGdlJGdlJGdlJGdlJGdlJGdlJGdlJGdlJGdlJGdlI!2m2!1d36.8454422!2d10.2806219!3f90!4f0!5f0.7820865974627469"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Contact Info & Hours */}
            <div className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Informations & Horaires
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center text-slate-300">
                  <Phone className="w-4 h-4 mr-3 text-blue-400" />
                  <span>+216 71 123 456</span>
                </div>
                
                <div className="flex items-center text-slate-300">
                  <Mail className="w-4 h-4 mr-3 text-blue-400" />
                  <span>contact@luccibyey.com</span>
                </div>
                
                <div className="flex items-start text-slate-300">
                  <MapPin className="w-4 h-4 mr-3 mt-1 text-blue-400" />
                  <span>Avenue Habib Bourguiba, Tunis, Tunisie</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-600">
                <h4 className="text-white font-medium mb-3">Horaires d'ouverture</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>09:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="text-red-400">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
