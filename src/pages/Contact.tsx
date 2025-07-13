
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import CustomMap from '@/components/contact/CustomMap';

const Contact = () => {
  const { t } = useTranslation('contact');
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const orderFromParam = searchParams.get('order');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill form when coming from payment success with order ID
  useEffect(() => {
    if (orderFromParam) {
      setFormData(prev => ({
        ...prev,
        subject: 'Demande de statut de commande',
        message: `Bonjour,

Je souhaiterais obtenir des informations concernant le statut de ma commande numéro #${orderFromParam}.

Pourriez-vous me tenir informé de l'état d'avancement de ma commande ?

Merci pour votre professionnalisme.

Cordialement.`
      }));
    }
  }, [orderFromParam]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('phoneRequired');
    }
    if (!formData.subject.trim()) {
      newErrors.subject = t('subjectRequired');
    }
    if (!formData.message.trim()) {
      newErrors.message = t('messageRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: t('error'),
        description: t('errorMessage'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://draminesaid.com/lucci/api/insert_email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom_client: formData.name,
          email_client: formData.email,
          telephone_client: formData.phone,
          sujet_message: formData.subject,
          message_client: formData.message
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: t('success'),
          description: t('successMessage'),
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
        title: t('error'),
        description: t('errorMessage'),
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
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-light mb-6">
                {t('title')}
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Form and Map Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 flex flex-col">
              <h2 className="text-3xl font-serif font-light mb-8 text-gray-900">
                {t('getInTouch')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-900 mb-2 block">
                      {t('name')} *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      placeholder={t('namePlaceholder')}
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">
                      {t('email')} *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      placeholder={t('emailPlaceholder')}
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-900 mb-2 block">
                      {t('phone')} *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      placeholder={t('phonePlaceholder')}
                      disabled={isSubmitting}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-900 mb-2 block">
                      {t('subject')} *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      placeholder={t('subjectPlaceholder')}
                      disabled={isSubmitting}
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>
                </div>

                <div className="flex-1">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-900 mb-2 block">
                    {t('message')} *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none h-32"
                    placeholder={t('messagePlaceholder')}
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 px-8 rounded-lg font-medium text-lg transition-colors disabled:opacity-50 mt-auto"
                >
                  {isSubmitting ? (
                    t('submitting')
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('submit')}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Custom Map */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
              <div className="flex-1">
                <CustomMap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
