import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Mail, Gift, Star, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const NewsletterSection = () => {
  const { t } = useTranslation(['footer']);
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        
        setIsSubmitted(true);
        setEmail('');
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        // Handle specific error messages
        if (result.message === 'EMAIL_ALREADY_SUBSCRIBED') {
          toast({
            title: t('footer:newsletter.error'),
            description: 'Cette adresse email est déjà inscrite à notre newsletter',
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

  return (
    <section className="relative py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white/15 rounded-full animate-pulse"></div>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-16 left-1/4 w-6 h-6 text-white/30 animate-pulse" />
        <Star className="absolute top-1/3 right-1/4 w-5 h-5 text-white/20 animate-bounce" />
        <Gift className="absolute bottom-1/3 left-1/3 w-7 h-7 text-white/25 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-white mb-6 text-center">
            {t('footer:newsletter.title')}
          </h2>
          <p className="text-xl text-white/90 mb-4 text-center">
            Inscrivez-vous à notre newsletter exclusive
          </p>
          <p className="text-lg text-white/80 text-center">
            {t('footer:newsletter.subtitle')}
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Mail className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Tendances Exclusives</h3>
            <p className="text-white/80 text-sm">Découvrez les dernières tendances avant tout le monde</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Gift className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Offres Privilégiées</h3>
            <p className="text-white/80 text-sm">Bénéficiez de réductions exclusives et cadeaux</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Star className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Accès VIP</h3>
            <p className="text-white/80 text-sm">Accès prioritaire aux ventes privées</p>
          </div>
        </div>

        {/* Newsletter Form */}
        <div className="max-w-md mx-auto">
          {!isSubmitted ? (
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  placeholder={t('footer:newsletter.emailPlaceholder')}
                  className="flex-1 px-6 py-4 rounded-full bg-white/95 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500 disabled:opacity-50 h-14"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-white text-blue-900 hover:bg-gray-100 rounded-full font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 h-14 flex-shrink-0"
                >
                  {isSubmitting ? t('footer:newsletter.subscribing') : t('footer:newsletter.subscribe')}
                </Button>
              </form>
              
              <p className="text-white/70 text-sm text-center">
                En soumettant, vous acceptez notre Politique de confidentialité.
              </p>
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 border border-white/30 animate-fade-in">
              <p className="text-white font-medium">
                ✨ {t('footer:newsletter.successMessage')} !
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
