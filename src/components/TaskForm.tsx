
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, AlertCircle } from 'lucide-react';
import { UsersService, UserResponse } from '../services/users.service';

interface TaskFormProps {
  initialTask?: {
    id?: string;
    title: string;
    description: string;
    status: 'à_faire' | 'en_cours' | 'terminé';
    deadline: string;
    assigned_to: string;
    project_id?: string;
  };
  onSubmit: (taskData: any) => void;
  onCancel: () => void;
  projectId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialTask = {
    title: '',
    description: '',
    status: 'à_faire',
    deadline: new Date().toISOString().split('T')[0],
    assigned_to: '',
  },
  onSubmit,
  onCancel,
  projectId,
}) => {
  const [task, setTask] = useState(initialTask);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const fetchedUsers = await UsersService.getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    loadUsers();
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!task.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!task.deadline) {
      newErrors.deadline = 'La date d\'échéance est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const taskData = {
      ...task,
      project_id: projectId || task.project_id,
    };
    
    onSubmit(taskData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
          value={task.title}
          onChange={handleChange}
          placeholder="Titre de la tâche"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.title}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Description
        </label>
        <textarea
          name="description"
          className="input w-full h-24 resize-none"
          value={task.description}
          onChange={handleChange}
          placeholder="Description de la tâche"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Statut
          </label>
          <select
            name="status"
            className="input w-full"
            value={task.status}
            onChange={handleChange}
          >
            <option value="à_faire">À faire</option>
            <option value="en_cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Assigné à
          </label>
          <select
            name="assigned_to"
            className="input w-full"
            value={task.assigned_to}
            onChange={handleChange}
            disabled={isLoadingUsers}
          >
            <option value="">Sélectionner un utilisateur</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.full_name}</option>
            ))}
          </select>
          {isLoadingUsers && (
            <p className="mt-1 text-sm text-gray-400">Chargement des utilisateurs...</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Date d'échéance <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="deadline"
          className={`input w-full ${errors.deadline ? 'border-red-500' : ''}`}
          value={task.deadline}
          onChange={handleChange}
        />
        {errors.deadline && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.deadline}
          </p>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          className="btn-secondary flex items-center gap-2"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
          Annuler
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Enregistrer
        </button>
      </div>
    </motion.form>
  );
};

export default TaskForm;
