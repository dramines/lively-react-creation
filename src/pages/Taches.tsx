
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Clock, AlertCircle, Save, Check, Trash } from 'lucide-react';
import Modal from '../components/Modal';
import { TasksService } from '../services';
import { Tache } from '../types';

const TaskCard = ({ task, onToggleStatus, onDelete }: { task: Tache; onToggleStatus: (id: string) => void; onDelete: (id: string) => void }) => {
  const priorityColors = {
    basse: 'bg-blue-500',
    moyenne: 'bg-yellow-500',
    haute: 'bg-red-500'
  };

  const statusIcons = {
    'à_faire': Circle,
    'en_cours': Clock,
    'terminé': CheckCircle2
  };

  // Get the status icon component
  const StatusIcon = statusIcons[task.statut] || Circle;

  return (
    <div className="card hover:border-gold-500/50 transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onToggleStatus(task.id)}
              className={`p-1 rounded-full transition-colors ${
                task.statut === 'terminé' 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'text-gold-400 hover:bg-gray-700'
              }`}
            >
              <StatusIcon className="h-5 w-5" />
            </button>
            <h3 className={`text-lg font-semibold ${task.statut === 'terminé' ? 'line-through text-gray-500' : ''}`}>
              {task.titre}
            </h3>
          </div>
          <p className={`text-gray-400 mt-2 ${task.statut === 'terminé' ? 'line-through' : ''}`}>
            {task.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Assigné à: {task.assignéÀ}
            </span>
            <span className="text-sm text-gray-400">
              Échéance: {new Date(task.dateEchéance).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priorite]} text-white`}>
            {task.priorite.toUpperCase()}
          </span>
          <span className="text-sm text-gray-400">
            {task.statut.replace('_', ' ').toUpperCase()}
          </span>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Taches = () => {
  const [filter, setFilter] = useState<'all' | 'à_faire' | 'en_cours' | 'terminé'>('all');
  const [tasks, setTasks] = useState<Tache[]>([]);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Tache>>({
    titre: '',
    description: '',
    priorite: 'moyenne',
    statut: 'à_faire',
    assignéÀ: '',
    dateEchéance: new Date().toISOString().split('T')[0]
  });
  const [saveNotification, setSaveNotification] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Loading tasks for user ID:', user.id);
      const fetchedTasks = await TasksService.getAllTasks(user.id);
      console.log('Fetched tasks:', fetchedTasks);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const task = {
      ...newTask,
      user_id: user.id
    };
    
    setIsLoading(true);
    try {
      console.log('Adding task with data:', task);
      await TasksService.createTask(task);
      await loadTasks();
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 2000);
      
      setIsNewTaskModalOpen(false);
      setNewTask({
        titre: '',
        description: '',
        priorite: 'moyenne',
        statut: 'à_faire',
        assignéÀ: '',
        dateEchéance: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    let newStatus: 'à_faire' | 'en_cours' | 'terminé';
    
    if (taskToUpdate.statut === 'à_faire') {
      newStatus = 'en_cours';
    } else if (taskToUpdate.statut === 'en_cours') {
      newStatus = 'terminé';
    } else {
      newStatus = 'à_faire';
    }
    
    const updatedTask = { ...taskToUpdate, statut: newStatus };
    
    try {
      await TasksService.updateTask(updatedTask);
      await loadTasks();
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 2000);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TasksService.deleteTask(taskId);
      await loadTasks();
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 2000);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.statut === filter);

  return (
    <div className="space-y-6 relative">
      {/* Save notification */}
      {saveNotification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
        >
          <Check className="h-5 w-5" />
          <span>Tâches sauvegardées</span>
        </motion.div>
      )}

      {/* Error notification */}
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
        <h1 className="text-3xl font-bold text-white">Tâches</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setIsNewTaskModalOpen(true)}
          disabled={isLoading}
        >
          <Plus className="h-5 w-5" />
          Nouvelle tâche
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`btn-secondary ${filter === 'all' ? 'bg-gray-600' : ''}`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('à_faire')}
          className={`btn-secondary ${filter === 'à_faire' ? 'bg-gray-600' : ''}`}
        >
          À faire
        </button>
        <button
          onClick={() => setFilter('en_cours')}
          className={`btn-secondary ${filter === 'en_cours' ? 'bg-gray-600' : ''}`}
        >
          En cours
        </button>
        <button
          onClick={() => setFilter('terminé')}
          className={`btn-secondary ${filter === 'terminé' ? 'bg-gray-600' : ''}`}
        >
          Terminé
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4"
      >
        {isLoading ? (
          <div className="card flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
            <p className="text-gray-400 mt-4">Chargement des tâches...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">Aucune tâche trouvée</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggleStatus={toggleTaskStatus}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </motion.div>

      {/* New Task Modal */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Nouvelle tâche"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Titre
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
              className="input w-full h-24 resize-none"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Description de la tâche"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Priorité
              </label>
              <select
                className="input w-full"
                value={newTask.priorite}
                onChange={(e) => setNewTask({ ...newTask, priorite: e.target.value as "basse" | "moyenne" | "haute" })}
              >
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
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
                placeholder="Nom de la personne"
              />
            </div>
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
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="btn-secondary"
              onClick={() => setIsNewTaskModalOpen(false)}
            >
              Annuler
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleAddTask}
            >
              <Save className="h-4 w-4" />
              Créer la tâche
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Taches;
