
import { Mail, MapPin, Music, Phone, Instagram, Facebook, Youtube } from 'lucide-react';
import { Artiste } from '../../types';

interface ArtistInfoProps {
  artiste: Artiste;
}

const ArtistInfo = ({ artiste }: ArtistInfoProps) => {
  return (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden ring-2 ring-purple-500/20 shadow-lg">
          <img 
            src={artiste.photo} 
            alt={artiste.nom}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{artiste.nom}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Music className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">{artiste.genre || 'Genre non spécifié'}</span>
              </div>
            </div>
            <div className="flex gap-3">
              {artiste.social?.instagram && (
                <a href={artiste.social.instagram} className="text-gray-400 hover:text-purple-400 bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-all duration-300" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {artiste.social?.facebook && (
                <a href={artiste.social.facebook} className="text-gray-400 hover:text-purple-400 bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-all duration-300" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {artiste.social?.youtube && (
                <a href={artiste.social.youtube} className="text-gray-400 hover:text-purple-400 bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-all duration-300" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-300 leading-relaxed">{artiste.bio || 'Aucune biographie disponible pour cet artiste.'}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center gap-3 text-gray-300 bg-gray-800/30 p-3 rounded-lg">
              <div className="bg-purple-900/30 p-2 rounded-full">
                <Mail className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{artiste.email || "Non renseigné"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-gray-800/30 p-3 rounded-lg">
              <div className="bg-purple-900/30 p-2 rounded-full">
                <Phone className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Téléphone</p>
                <p className="text-sm">{artiste.telephone || "Non renseigné"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-gray-800/30 p-3 rounded-lg">
              <div className="bg-purple-900/30 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Adresse</p>
                <p className="text-sm">{artiste.adresse || "Non renseigné"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
