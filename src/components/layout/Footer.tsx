import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
const Footer = () => {
  const {
    t
  } = useTranslation(['footer', 'newsletter']);
  const {
    toast
  } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          'Content-Type': 'application/json'
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
  const socialLinks = [{
    icon: Facebook,
    href: 'https://facebook.com/luccybyey',
    label: 'Facebook'
  }, {
    icon: Instagram,
    href: 'https://instagram.com/luccybyey',
    label: 'Instagram'
  }];
  const customerCareLinks = [{
    label: t('footer:customerCare.contactUs'),
    href: '/contact'
  }, {
    label: t('footer:customerCare.sizeGuide'),
    href: '#'
  }, {
    label: t('footer:customerCare.faq'),
    href: '#'
  }];
  const aboutLinks = [{
    label: t('footer:about.ourStory'),
    href: '#'
  }, {
    label: t('footer:about.storeLocator'),
    href: '#'
  }];
  const legalLinks = [{
    label: t('footer:legal.privacyPolicy'),
    href: '/privacy-policy'
  }, {
    label: t('footer:legal.termsOfService'),
    href: '/terms-of-service'
  }, {
    label: t('footer:legal.cookiePolicy'),
    href: '/cookie-policy'
  }, {
    label: t('footer:legal.accessibility'),
    href: '/accessibility'
  }];
  return <>
      <footer className="bg-white text-black">
        {/* Newsletter Section */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-serif font-light mb-6 text-black">
                {t('footer:newsletter.title')}
              </h3>
              <p className="text-gray-600 mb-8 lg:mb-10 text-base leading-relaxed">
                {t('footer:newsletter.subtitle')}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4 max-w-lg mx-auto">
                <Input type="email" placeholder={t('footer:newsletter.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting} className="h-14 bg-gray-50 border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black text-base px-6 rounded-lg" />
                <Button type="submit" disabled={isSubmitting} className="h-14 bg-black text-white hover:bg-gray-800 disabled:opacity-50 font-medium text-base rounded-lg transition-all duration-200">
                  {isSubmitting ? t('footer:newsletter.subscribing') : t('footer:newsletter.subscribe')}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1 text-center lg:text-left">
              <img alt="Luccy By EY Logo" className="h-12 lg:h-14 mb-6 mx-auto lg:mx-0" src="/lovable-uploads/12441e18-18e2-4f2a-8b36-5ac511beb390.png" />
              <p className="text-gray-600 mb-8 leading-relaxed text-sm lg:text-base max-w-md mx-auto lg:mx-0">
                {t('footer:brand.description')}
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start text-gray-600">
                  <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm lg:text-base">{t('footer:contact.phone')}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-gray-600">
                  <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm lg:text-base">{t('footer:contact.email')}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm lg:text-base text-center lg:text-left">{t('footer:contact.address')}</span>
                </div>
              </div>
            </div>

            {/* Customer Care */}
            <div className="text-center lg:text-left mt-6 lg:mt-0">
              <h4 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-black">{t('footer:customerCare.title')}</h4>
              <ul className="space-y-1 lg:space-y-3">
                {customerCareLinks.map((link, index) => <li key={index}>
                    <a href={link.href} className="text-gray-600 hover:text-black transition-colors duration-200 text-base lg:text-lg font-medium block min-h-[44px] flex items-center justify-center lg:justify-start">
                      {link.label}
                    </a>
                  </li>)}
              </ul>
            </div>

            {/* About */}
            <div className="text-center lg:text-left mt-6 lg:mt-0">
              <h4 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-black">{t('footer:about.title')}</h4>
              <ul className="space-y-1 lg:space-y-3 mb-6 lg:mb-8">
                {aboutLinks.map((link, index) => <li key={index}>
                    <a href={link.href} className="text-gray-600 hover:text-black transition-colors duration-200 text-base lg:text-lg font-medium block min-h-[44px] flex items-center justify-center lg:justify-start">
                      {link.label}
                    </a>
                  </li>)}
              </ul>
              
              {/* Payment Methods */}
              <div className="p-0">
                <h5 className="text-base lg:text-lg font-semibold mb-4 text-black">{t('footer:about.paymentMethods')}</h5>
                <img src="/lovable-uploads/6ae71c51-8aec-40a3-9ee7-1f91411ff60f.png" alt="Méthodes de paiement acceptées" className="h-8 lg:h-10 object-contain mx-auto lg:mx-0" />
              </div>
            </div>

            {/* Social & Legal */}
            <div className="text-center lg:text-left mt-6 lg:mt-0">
              <h4 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-black">{t('footer:social.title')}</h4>
              <div className="flex justify-center lg:justify-start gap-4 lg:gap-6 mb-6 lg:mb-8">
                {socialLinks.map((social, index) => <a key={index} href={social.href} className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-200 transition-all duration-200 hover:scale-105" aria-label={social.label}>
                    <social.icon className="w-6 h-6 lg:w-7 lg:h-7" />
                  </a>)}
              </div>
               <div className="space-y-1 lg:space-y-3">
                {legalLinks.map((link, index) => <div key={index}>
                    <a href={link.href} className="text-gray-500 text-sm lg:text-base hover:text-black transition-colors duration-200 cursor-pointer block min-h-[44px] flex items-center justify-center lg:justify-start w-full font-medium">
                      {link.label}
                    </a>
                  </div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center text-xs lg:text-sm text-gray-600 space-y-4 lg:space-y-0">
              <p className="text-center lg:text-left font-medium">{t('footer:copyright')}</p>
              <p className="text-center lg:text-right">
                {t('footer:developedBy')}{' '}
                <a href="https://ihebchebbi.pro/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800 transition-colors duration-200 font-semibold underline underline-offset-2">
                  Iheb Chebbi
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>;
};
export default Footer;
