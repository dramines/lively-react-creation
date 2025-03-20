
import { useState } from 'react';
import Modal from '../../Modal';
import { Mail, Phone, MapPin, AlertCircle, X, Upload, Music, Clock, DollarSign } from 'lucide-react';
import { ArtistsService } from '../../../services';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  artist?: any;
}

const ArtistModal = ({ isOpen, onClose, onSuccess, artist }: ArtistModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(artist?.photo || null);
  const [formData, setFormData] = useState({
    id: artist?.id || null,
    nom: artist?.nom || '',
    genre: artist?.genre || '',
    bio: artist?.bio || '',
    email: artist?.email || '',
    telephone: artist?.telephone || artist?.phone || '',
    adresse: artist?.adresse || artist?.address || '',
    rehearsalHours: artist?.rehearsalHours || 0,
    totalRevenue: artist?.totalRevenue || 0,
    social: {
      instagram: artist?.social?.instagram || '',
      facebook: artist?.social?.facebook || '',
      twitter: artist?.social?.twitter || ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      social: {
        ...formData.social,
        [name]: value
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nom) {
      toast.error("Le nom de l'artiste est requis.");
      return;
    }

    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        toast.error("Vous devez être connecté pour ajouter un artiste.");
        setIsLoading(false);
        return;
      }
      
      const artistData = {
        id: formData.id,
        name: formData.nom,
        genre: formData.genre,
        email: formData.email,
        phone: formData.telephone,
        address: formData.adresse,
        bio: formData.bio,
        photo: previewImage || 'https://via.placeholder.com/150',
        social: JSON.stringify(formData.social),
        rehearsal_hours: formData.rehearsalHours,
        total_revenue: formData.totalRevenue,
        user_id: user.id
      };
      
      let response;
      if (artist?.id) {
        response = await ArtistsService.updateArtist({
          ...artistData,
          id: artist.id
        });
        toast.success("Artiste mis à jour avec succès!");
      } else {
        response = await ArtistsService.createArtist(artistData);
        toast.success("Artiste ajouté avec succès!");
      }
      
      console.log('Artist response:', response);
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving artist:', err);
      toast.error("Erreur lors de l'enregistrement de l'artiste.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={artist?.id ? "Modifier l'artiste" : "Ajouter un artiste"}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Photo de l'artiste
          </label>
          <div className="relative">
            {previewImage ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full text-white hover:bg-gray-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-4 text-center h-48 flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-400">
                    Cliquez ou glissez une image ici
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Nom*
            </label>
            <input
              type="text"
              name="nom"
              className="input w-full"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom de l'artiste ou du groupe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
              <Music className="h-4 w-4" /> Genre musical
            </label>
            <input
              type="text"
              name="genre"
              className="input w-full"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Ex: Jazz, Hip-Hop, Électro..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Biographie
          </label>
          <textarea
            name="bio"
            className="input w-full h-24"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Courte description de l'artiste..."
          />
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">Informations de contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                <Mail className="h-4 w-4" /> Email
              </label>
              <input
                type="email"
                name="email"
                className="input w-full"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemple.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                <Phone className="h-4 w-4" /> Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                className="input w-full"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Adresse
            </label>
            <input
              type="text"
              name="adresse"
              className="input w-full"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Ville, Pays"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
              <Clock className="h-4 w-4" /> Heures de répétition
            </label>
            <input
              type="number"
              name="rehearsalHours"
              className="input w-full"
              value={formData.rehearsalHours}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
              <DollarSign className="h-4 w-4" /> Revenus totaux (€)
            </label>
            <input
              type="number"
              name="totalRevenue"
              className="input w-full"
              value={formData.totalRevenue}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">Réseaux sociaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                <Instagram className="h-4 w-4" /> Instagram
              </label>
              <input
                type="text"
                name="instagram"
                className="input w-full"
                value={formData.social.instagram}
                onChange={handleSocialChange}
                placeholder="URL Instagram"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                <Facebook className="h-4 w-4" /> Facebook
              </label>
              <input
                type="text"
                name="facebook"
                className="input w-full"
                value={formData.social.facebook}
                onChange={handleSocialChange}
                placeholder="URL Facebook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                <Twitter className="h-4 w-4" /> Twitter
              </label>
              <input
                type="text"
                name="twitter"
                className="input w-full"
                value={formData.social.twitter}
                onChange={handleSocialChange}
                placeholder="URL Twitter"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </span>
            ) : artist?.id ? "Enregistrer les modifications" : "Ajouter l'artiste"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ArtistModal;
