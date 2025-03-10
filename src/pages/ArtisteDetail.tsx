
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Music,
  CalendarIcon,
  DollarSign,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import EventCalendar from '../components/Calendar/Calendar';
import { ArtistsService, EventsService, FilesService } from '../services';

interface Document {
  id: string;
  nom: string;
  type: string;
  date: string;
  taille: string;
}

interface Artiste {
  id: string;
  nom: string;
  genre: string;
  photo: string;
  bio: string;
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  evenementsPassés: number;
  email?: string;
  telephone?: string;
  adresse?: string;
}

interface Projet {
  id: string;
  nom: string;
  date: string;
  statut: string;
  budget: number;
  taches: {
    id: string;
    titre: string;
    statut: string;
    deadline: string;
  }[];
}

const ArtisteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'apercu' | 'projets' | 'documents'>('apercu');
  const [artiste, setArtiste] = useState<Artiste | null>(null);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadArtist = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const artistData = await ArtistsService.getArtist(id);
        if (artistData) {
          setArtiste(artistData);
          
          // Load related events
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const eventsData = await EventsService.getAllEvents();
          const artistEvents = eventsData.filter((event: any) => 
            event.artists && event.artists.includes(artistData.nom)
          );
          
          // Format events for calendar
          const formattedEvents = artistEvents.map((event: any) => ({
            id: event.id,
            title: event.title,
            date: new Date(event.date),
            type: 'event'
          }));
          
          setEvents(formattedEvents);
          
          // Load related documents
          const filesData = await FilesService.getAllFiles();
          const artistFiles = filesData.filter((file: any) => 
            file.related_id === id && file.related_type === 'artist'
          );
          
          setDocuments(artistFiles.map((file: any) => ({
            id: file.id,
            nom: file.name,
            type: file.type,
            date: file.created_at,
            taille: `${Math.round(file.size / 1024)} KB`
          })));
        } else {
          navigate('/artistes');
        }
      } catch (err) {
        console.error('Error loading artist details:', err);
        setError('Failed to load artist details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArtist();
  }, [id, navigate]);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'à_venir':
        return 'bg-blue-500';
      case 'confirmé':
        return 'bg-green-500';
      case 'en_cours':
        return 'bg-yellow-500';
      case 'terminé':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTaskStatusIcon = (statut: string) => {
    switch (statut) {
      case 'à_faire':
        return AlertCircle;
      case 'en_cours':
        return Clock;
      case 'terminé':
        return CheckCircle2;
      default:
        return AlertCircle;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mb-4 mx-auto"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4 mx-auto" />
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => navigate('/artistes')}
            className="mt-4 btn-secondary"
          >
            Retour aux artistes
          </button>
        </div>
      </div>
    );
  }

  if (!artiste) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-400">Aucun artiste trouvé</p>
          <button 
            onClick={() => navigate('/artistes')}
            className="mt-4 btn-secondary"
          >
            Retour aux artistes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/artistes')}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Retour aux artistes
      </button>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden">
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
                  <Music className="h-4 w-4 text-gold-400" />
                  <span className="text-gray-400">{artiste.genre}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {artiste.social.instagram && (
                  <a href={artiste.social.instagram} className="text-gray-400 hover:text-white">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {artiste.social.facebook && (
                  <a href={artiste.social.facebook} className="text-gray-400 hover:text-white">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {artiste.social.twitter && (
                  <a href={artiste.social.twitter} className="text-gray-400 hover:text-white">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
            <p className="mt-4 text-gray-300">{artiste.bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>{artiste.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>{artiste.telephone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>{artiste.adresse}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-gold-400" />
            <div>
              <h3 className="font-semibold">Événements</h3>
              <p className="text-2xl font-bold text-white">{artiste.evenementsPassés}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-gold-400" />
            <div>
              <h3 className="font-semibold">Heures de répétition</h3>
              <p className="text-2xl font-bold text-white">0h</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-gold-400" />
            <div>
              <h3 className="font-semibold">Revenu total</h3>
              <p className="text-2xl font-bold text-white">0 €</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-700">
        <button
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'apercu'
              ? 'text-gold-400 border-b-2 border-gold-400'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('apercu')}
        >
          Aperçu
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'projets'
              ? 'text-gold-400 border-b-2 border-gold-400'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('projets')}
        >
          Projets
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'documents'
              ? 'text-gold-400 border-b-2 border-gold-400'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'apercu' && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Calendrier des événements</h2>
            <EventCalendar events={events} />
          </div>
        )}

        {activeTab === 'projets' && (
          <div className="space-y-4">
            {projets.length > 0 ? (
              projets.map((projet) => (
                <div key={projet.id} className="card">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{projet.nom}</h3>
                      <p className="text-gray-400">
                        {new Date(projet.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gold-400 font-semibold">
                        {projet.budget.toLocaleString('fr-FR')} €
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(projet.statut)} text-white`}>
                        {projet.statut.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {projet.taches.map((tache) => {
                      const StatusIcon = getTaskStatusIcon(tache.statut);
                      return (
                        <div key={tache.id} className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <StatusIcon className="h-5 w-5 text-gold-400" />
                            <span>{tache.titre}</span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {new Date(tache.deadline).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="card flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400">Aucun projet trouvé</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="card">
            <div className="space-y-4">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-6 w-6 text-gold-400" />
                      <div>
                        <h4 className="font-medium">{doc.nom}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(doc.date).toLocaleDateString('fr-FR')} • {doc.taille}
                        </p>
                      </div>
                    </div>
                    <button className="btn-secondary">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-400">Aucun document trouvé</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisteDetail;
