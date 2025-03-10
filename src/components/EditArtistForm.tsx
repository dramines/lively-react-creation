
import { useState, useEffect } from 'react';
import { ArtistsService } from '../services';
import { toast } from 'react-hot-toast';

interface EditArtistFormProps {
  artist: any;
  onSuccess: (artist: any) => void;
  onCancel: () => void;
}

const EditArtistForm = ({ artist, onSuccess, onCancel }: EditArtistFormProps) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    genre: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    photo: '',
    social: {
      instagram: '',
      facebook: '',
      twitter: '',
      youtube: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (artist) {
      setFormData({
        id: artist.id,
        name: artist.nom || artist.name || '',
        genre: artist.genre || '',
        email: artist.email || '',
        phone: artist.telephone || artist.phone || '',
        address: artist.adresse || artist.address || '',
        bio: artist.bio || '',
        photo: artist.photo || 'https://via.placeholder.com/150',
        social: artist.social || {
          instagram: '',
          facebook: '',
          twitter: '',
          youtube: ''
        }
      });
    }
  }, [artist]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.name.trim()) {
        toast.error('Le nom de l\'artiste est requis');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Updating artist data:', formData);
      const result = await ArtistsService.updateArtist(formData);
      console.log('Artist updated:', result);
      
      onSuccess({
        ...formData,
        nom: formData.name,
        telephone: formData.phone,
        adresse: formData.address
      });
      toast.success('Artiste mis à jour avec succès');
    } catch (error) {
      console.error('Error updating artist:', error);
      toast.error('Erreur lors de la mise à jour de l\'artiste');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Nom *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-1">
          Genre musical
        </label>
        <input
          type="text"
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
          Adresse
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
          Biographie
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Réseaux sociaux
        </label>
        <div className="space-y-3">
          <div>
            <label htmlFor="instagram" className="block text-xs text-gray-400 mb-1">
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={formData.social.instagram}
              onChange={handleSocialChange}
              placeholder="https://instagram.com/username"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          
          <div>
            <label htmlFor="facebook" className="block text-xs text-gray-400 mb-1">
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              value={formData.social.facebook}
              onChange={handleSocialChange}
              placeholder="https://facebook.com/username"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          
          <div>
            <label htmlFor="twitter" className="block text-xs text-gray-400 mb-1">
              Twitter
            </label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              value={formData.social.twitter}
              onChange={handleSocialChange}
              placeholder="https://twitter.com/username"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          
          <div>
            <label htmlFor="youtube" className="block text-xs text-gray-400 mb-1">
              YouTube
            </label>
            <input
              type="text"
              id="youtube"
              name="youtube"
              value={formData.social.youtube}
              onChange={handleSocialChange}
              placeholder="https://youtube.com/channel/..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gold-500 text-white rounded-md hover:bg-gold-400 transition-colors flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
          )}
          Mettre à jour
        </button>
      </div>
    </form>
  );
};

export default EditArtistForm;
