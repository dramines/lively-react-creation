import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Music, Instagram, Facebook, Youtube, Upload, X, Mail, Phone, MapPin, AlertCircle, Link, Globe, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { ArtistsService } from '../services';
import { Artiste } from '../types';

const ArtisteCard = ({ artiste }: { artiste: Artiste }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <motion.div 
      layout
      className="card hover:border-gold-500/70 transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/artistes/${artiste.id}`)}
      whileHover={{ y: -5 }}
      animate={{ height: expanded ? 'auto' : 'auto' }}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative w-full sm:w-52 h-52 rounded-lg overflow-hidden group-hover:shadow-lg group-hover:shadow-gold-500/10 transition-all">
          <img 
            src={artiste.photo || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'} 
            alt={artiste.nom}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-80"></div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm p-2 rounded-lg">
              <Music className="h-4 w-4 text-gold-400" />
              <span className="text-white text-sm font-medium truncate">{artiste.genre || 'Non spécifié'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">{artiste.nom}</h3>
              <button 
                onClick={toggleExpand}
                className="ml-2 text-gray-400 hover:text-white p-1 bg-gray-800 rounded-full transition-colors"
              >
                {expanded ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> : 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                }
              </button>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`mt-3 text-gray-400 ${expanded ? '' : 'line-clamp-2'}`}
            >
              {artiste.bio || 'Aucune biographie disponible.'}
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-4 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {artiste.email && (
                <div className="flex items-center gap-2 text-sm bg-gray-800/50 p-2 rounded-lg">
                  <Mail className="h-4 w-4 text-gold-400 flex-shrink-0" />
                  <span className="text-gray-300 truncate">{artiste.email}</span>
                </div>
              )}
              
              {artiste.telephone && (
                <div className="flex items-center gap-2 text-sm bg-gray-800/50 p-2 rounded-lg">
                  <Phone className="h-4 w-4 text-gold-400 flex-shrink-0" />
                  <span className="text-gray-300 truncate">{artiste.telephone}</span>
                </div>
              )}
            </div>
            
            {artiste.adresse && (
              <div className="flex items-center gap-2 text-sm bg-gray-800/50 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-gold-400 flex-shrink-0" />
                <span className="text-gray-300">{artiste.adresse}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm bg-gray-800/50 p-2 rounded-lg">
              <Calendar className="h-4 w-4 text-gold-400 flex-shrink-0" />
              <span className="text-gray-300">
                {artiste.evenementsPassés} événement{artiste.evenementsPassés !== 1 ? 's' : ''} passé{artiste.evenementsPassés !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex gap-2 mt-3">
              {artiste.social?.instagram && (
                <a 
                  href={artiste.social.instagram} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              
              {artiste.social?.facebook && (
                <a 
                  href={artiste.social.facebook} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-lg hover:scale-105 transition-transform"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              
              {artiste.social?.youtube && (
                <a 
                  href={artiste.social.youtube} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gradient-to-br from-red-600 to-red-500 text-white rounded-lg hover:scale-105 transition-transform"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Artistes = () => {
  const [artistesList, setArtistesList] = useState<Artiste[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newArtiste, setNewArtiste] = useState<Partial<Artiste>>({
    nom: '',
    genre: '',
    bio: '',
    email: '',
    telephone: '',
    adresse: '',
    social: {
      instagram: '',
      facebook: '',
      youtube: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArtists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const artists = await ArtistsService.getAllArtists(user.id);
      setArtistesList(artists);
    } catch (err) {
      console.error('Error loading artists:', err);
      setError('Failed to load artists. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadArtists();
  }, []);

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

  const handleAddArtiste = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!newArtiste.nom) {
        setError("Le nom de l'artiste est requis.");
        setIsLoading(false);
        return;
      }
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        setError("Vous devez être connecté pour ajouter un artiste.");
        setIsLoading(false);
        return;
      }
      
      const newArtisteData = {
        nom: newArtiste.nom,
        genre: newArtiste.genre || '',
        email: newArtiste.email || '',
        telephone: newArtiste.telephone || '',
        photo: previewImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        bio: newArtiste.bio || '',
        adresse: newArtiste.adresse || '',
        social: newArtiste.social || {},
        user_id: user.id,
        evenementsPassés: 0
      };
      
      const response = await ArtistsService.createArtist(newArtisteData);
      console.log('Artist creation response:', response);
      
      await loadArtists();
      
      setIsModalOpen(false);
      setNewArtiste({
        nom: '',
        genre: '',
        bio: '',
        email: '',
        telephone: '',
        adresse: '',
        social: {
          instagram: '',
          facebook: '',
          youtube: ''
        }
      });
      setPreviewImage(null);
    } catch (err) {
      console.error('Error adding artist:', err);
      setError("Échec de l'ajout de l'artiste. Veuillez vérifier les données et réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArtistes = artistesList.filter(artiste => 
    (artiste.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (artiste.genre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (artiste.bio?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

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
          className="btn-primary flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          <Plus className="h-5 w-5" />
          Ajouter un artiste
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un artiste..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-6"
      >
        {isLoading ? (
          <div className="card flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
            <p className="text-gray-400 mt-4">Chargement des artistes...</p>
          </div>
        ) : filteredArtistes.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">Aucun artiste trouvé</p>
          </div>
        ) : (
          filteredArtistes.map(artiste => (
            <ArtisteCard key={artiste.id} artiste={artiste} />
          ))
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un artiste"
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
                Nom
              </label>
              <input
                type="text"
                className="input w-full"
                value={newArtiste.nom}
                onChange={(e) => setNewArtiste({ ...newArtiste, nom: e.target.value })}
                placeholder="Nom de l'artiste ou du groupe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Genre musical
              </label>
              <input
                type="text"
                className="input w-full"
                value={newArtiste.genre}
                onChange={(e) => setNewArtiste({ ...newArtiste, genre: e.target.value })}
                placeholder="Ex: Jazz, Hip-Hop, Électro..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Biographie
            </label>
            <textarea
              className="input w-full h-24"
              value={newArtiste.bio}
              onChange={(e) => setNewArtiste({ ...newArtiste, bio: e.target.value })}
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
                  className="input w-full"
                  value={newArtiste.email}
                  onChange={(e) => setNewArtiste({ ...newArtiste, email: e.target.value })}
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                  <Phone className="h-4 w-4" /> Téléphone
                </label>
                <input
                  type="tel"
                  className="input w-full"
                  value={newArtiste.telephone}
                  onChange={(e) => setNewArtiste({ ...newArtiste, telephone: e.target.value })}
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
                className="input w-full"
                value={newArtiste.adresse}
                onChange={(e) => setNewArtiste({ ...newArtiste, adresse: e.target.value })}
                placeholder="Ville, Pays"
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
                  className="input w-full"
                  value={newArtiste.social?.instagram}
                  onChange={(e) => setNewArtiste({ 
                    ...newArtiste, 
                    social: { ...newArtiste.social, instagram: e.target.value } 
                  })}
                  placeholder="URL Instagram"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                  <Facebook className="h-4 w-4" /> Facebook
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={newArtiste.social?.facebook}
                  onChange={(e) => setNewArtiste({ 
                    ...newArtiste, 
                    social: { ...newArtiste.social, facebook: e.target.value } 
                  })}
                  placeholder="URL Facebook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                  <Youtube className="h-4 w-4" /> YouTube
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={newArtiste.social?.youtube}
                  onChange={(e) => setNewArtiste({ 
                    ...newArtiste, 
                    social: { ...newArtiste.social, youtube: e.target.value } 
                  })}
                  placeholder="URL YouTube"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleAddArtiste}
            >
              Ajouter l'artiste
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Artistes;
