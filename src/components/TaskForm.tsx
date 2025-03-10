
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ProjectTasksService } from '../services';

interface TaskFormProps {
  projectId: string;
  onSuccess: (task: any) => void;
  onCancel: () => void;
  existingTask?: any;
}

const TaskForm = ({ projectId, onSuccess, onCancel, existingTask }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    id: existingTask?.id || '',
    title: existingTask?.title || '',
    description: existingTask?.description || '',
    status: existingTask?.status || 'à_faire',
    assigned_to: existingTask?.assigned_to || '',
    deadline: existingTask?.deadline ? new Date(existingTask.deadline).toISOString().split('T')[0] : '',
    project_id: projectId
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
      if (!formData.title.trim()) {
        toast.error('Le titre de la tâche est requis');
        setIsSubmitting(false);
        return;
      }
      
      let result;
      if (existingTask) {
        result = await ProjectTasksService.updateTask(formData);
        toast.success('Tâche mise à jour avec succès');
      } else {
        result = await ProjectTasksService.createTask(formData);
        toast.success('Tâche créée avec succès');
      }
      
      onSuccess(result);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(existingTask 
        ? 'Erreur lors de la mise à jour de la tâche' 
        : 'Erreur lors de la création de la tâche');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
          Titre *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
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
            <option value="à_faire">À faire</option>
            <option value="en_cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-1">
            Date d'échéance
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-300 mb-1">
          Assigné à
        </label>
        <input
          type="text"
          id="assigned_to"
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleChange}
          placeholder="Nom de la personne assignée"
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
          {existingTask ? 'Mettre à jour' : 'Créer la tâche'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
