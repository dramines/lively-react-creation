
import { useState } from 'react';
import { ArtistsService } from '../services';
import { toast } from 'react-hot-toast';

interface NewArtistFormProps {
  onSuccess: (artist: any) => void;
  onCancel: () => void;
}

const NewArtistForm = ({ onSuccess, onCancel }: NewArtistFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.name.trim()) {
        toast.error('Le nom de l\'artiste est requis');
        return;
      }
      
      console.log('Submitting artist data:', formData);
      const result = await ArtistsService.createArtist(formData);
      console.log('Artist created:', result);
      
      if (result && result.id) {
        onSuccess(result);
      } else {
        toast.error('Erreur lors de la création de l\'artiste');
      }
    } catch (error) {
      console.error('Error creating artist:', error);
      toast.error('Erreur lors de la création de l\'artiste');
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
          Créer l'artiste
        </button>
      </div>
    </form>
  );
};

export default NewArtistForm;
