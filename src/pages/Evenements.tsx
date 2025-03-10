import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar as CalendarIcon, Users, DollarSign, Plus, Upload, Image as ImageIcon, X, Edit, Trash } from 'lucide-react';
import Calendar from '../components/Calendar/Calendar';
import Modal from '../components/Modal';
import { Evenement } from '../types';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';
import { useLocation, useNavigate } from 'react-router-dom';

const EventCard = ({ evenement, onEdit, onDelete }: { evenement: Evenement; onEdit: (event: Evenement) => void; onDelete: (id: string) => void }) => {
  const statusColors = {
    planifié: 'bg-blue-500',
    en_cours: 'bg-yellow-500',
    terminé: 'bg-green-500'
  };

  return (
    <div className="card hover:border-gold-500/50 transition-colors">
      <div className="flex flex-col md:flex-row gap-6">
        {evenement.photo && (
          <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden">
            <img 
              src={evenement.photo} 
              alt={evenement.titre}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{evenement.titre}</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{new Date(evenement.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{evenement.lieu}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign className="h-4 w-4" />
                  <span>{evenement.budget.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
              <p className="mt-2 text-gray-400">{evenement.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[evenement.statut]} text-white`}>
                {evenement.statut.toUpperCase()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(evenement)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(evenement.id)}
                  className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-700"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Users className="h-4 w-4 text-gold-400" />
            <div className="flex gap-2">
              {evenement.artistes.map((artiste, index) => (
                <span key={index} className="text-sm bg-gray-700 px-2 py-1 rounded">
                  {artiste}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Evenements = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [editingEvent, setEditingEvent] = useState<Evenement | null>(null);
  const [newEvent, setNewEvent] = useState({
    titre: '',
    description: '',
    date: '',
    budget: '',
    placesDisponibles: '',
    lieu: '',
    pays: '',
    ville: '',
    latitude: '',
    longitude: '',
    contactNom: '',
    contactEmail: '',
    contactTelephone: '',
    photo: '',
    artistes: [] as string[]
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const storedEvents = getFromLocalStorage<Evenement[]>('evenements', []);
    setEvenements(storedEvents);

    // Check if there's a selected date from navigation
    const selectedDate = location.state?.selectedDate;
    if (selectedDate) {
      setNewEvent(prev => ({
        ...prev,
        date: new Date(selectedDate).toISOString().split('T')[0]
      }));
      setIsModalOpen(true);
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const events = evenements.map(evt => ({
    id: evt.id,
    title: evt.titre,
    date: new Date(evt.date),
    type: 'event'
  }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setNewEvent({ ...newEvent, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData: Evenement = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      titre: newEvent.titre,
      date: newEvent.date,
      lieu: newEvent.lieu,
      budget: parseFloat(newEvent.budget) || 0,
      statut: 'planifié',
      artistes: newEvent.artistes.length > 0 ? newEvent.artistes : ['Artiste non spécifié'],
      photo: previewImage || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
      description: newEvent.description,
      placesDisponibles: parseInt(newEvent.placesDisponibles) || 0,
      contactNom: newEvent.contactNom,
      contactEmail: newEvent.contactEmail,
      contactTelephone: newEvent.contactTelephone,
      pays: newEvent.pays,
      ville: newEvent.ville,
      latitude: parseFloat(newEvent.latitude) || 0,
      longitude: parseFloat(newEvent.longitude) || 0
    };

    if (editingEvent) {
      setEvenements(evenements.map(evt => evt.id === editingEvent.id ? eventData : evt));
    } else {
      setEvenements([...evenements, eventData]);
    }
    
    saveToLocalStorage('evenements', editingEvent ? 
      evenements.map(evt => evt.id === editingEvent.id ? eventData : evt) :
      [...evenements, eventData]
    );
    
    handleCloseModal();
  };

  const handleEdit = (event: Evenement) => {
    setEditingEvent(event);
    setNewEvent({
      titre: event.titre,
      description: event.description || '',
      date: event.date,
      budget: event.budget.toString(),
      placesDisponibles: event.placesDisponibles?.toString() || '',
      lieu: event.lieu,
      pays: event.pays || '',
      ville: event.ville || '',
      latitude: event.latitude?.toString() || '',
      longitude: event.longitude?.toString() || '',
      contactNom: event.contactNom || '',
      contactEmail: event.contactEmail || '',
      contactTelephone: event.contactTelephone || '',
      photo: event.photo || '',
      artistes: event.artistes
    });
    setPreviewImage(event.photo);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedEvents = evenements.filter(evt => evt.id !== id);
    setEvenements(updatedEvents);
    saveToLocalStorage('evenements', updatedEvents);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setNewEvent({
      titre: '',
      description: '',
      date: '',
      budget: '',
      placesDisponibles: '',
      lieu: '',
      pays: '',
      ville: '',
      latitude: '',
      longitude: '',
      contactNom: '',
      contactEmail: '',
      contactTelephone: '',
      photo: '',
      artistes: []
    });
    setPreviewImage(null);
  };

  const handleCalendarAddEvent = (date: Date) => {
    setNewEvent(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }));
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Événements</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Nouvel événement
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Calendrier</h2>
          <Calendar 
            events={events} 
            onAddEvent={handleCalendarAddEvent}
            onAddTask={() => navigate('/taches')}
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Liste des événements</h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {evenements.length > 0 ? (
              evenements.map(evenement => (
                <EventCard 
                  key={evenement.id} 
                  evenement={evenement} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-gray-400">Aucun événement trouvé</p>
            )}
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? "Modifier l'événement" : "Nouvel événement"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Photo de l'événement
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
                      onClick={() => {
                        setPreviewImage(null);
                        setNewEvent({ ...newEvent, photo: '' });
                      }}
                      className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full text-white hover:bg-gray-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Titre
              </label>
              <input
                type="text"
                className="input w-full"
                value={newEvent.titre}
                onChange={(e) => setNewEvent({ ...newEvent, titre: e.target.value })}
                placeholder="Titre de l'événement"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                className="input w-full h-24"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Description de l'événement"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Date
              </label>
              <input
                type="date"
                className="input w-full"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Budget (€)
              </label>
              <input
                type="number"
                className="input w-full"
                value={newEvent.budget}
                onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Places disponibles
              </label>
              <input
                type="number"
                className="input w-full"
                value={newEvent.placesDisponibles}
                onChange={(e) => setNewEvent({ ...newEvent, placesDisponibles: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Lieu
              </label>
              <input
                type="text"
                className="input w-full"
                value={newEvent.lieu}
                onChange={(e) => setNewEvent({ ...newEvent, lieu: e.target.value })}
                placeholder="Nom du lieu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Pays
              </label>
              <input
                type="text"
                className="input w-full"
                value={newEvent.pays}
                onChange={(e) => setNewEvent({ ...newEvent, pays: e.target.value })}
                placeholder="Pays"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Ville
              </label>
              <input
                type="text"
                className="input w-full"
                value={newEvent.ville}
                onChange={(e) => setNewEvent({ ...newEvent, ville: e.target.value })}
                placeholder="Ville"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Artistes
              </label>
              <input
                type="text"
                className="input w-full"
                value={newEvent.artistes.join(', ')}
                onChange={(e) => setNewEvent({ 
                  ...newEvent, 
                  artistes: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                })}
                placeholder="Noms des artistes (séparés par des virgules)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nom du contact
              </label>
              <input
                type="text"
                className="input w-full"
                value={newEvent.contactNom}
                onChange={(e) => setNewEvent({ ...newEvent, contactNom: e.target.value })}
                placeholder="Nom du contact"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email du contact
              </label>
              <input
                type="email"
                className="input w-full"
                value={newEvent.contactEmail}
                onChange={(e) => setNewEvent({ ...newEvent, contactEmail: e.target.value })}
                placeholder="email@exemple.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Téléphone du contact
              </label>
              <input
                type="tel"
                className="input w-full"
                value={newEvent.contactTelephone}
                onChange={(e) => setNewEvent({ ...newEvent, contactTelephone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Latitude
              </label>
              <input
                type="text"
                className="input w-full"
                value={newEvent.latitude}
                onChange={(e) => setNewEvent({ ...newEvent, latitude: e.target.value })}
                placeholder="48.8566"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Longitude
              </label>
              <input
                type="text"
                className="input w-full"
                value={newEvent.longitude}
                onChange={(e) => setNewEvent({ ...newEvent, longitude: e.target.value })}
                placeholder="2.3522"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCloseModal}
            >
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              {editingEvent ? "Mettre à jour" : "Créer l'événement"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Evenements;