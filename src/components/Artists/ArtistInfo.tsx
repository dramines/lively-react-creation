
import { Mail, MapPin, Music, Phone, Instagram, Facebook, Twitter, DollarSign, Clock } from 'lucide-react';
import { Artiste } from '../../types';

interface ArtistInfoProps {
  artiste: Artiste;
}

const ArtistInfo = ({ artiste }: ArtistInfoProps) => {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden">
          <img 
            src={artiste.photo || 'https://via.placeholder.com/150'} 
            alt={artiste.nom}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{artiste.nom}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Music className="h-4 w-4 text-gold-400" />
                <span className="text-gray-400">{artiste.genre}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {artiste.social?.instagram && (
                <a href={artiste.social.instagram} className="text-gray-400 hover:text-white bg-gray-700 p-2 rounded-full" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {artiste.social?.facebook && (
                <a href={artiste.social.facebook} className="text-gray-400 hover:text-white bg-gray-700 p-2 rounded-full" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {artiste.social?.twitter && (
                <a href={artiste.social.twitter} className="text-gray-400 hover:text-white bg-gray-700 p-2 rounded-full" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
          <p className="mt-4 text-gray-300">{artiste.bio}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 text-gray-400">
              <Mail className="h-5 w-5 text-gold-400" />
              <span>{artiste.email || "Non renseigné"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Phone className="h-5 w-5 text-gold-400" />
              <span>{artiste.telephone || "Non renseigné"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <MapPin className="h-5 w-5 text-gold-400" />
              <span>{artiste.adresse || "Non renseigné"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Clock className="h-5 w-5 text-gold-400" />
              <span>{artiste.rehearsalHours || "0"} heures de répétition</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <DollarSign className="h-5 w-5 text-gold-400" />
              <span>{artiste.totalRevenue ? `${artiste.totalRevenue.toFixed(2)} €` : "0.00 €"} de revenus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
