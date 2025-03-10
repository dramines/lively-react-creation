
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ProjectsService } from '../services';

interface ProjectFormProps {
  artistId: string;
  onSuccess: (project: any) => void;
  onCancel: () => void;
  existingProject?: any;
}

const ProjectForm = ({ artistId, onSuccess, onCancel, existingProject }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    id: existingProject?.id || '',
    name: existingProject?.name || '',
    description: existingProject?.description || '',
    status: existingProject?.status || 'planifié',
    start_date: existingProject?.start_date || new Date().toISOString().split('T')[0],
    end_date: existingProject?.end_date || '',
    budget: existingProject?.budget || 0,
    artist_id: artistId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.name.trim()) {
        toast.error('Le nom du projet est requis');
        setIsSubmitting(false);
        return;
      }
      
      let result;
      if (existingProject) {
        result = await ProjectsService.updateProject(formData);
        toast.success('Projet mis à jour avec succès');
      } else {
        result = await ProjectsService.createProject(formData);
        toast.success('Projet créé avec succès');
      }
      
      onSuccess(result);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(existingProject 
        ? 'Erreur lors de la mise à jour du projet' 
        : 'Erreur lors de la création du projet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Nom du projet *
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-300 mb-1">
            Date de début
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-300 mb-1">
            Date de fin (optionnelle)
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
            Statut
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="planifié">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="terminé">Terminé</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">
            Budget (€)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
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
          {existingProject ? 'Mettre à jour' : 'Créer le projet'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
