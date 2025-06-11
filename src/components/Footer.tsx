
import { Shield, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import Logo from '@/components/ui/Logo';
import AboutModal from './AboutModal';
import EngagementsModal from './EngagementsModal';
import ContactModal from './ContactModal';
import FAQModal from './FAQModal';
import CGVModal from './CGVModal';
import MentionsLegalesModal from './MentionsLegalesModal';
import RefundPolicyModal from './RefundPolicyModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const Footer = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showEngagementsModal, setShowEngagementsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showCGVModal, setShowCGVModal] = useState(false);
  const [showMentionsModal, setShowMentionsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <footer className="bg-slate-800 text-white font-baloo">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-br from-pastel-blue via-powder-pink to-pastel-lavender py-4 md:py-6">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-base md:text-lg font-bold text-slate-700 mb-2 font-baloo">
              Restez informé de nos nouveautés !
            </h3>
            <p className="text-slate-600 mb-3 text-sm font-baloo">
              Recevez nos dernières histoires et offres spéciales
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-3 py-2 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50 text-sm font-baloo border border-slate-300"
              />
              <button className="bg-slate-700 text-white px-4 py-2 rounded font-semibold hover:bg-slate-600 transition-colors text-sm font-baloo">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-6 md:py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Company Info */}
              <div className="space-y-3">
                <Logo size="lg" clickable={true} />
                <p className="text-slate-300 text-sm leading-relaxed font-baloo">
                  Créons ensemble des histoires magiques où votre enfant devient le héros de ses propres aventures.
                </p>
                <div className="flex space-x-3 items-center">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-light-coral transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-light-coral transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-light-coral transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-light-coral font-baloo">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-light-coral flex-shrink-0" />
                    <span className="text-sm text-slate-300 font-baloo">contact@mylittlehero.fr</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-light-coral flex-shrink-0" />
                    <span className="text-sm text-slate-300 font-baloo">01 23 45 67 89</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-light-coral flex-shrink-0" />
                    <span className="text-sm text-slate-300 font-baloo">Paris, France</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-light-coral flex-shrink-0" />
                    <span className="text-sm text-slate-300 font-baloo">Lun-Ven 9h-18h</span>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-light-coral font-baloo">Informations</h3>
                <div className="space-y-2 text-sm">
                  <button 
                    onClick={() => setShowAboutModal(true)}
                    className="block text-slate-300 hover:text-light-coral transition-colors text-left w-full font-baloo"
                  >
                    À propos
                  </button>
                  <button 
                    onClick={() => setShowEngagementsModal(true)}
                    className="block text-slate-300 hover:text-light-coral transition-colors text-left w-full font-baloo"
                  >
                    Nos engagements
                  </button>
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="block text-slate-300 hover:text-light-coral transition-colors text-left w-full font-baloo"
                  >
                    Contact
                  </button>
                  <button 
                    onClick={() => setShowFAQModal(true)}
                    className="block text-slate-300 hover:text-light-coral transition-colors text-left w-full font-baloo"
                  >
                    FAQ
                  </button>
                  <button 
                    onClick={() => setShowCGVModal(true)}
                    className="block text-slate-300 hover:text-light-coral transition-colors text-left w-full font-baloo"
                  >
                    Conditions générales de vente
                  </button>
                </div>
              </div>

              {/* Legal & Trust */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-light-coral font-baloo">Sécurité</h3>
                <div className="space-y-2 text-sm mb-4">
                  <button 
                    onClick={() => setShowMentionsModal(true)}
                    className="block text-slate-300 hover:text-light-coral transition-colors text-left w-full font-baloo"
                  >
                    Mentions légales
                  </button>
                  <button 
                    onClick={() => setShowRefundModal(true)}
                    className="block text-slate-300 hover:text-light-coral transition-colors text-left w-full font-baloo"
                  >
                    Politique de remboursement
                  </button>
                  <button 
                    onClick={() => setShowPrivacyModal(true)}
                    className="block text-slate-300 hover:text-light-coral transition-colors text-left w-full font-baloo"
                  >
                    Politique de confidentialité
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-sweet-mint flex-shrink-0" />
                    <span className="text-xs text-slate-300 font-baloo">Paiement 100% sécurisé</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-sweet-mint flex-shrink-0" />
                    <span className="text-xs text-slate-300 font-baloo">Données protégées RGPD</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-sweet-mint flex-shrink-0" />
                    <span className="text-xs text-slate-300 font-baloo">Livraison suivie</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 py-4">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-baloo">
                © 2024 My Little Hero. Tous droits réservés. Créé avec ❤️ pour des moments magiques en famille.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
      <EngagementsModal isOpen={showEngagementsModal} onClose={() => setShowEngagementsModal(false)} />
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      <FAQModal isOpen={showFAQModal} onClose={() => setShowFAQModal(false)} />
      <CGVModal isOpen={showCGVModal} onClose={() => setShowCGVModal(false)} />
      <MentionsLegalesModal isOpen={showMentionsModal} onClose={() => setShowMentionsModal(false)} />
      <RefundPolicyModal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)} />
      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </>
  );
};

export default Footer;
