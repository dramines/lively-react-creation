
import Modal from '../../Modal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTask: any;
  setNewTask: (task: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const TaskModal = ({ 
  isOpen, 
  onClose, 
  newTask, 
  setNewTask, 
  onSubmit, 
  isLoading 
}: TaskModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onSubmit}
            disabled={isLoading || !newTask.titre}
          >
            {isLoading ? 'Création...' : 'Ajouter la tâche'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
