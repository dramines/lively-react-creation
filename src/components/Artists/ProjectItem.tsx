
import { Calendar, ListTodo, Trash2 } from 'lucide-react';
import { Projet } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ProjectItemProps {
  projet: Projet;
  onAddTask: (project: Projet) => void;
  onDeleteProject: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const ProjectItem = ({ projet, onAddTask, onDeleteProject, onDeleteTask }: ProjectItemProps) => {
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
        return <Calendar className="h-5 w-5 text-gold-400" />;
      case 'en_cours':
        return <Clock className="h-5 w-5 text-gold-400" />;
      case 'terminé':
        return <CheckCircle2 className="h-5 w-5 text-gold-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gold-400" />;
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-700 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold">{projet.nom}</h3>
          <p className="text-gray-400">
            {projet.date_debut && formatDate(projet.date_debut)}
            {projet.date_fin && ` au ${formatDate(projet.date_fin)}`}
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
              onClick={() => onAddTask(projet)}
              className="text-gray-400 hover:text-white p-1 bg-gray-700 rounded-full"
              title="Ajouter une tâche"
            >
              <ListTodo className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDeleteProject(projet.id)}
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
            onClick={() => onAddTask(projet)}
            className="btn-secondary text-sm flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Ajouter une tâche
          </button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {projet.taches && projet.taches.length > 0 ? (
            projet.taches.map((tache) => (
              <TaskItem 
                key={tache.id} 
                tache={tache} 
                onDeleteTask={onDeleteTask} 
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-400 bg-gray-700/30 rounded-lg">
              Aucune tâche pour ce projet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { AlertCircle, CheckCircle2, Clock, Plus } from 'lucide-react';

interface TaskItemProps {
  tache: any;
  onDeleteTask: (id: string) => void;
}

const TaskItem = ({ tache, onDeleteTask }: TaskItemProps) => {
  return (
    <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg border-l-4 border-gold-400">
      <div className="flex items-center gap-3">
        {getTaskStatusIcon(tache.statut)}
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
          onClick={() => onDeleteTask(tache.id)}
          className="text-gray-400 hover:text-red-500 p-1"
          title="Supprimer la tâche"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProjectItem;
