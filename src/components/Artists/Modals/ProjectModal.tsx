
import Modal from '../../Modal';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  newProject: any;
  setNewProject: (project: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  newProject, 
  setNewProject, 
  onSubmit, 
  isLoading 
}: ProjectModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onSubmit}
            disabled={isLoading || !newProject.nom}
          >
            {isLoading ? 'Création...' : 'Créer le projet'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectModal;
