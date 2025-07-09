
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribed(true);
    setEmail('');
    
    toast({
      title: "Inscription réussie !",
      description: "Vous recevrez nos dernières actualités",
    });

    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-light mb-4 tracking-wide">
            NEWSLETTER
          </h2>
          <p className="text-gray-600 text-sm mb-8 font-light">
            Recevez nos dernières actualités et offres exclusives
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="w-full px-0 py-4 border-0 border-b border-gray-200 focus:outline-none focus:border-black text-sm bg-transparent placeholder-gray-400"
                disabled={isSubscribed}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubscribed}
              className="w-full py-4 bg-black text-white font-light text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-800 flex items-center justify-center gap-2"
            >
              {isSubscribed ? (
                <>
                  <Check size={16} />
                  INSCRIT
                </>
              ) : (
                'S\'ABONNER'
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-400 font-light">
            Vous pouvez vous désabonner à tout moment
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
