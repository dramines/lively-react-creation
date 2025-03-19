
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
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  ListTodo,
  UploadCloud,
  Search,
  Edit,
  Tag,
  Filter
} from 'lucide-react';
import EventCalendar from '../components/Calendar/Calendar';
import Modal from '../components/Modal';
import { ArtistsService, EventsService, FilesService, ProjectsService } from '../services';
import { ProjetTache } from '../types';
import { formatDate, formatFileSize } from '../utils/formatters';

interface Document {
  id: string;
  nom: string;
  type: string;
  date: string;
  taille: string;
  url?: string;
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
  description?: string;
  date_debut?: string;
  date_fin?: string;
  statut: 'planifié' | 'en_cours' | 'terminé' | 'annulé';
  budget: number;
  taches: {
    id: string;
    titre: string;
    description?: string;
    statut: string;
    deadline: string;
    dateEchéance?: string;
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
  
  // New state for project management
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Projet | null>(null);
  const [newProject, setNewProject] = useState<Partial<Projet>>({
    nom: '',
    description: '',
    statut: 'planifié',
    budget: 0,
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: ''
  });
  const [newTask, setNewTask] = useState<Partial<ProjetTache>>({
    titre: '',
    description: '',
    statut: 'à_faire',
    dateEchéance: '',
    assignéÀ: ''
  });
  
  // New state for file management
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadArtist = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const artistData = await ArtistsService.getArtist(id);
        if (artistData) {
          setArtiste(artistData);
          
          // Load artist's projects
          loadProjects(id);
          
          // Load related events
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
          loadDocuments(id);
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

  const loadProjects = async (artistId: string) => {
    try {
      const projectsData = await ProjectsService.getProjectsByArtist(artistId);
      setProjets(projectsData);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects. Please try again later.');
    }
  };

  const loadDocuments = async (artistId: string) => {
    try {
      const filesData = await FilesService.getAllFiles();
      const artistFiles = filesData.filter((file: any) => 
        file.related_id === artistId && file.related_type === 'artist'
      );
      
      setDocuments(artistFiles.map((file: any) => ({
        id: file.id,
        nom: file.name,
        type: file.type,
        date: file.created_at,
        taille: `${Math.round(file.size / 1024)} KB`,
        url: file.url
      })));
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load documents. Please try again later.');
    }
  };

  const handleAddProject = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const projectData = {
        ...newProject,
        artiste_id: id,
        user_id: user.id
      };
      
      await ProjectsService.createProject(projectData as any);
      
      // Reload projects
      await loadProjects(id);
      
      // Close modal and reset form
      setIsProjectModalOpen(false);
      setNewProject({
        nom: '',
        description: '',
        statut: 'planifié',
        budget: 0,
        date_debut: new Date().toISOString().split('T')[0],
        date_fin: ''
      });
      
      // Switch to projects tab
      setActiveTab('projets');
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Failed to add project. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!selectedProject) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const taskData = {
        ...newTask,
        projet_id: selectedProject.id,
        user_id: user.id
      };
      
      await ProjectsService.createProjectTask(taskData);
      
      // Reload projects
      if (id) {
        await loadProjects(id);
      }
      
      // Close modal and reset form
      setIsTaskModalOpen(false);
      setNewTask({
        titre: '',
        description: '',
        statut: 'à_faire',
        dateEchéance: '',
        assignéÀ: ''
      });
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await ProjectsService.deleteProject(projectId);
      
      // Reload projects
      if (id) {
        await loadProjects(id);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await ProjectsService.deleteProjectTask(taskId);
      
      // Reload projects
      if (id) {
        await loadProjects(id);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !id) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('user_id', user.id);
      formData.append('related_id', id);
      formData.append('related_type', 'artist');
      
      // Simulate upload progress
      const simulateProgress = () => {
        setUploadProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      };
      
      const progressInterval = setInterval(simulateProgress, 300);
      
      // Upload file
      await FilesService.uploadFile(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reload documents
      await loadDocuments(id);
      
      // Close modal and reset state
      setTimeout(() => {
        setIsFileUploadModalOpen(false);
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
      
      // Switch to documents tab
      setActiveTab('documents');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again later.');
      setIsUploading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || doc.type.includes(fileTypeFilter);
    return matchesSearch && matchesType;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'planifié':
        return 'bg-blue-500';
      case 'en_cours':
        return 'bg-yellow-500';
      case 'terminé':
        return 'bg-green-500';
      case 'annulé':
        return 'bg-red-500';
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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return 'image';
    } else if (fileType.includes('pdf')) {
      return 'pdf';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return 'doc';
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return 'sheet';
    } else {
      return 'file';
    }
  };

  const openAddTaskModal = (project: Projet) => {
    setSelectedProject(project);
    setIsTaskModalOpen(true);
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
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>{artiste.email || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>{artiste.telephone || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>{artiste.adresse || "Non renseigné"}</span>
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
              <p className="text-2xl font-bold text-white">{artiste.evenementsPassés || 0}</p>
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
              <p className="text-2xl font-bold text-white">0 TND</p>
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Calendrier des événements</h2>
              <button 
                className="btn-primary flex items-center gap-2"
                onClick={() => setIsProjectModalOpen(true)}
              >
                <Plus className="h-5 w-5" />
                Nouveau projet
              </button>
            </div>
            <div className="card">
              <EventCalendar events={events} />
            </div>
          </div>
        )}

        {activeTab === 'projets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Projets</h2>
              <button 
                className="btn-primary flex items-center gap-2"
                onClick={() => setIsProjectModalOpen(true)}
              >
                <Plus className="h-5 w-5" />
                Nouveau projet
              </button>
            </div>
            
            <div className="space-y-4">
              {projets.length > 0 ? (
                projets.map((projet) => (
                  <div key={projet.id} className="card overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-700 pb-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{projet.nom}</h3>
                        <p className="text-gray-400">
                          {projet.date_debut && new Date(projet.date_debut).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                          {projet.date_fin && ` au ${new Date(projet.date_fin).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gold-400 font-semibold">
                          {projet.budget.toLocaleString('fr-FR')} TND
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(projet.statut)} text-white`}>
                          {projet.statut && projet.statut.toUpperCase()}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openAddTaskModal(projet)}
                            className="text-gray-400 hover:text-white p-1 bg-gray-700 rounded-full"
                            title="Ajouter une tâche"
                          >
                            <ListTodo className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(projet.id)}
                            className="text-gray-400 hover:text-red-500 p-1 bg-gray-700 rounded-full"
                            title="Supprimer le projet"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {projet.description && (
                      <p className="mt-2 text-gray-300 mb-4">{projet.description}</p>
                    )}
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <ListTodo className="h-4 w-4 text-gold-400" />
                          Tâches
                        </h4>
                        <button 
                          onClick={() => openAddTaskModal(projet)}
                          className="btn-secondary text-sm flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Ajouter une tâche
                        </button>
                      </div>
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {projet.taches && projet.taches.length > 0 ? (
                          projet.taches.map((tache) => {
                            const StatusIcon = getTaskStatusIcon(tache.statut);
                            return (
                              <div key={tache.id} className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg border-l-4 border-gold-400">
                                <div className="flex items-center gap-3">
                                  <StatusIcon className="h-5 w-5 text-gold-400" />
                                  <div>
                                    <div className="font-medium">{tache.titre}</div>
                                    {tache.description && (
                                      <div className="text-sm text-gray-400">{tache.description}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {tache.dateEchéance && (
                                    <div className="flex items-center gap-1 text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {new Date(tache.dateEchéance).toLocaleDateString('fr-FR')}
                                      </span>
                                    </div>
                                  )}
                                  <button
                                    onClick={() => handleDeleteTask(tache.id)}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                    title="Supprimer la tâche"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-gray-400 bg-gray-700/30 rounded-lg">
                            Aucune tâche pour ce projet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-400">Aucun projet trouvé</p>
                  <button 
                    onClick={() => setIsProjectModalOpen(true)}
                    className="mt-4 btn-secondary"
                  >
                    Créer un projet
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold">Documents</h2>
              <button 
                className="btn-primary flex items-center gap-2"
                onClick={() => setIsFileUploadModalOpen(true)}
              >
                <UploadCloud className="h-5 w-5" />
                Ajouter un document
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  className="input pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    className="input appearance-none pr-10 pl-4"
                    value={fileTypeFilter}
                    onChange={(e) => setFileTypeFilter(e.target.value)}
                  >
                    <option value="all">Tous les types</option>
                    <option value="image">Images</option>
                    <option value="pdf">PDF</option>
                    <option value="application">Documents</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="space-y-4">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded flex items-center justify-center ${
                          getFileIcon(doc.type) === 'image' ? 'bg-purple-600' :
                          getFileIcon(doc.type) === 'pdf' ? 'bg-red-600' :
                          getFileIcon(doc.type) === 'doc' ? 'bg-blue-600' :
                          getFileIcon(doc.type) === 'sheet' ? 'bg-green-600' :
                          'bg-gray-600'
                        }`}>
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.nom}</h4>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <Tag className="h-3 w-3 mr-1" />
                            <span className="mr-2">
                              {doc.type.split('/')[1] ? doc.type.split('/')[1].toUpperCase() : doc.type}
                            </span>
                            <Clock className="h-3 w-3 mr-1 ml-2" />
                            <span className="mr-2">
                              {new Date(doc.date).toLocaleDateString('fr-FR')}
                            </span>
                            <FileText className="h-3 w-3 mr-1 ml-2" />
                            <span>{doc.taille}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {doc.url && (
                          <a 
                            href={doc.url} 
                            download={doc.nom}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-400">Aucun document trouvé</p>
                    <button 
                      onClick={() => setIsFileUploadModalOpen(true)}
                      className="mt-4 btn-secondary"
                    >
                      Ajouter un document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Nouveau projet"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Nom du projet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input w-full"
              value={newProject.nom}
              onChange={(e) => setNewProject({ ...newProject, nom: e.target.value })}
              placeholder="Nom du projet"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              className="input w-full h-24"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Description du projet"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Date de début <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="input w-full"
                value={newProject.date_debut}
                onChange={(e) => setNewProject({ ...newProject, date_debut: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                className="input w-full"
                value={newProject.date_fin}
                onChange={(e) => setNewProject({ ...newProject, date_fin: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                className="input w-full"
                value={newProject.statut}
                onChange={(e) => setNewProject({ ...newProject, statut: e.target.value as any })}
              >
                <option value="planifié">Planifié</option>
                <option value="en_cours">En cours</option>
                <option value="terminé">Terminé</option>
                <option value="annulé">Annulé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Budget (TND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="input w-full"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsProjectModalOpen(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleAddProject}
              disabled={isLoading || !newProject.nom}
            >
              {isLoading ? 'Création...' : 'Créer le projet'}
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Nouvelle tâche"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Titre de la tâche <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input w-full"
              value={newTask.titre}
              onChange={(e) => setNewTask({ ...newTask, titre: e.target.value })}
              placeholder="Titre de la tâche"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              className="input w-full h-24"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Description de la tâche"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                className="input w-full"
                value={newTask.statut}
                onChange={(e) => setNewTask({ ...newTask, statut: e.target.value as any })}
              >
                <option value="à_faire">À faire</option>
                <option value="en_cours">En cours</option>
                <option value="terminé">Terminé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Date d'échéance
              </label>
              <input
                type="date"
                className="input w-full"
                value={newTask.dateEchéance}
                onChange={(e) => setNewTask({ ...newTask, dateEchéance: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Assigné à
            </label>
            <input
              type="text"
              className="input w-full"
              value={newTask.assignéÀ}
              onChange={(e) => setNewTask({ ...newTask, assignéÀ: e.target.value })}
              placeholder="Nom de la personne assignée"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsTaskModalOpen(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleAddTask}
              disabled={isLoading || !newTask.titre}
            >
              {isLoading ? 'Création...' : 'Ajouter la tâche'}
            </button>
          </div>
        </div>
      </Modal>

      {/* File Upload Modal */}
      <Modal
        isOpen={isFileUploadModalOpen}
        onClose={() => !isUploading && setIsFileUploadModalOpen(false)}
        title="Ajouter un document"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
            {selectedFile ? (
              <div className="space-y-2">
                <div className="bg-gray-700/50 p-3 rounded flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-gold-400 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  {!isUploading && (
                    <button 
                      onClick={() => setSelectedFile(null)} 
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Téléchargement en cours...' : 'Télécharger ce fichier'}
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-300 mb-2">Glissez-déposez vos fichiers ici ou</p>
                <div>
                  <label className="btn-secondary cursor-pointer">
                    <span>Parcourir</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">Taille maximale: 5MB</p>
              </>
            )}
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold-400" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-400">{uploadProgress}%</p>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsFileUploadModalOpen(false)}
              disabled={isUploading}
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ArtisteDetail;
