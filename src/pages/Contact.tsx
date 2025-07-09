import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, User, MessageSquare, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
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
        title: "Erreur",
        description: "Le nom est requis",
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Erreur",
        description: "L'email est requis",
        variant: 'destructive'
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "Format d'email invalide",
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Erreur",
        description: "Le téléphone est requis",
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.message.trim()) {
      toast({
        title: "Erreur",
        description: "Le message est requis",
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
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès. Nous vous recontacterons bientôt."
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message",
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <Header />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 font-montserrat">
              Contactez-nous
            </h1>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à vos questions et vous accompagner dans vos projets sartoriaux.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-light text-gray-900 mb-4 font-montserrat">
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-600">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4" />
                      Nom complet
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border-gray-200 focus:border-gray-400 focus:ring-0"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border-gray-200 focus:border-gray-400 focus:ring-0"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full border-gray-200 focus:border-gray-400 focus:ring-0"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Décrivez votre demande..."
                    className="w-full min-h-[120px] resize-none border-gray-200 focus:border-gray-400 focus:ring-0"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-black text-white hover:bg-gray-800 py-3 font-medium text-base flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-6 font-montserrat">
                  Informations de contact
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Téléphone</h3>
                      <p className="text-gray-600">+216 56 829 717</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">contact@spadadibattaglia.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Adresse</h3>
                      <p className="text-gray-600">SPADA DI BATTAGLIA<br />P9, Tunis, La Marsa, Tunisia</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Horaires d'ouverture</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Lundi - Vendredi: 9h00 - 18h00</p>
                        <p>Samedi: 9h00 - 16h00</p>
                        <p>Dimanche: Fermé</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-4 font-montserrat">
                  Services disponibles
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    Consultation personnalisée
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    Prise de mesures sur rendez-vous
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    Retouches et ajustements
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    Conseil en style vestimentaire
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;