import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1A1F2C] text-gray-300">
      {/* Main Footer Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-playfair text-2xl font-bold text-white">ELLES</h3>
            <p className="text-sm leading-relaxed">
              Votre partenaire de confiance en vêtements professionnels depuis 2010. 
              Nous nous engageons à fournir des solutions vestimentaires de qualité pour tous les métiers.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-sans text-lg font-semibold text-white">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm transition-colors hover:text-white">Accueil</Link>
              </li>
              <li>
                <Link to="/metiers" className="text-sm transition-colors hover:text-white">Métiers</Link>
              </li>
              <li>
                <Link to="/marques" className="text-sm transition-colors hover:text-white">Marques</Link>
              </li>
              <li>
                <Link to="/personalization" className="text-sm transition-colors hover:text-white">Personnalisation</Link>
              </li>
              <li>
                <Link to="/devis" className="text-sm transition-colors hover:text-white">Demande de devis</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-sans text-lg font-semibold text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-secondary" />
                123 Rue du Commerce, 75001 Paris
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-secondary" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-secondary" />
                contact@elles.com
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-secondary" />
                Lun - Ven: 9h - 18h
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#151821]">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm md:flex-row">
          <p>&copy; 2024 ELLES. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">Mentions légales</a>
            <a href="#" className="transition-colors hover:text-white">Politique de confidentialité</a>
            <a href="#" className="transition-colors hover:text-white">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;