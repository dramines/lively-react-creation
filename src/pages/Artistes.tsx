
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ArtistsService } from '../services';
import { Artiste } from '../types';
import Modal from '../components/Modal';
import NewArtistForm from '../components/NewArtistForm';

const Artistes = () => {
  const [artists, setArtists] = useState<Artiste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewArtistModalOpen, setIsNewArtistModalOpen] = useState(false);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    setLoading(true);
    try {
      const response = await ArtistsService.getAllArtists();
      console.log('Loaded artists:', response);
      
      // Convert API response to Artiste type
      const formattedArtists = response.map((artist: any) => ({
        id: artist.id,
        nom: artist.name || artist.nom || '',
        genre: artist.genre || '',
        email: artist.email || '',
        telephone: artist.phone || artist.telephone || '',
        photo: artist.photo || 'https://via.placeholder.com/150',
        user_id: artist.user_id,
        bio: artist.bio || '',
        social: artist.social || { instagram: '', facebook: '', twitter: '', youtube: '' },
        evenementsPassés: artist.evenementsPassés || 0,
        adresse: artist.adresse || ''
      }));
      
      setArtists(formattedArtists);
    } catch (error) {
      console.error('Error loading artists:', error);
      setError('Erreur lors du chargement des artistes');
      toast.error('Erreur lors du chargement des artistes');
    } finally {
      setLoading(false);
    }
  };

  const handleArtistAdded = (newArtist: any) => {
    setArtists((prevArtists) => [
      {
        id: newArtist.id,
        nom: newArtist.name || '',
        genre: newArtist.genre || '',
        email: newArtist.email || '',
        telephone: newArtist.phone || '',
        photo: newArtist.photo || 'https://via.placeholder.com/150',
        user_id: newArtist.user_id,
        bio: newArtist.bio || '',
        social: { instagram: '', facebook: '', twitter: '', youtube: '' },
        evenementsPassés: 0,
        adresse: ''
      },
      ...prevArtists
    ]);
    
    setIsNewArtistModalOpen(false);
    toast.success('Artiste ajouté avec succès!');
  };

  return (
    <div className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
        >
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </motion.div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Artistes</h1>
        <button 
          onClick={() => setIsNewArtistModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nouveau artiste
        </button>
      </div>

      {loading ? (
        <div className="card flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
          <p className="text-gray-400 mt-4">Chargement des artistes...</p>
        </div>
      ) : artists.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-400">Aucun artiste trouvé</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {artists.map((artist) => (
            <a href={`/artistes/${artist.id}`} key={artist.id} className="no-underline">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card p-4 flex flex-col items-center"
              >
                <img
                  src={artist.photo}
                  alt={artist.nom}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-white">{artist.nom}</h3>
                <p className="text-gray-400 text-center">{artist.genre}</p>
              </motion.div>
            </a>
          ))}
        </motion.div>
      )}

      <Modal 
        isOpen={isNewArtistModalOpen} 
        onClose={() => setIsNewArtistModalOpen(false)}
        title="Ajouter un nouvel artiste"
      >
        <NewArtistForm 
          onSuccess={handleArtistAdded} 
          onCancel={() => setIsNewArtistModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default Artistes;
