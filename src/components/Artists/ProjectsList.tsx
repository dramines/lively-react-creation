
import { AlertCircle, Plus } from 'lucide-react';
import { Projet } from '../../types';
import ProjectItem from './ProjectItem';

interface ProjectsListProps {
  projets: Projet[];
  onAddProject: () => void;
  onAddTask: (project: Projet) => void;
  onDeleteProject: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const ProjectsList = ({ 
  projets, 
  onAddProject, 
  onAddTask, 
  onDeleteProject, 
  onDeleteTask 
}: ProjectsListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Projets</h2>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={onAddProject}
        >
          <Plus className="h-5 w-5" />
          Nouveau projet
        </button>
      </div>
      
      <div className="space-y-4">
        {projets.length > 0 ? (
          projets.map((projet) => (
            <ProjectItem 
              key={projet.id}
              projet={projet}
              onAddTask={onAddTask}
              onDeleteProject={onDeleteProject}
              onDeleteTask={onDeleteTask}
            />
          ))
        ) : (
          <div className="card flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">Aucun projet trouvé</p>
            <button 
              onClick={onAddProject}
              className="mt-4 btn-secondary"
            >
              Créer un projet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
