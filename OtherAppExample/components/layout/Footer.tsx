import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import PrivacyPolicyModal from '@/components/modals/PrivacyPolicyModal';
import TermsOfServiceModal from '@/components/modals/TermsOfServiceModal';
import CookiePolicyModal from '@/components/modals/CookiePolicyModal';
import AccessibilityModal from '@/components/modals/AccessibilityModal';
import ContactModal from '@/components/modals/ContactModal';

const Footer = () => {
  const { t } = useTranslation(['footer', 'newsletter']);
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isCookieOpen, setIsCookieOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: t('footer:newsletter.error'),
        description: t('footer:newsletter.emailRequired'),
        variant: 'destructive'
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: t('footer:newsletter.error'),
        description: t('footer:newsletter.emailInvalid'),
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://draminesaid.com/lucci/api/insert_newsletter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'website'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Store newsletter subscription status in localStorage
        localStorage.setItem('isNewsletter', 'true');
        
        toast({
          title: t('footer:newsletter.success'),
          description: t('footer:newsletter.successMessage')
        });
        setEmail('');
      } else {
        // Handle specific error messages
        if (result.message === 'EMAIL_ALREADY_SUBSCRIBED') {
          toast({
            title: t('footer:newsletter.error'),
            description: t('newsletter:emailAlreadySubscribed'),
            variant: 'destructive'
          });
        } else {
          throw new Error(result.message || 'Failed to subscribe');
        }
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: t('footer:newsletter.error'),
        description: t('footer:newsletter.subscriptionError'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/luccybyey', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/luccybyey', label: 'Instagram' },
  ];

  const customerCareLinks = [
    { label: t('footer:customerCare.contactUs'), action: () => setIsContactOpen(true) },
    { label: t('footer:customerCare.shipping'), href: '#' },
    { label: t('footer:customerCare.sizeGuide'), href: '#' },
    { label: t('footer:customerCare.faq'), href: '#' },
  ];

  const aboutLinks = [
    { label: t('footer:about.ourStory'), href: '#' },
    { label: t('footer:about.storeLocator'), href: '#' },
  ];

  const legalLinks = [
    { label: t('footer:legal.privacyPolicy'), action: () => setIsPrivacyOpen(true) },
    { label: t('footer:legal.termsOfService'), action: () => setIsTermsOpen(true) },
    { label: t('footer:legal.cookiePolicy'), action: () => setIsCookieOpen(true) },
    { label: t('footer:legal.accessibility'), action: () => setIsAccessibilityOpen(true) },
  ];

  return (
    <>
      <footer className="bg-slate-900 text-white">
        {/* Newsletter Section */}
        <div className="border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-3xl font-serif font-light mb-4">
                {t('footer:newsletter.title')}
              </h3>
              <p className="text-slate-300 mb-8">
                {t('footer:newsletter.subtitle')}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder={t('footer:newsletter.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 disabled:opacity-50"
                >
                  {isSubmitting ? t('footer:newsletter.subscribing') : t('footer:newsletter.subscribe')}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <img 
                src="/lovable-uploads/136aa729-e26b-4832-9cbb-97b861235f24.png" 
                alt="Luccy By EY Logo" 
                className="h-12 mb-6"
              />
              <p className="text-slate-300 mb-8 leading-relaxed">
                {t('footer:brand.description')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-slate-300">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{t('footer:contact.phone')}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{t('footer:contact.email')}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>{t('footer:contact.address')}</span>
                </div>
              </div>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-lg font-medium mb-6">{t('footer:customerCare.title')}</h4>
              <ul className="space-y-3">
                {customerCareLinks.map((link, index) => (
                  <li key={index}>
                    {link.action ? (
                      <button 
                        onClick={link.action}
                        className="text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a 
                        href={link.href} 
                        className="text-slate-300 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="text-lg font-medium mb-6">{t('footer:about.title')}</h4>
              <ul className="space-y-3 mb-8">
                {aboutLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-slate-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              
              {/* Payment Methods */}
              <div>
                <h5 className="text-lg font-medium mb-3">{t('footer:about.paymentMethods')}</h5>
                <img 
                  src="/lovable-uploads/6ae71c51-8aec-40a3-9ee7-1f91411ff60f.png" 
                  alt="Méthodes de paiement acceptées" 
                  className="h-8 object-contain"
                />
              </div>
            </div>

            {/* Social & Legal */}
            <div>
              <h4 className="text-lg font-medium mb-6">{t('footer:social.title')}</h4>
              <div className="flex space-x-4 mb-8">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <div className="space-y-3">
                {legalLinks.map((link, index) => (
                  <div key={index}>
                    <button 
                      onClick={link.action}
                      className="text-slate-400 text-sm hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
              <p>{t('footer:copyright')}</p>
              <p>
                {t('footer:developedBy')}{' '}
                <a 
                  href="https://ihebchebbi.pro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-slate-200 transition-colors duration-200"
                >
                  Iheb Chebbi
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <CookiePolicyModal isOpen={isCookieOpen} onClose={() => setIsCookieOpen(false)} />
      <AccessibilityModal isOpen={isAccessibilityOpen} onClose={() => setIsAccessibilityOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Footer;
