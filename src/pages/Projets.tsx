import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectsList from '../components/ProjectsList';

const Projets = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projets</h1>
        <Link to="/projets/nouveau" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouveau projet
        </Link>
      </div>

      <ProjectsList />
    </div>
  );
};

export default Projets;
