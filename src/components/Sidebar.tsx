import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  CheckSquare, 
  DollarSign,
  Settings as SettingsIcon,
  FolderOpen,
  X,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { 
    icon: Home, 
    label: 'Tableau de bord', 
    path: '/',
    description: 'Vue d\'ensemble de l\'activité'
  },
  { 
    icon: Calendar, 
    label: 'Événements', 
    path: '/evenements',
    description: 'Gestion des événements'
  },
  { 
    icon: Users, 
    label: 'Artistes', 
    path: '/artistes',
    description: 'Liste des artistes'
  },
  { 
    icon: CheckSquare, 
    label: 'Tâches', 
    path: '/taches',
    description: 'Suivi des tâches'
  },
  { 
    icon: DollarSign, 
    label: 'Finances', 
    path: '/finances',
    description: 'Gestion financière'
  },
  { 
    icon: FolderOpen, 
    label: 'Fichiers', 
    path: '/fichiers',
    description: 'Gestion documentaire'
  },
  { 
    icon: SettingsIcon, 
    label: 'Paramètres', 
    path: '/parametres',
    description: 'Configuration'
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div
        className={`
          fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] z-50 
          w-72 bg-gray-800 transform transition-transform duration-300 ease-in-out
          lg:transform-none border-r border-gray-700/50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-700/50 lg:hidden">
            <div className="flex items-center justify-end">
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) => {
                  return `flex items-center p-3 rounded-lg transition-colors group relative ${
                    isActive
                      ? 'bg-gray-700 text-gold-400'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`;
                }}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3 flex-1">{item.label}</span>
                    <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isActive ? 'text-gold-400' : 'text-gray-400'
                    }`} />
                    <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700/50">
            <div className="text-center text-sm text-gray-400">
              <p>Version 1.0.0</p>
              <p className="mt-1">Développé par <a href="https://github.com/ihebchebbi1" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors">Iheb Chebbi</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;