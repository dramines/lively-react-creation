import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('demoLogin') === 'vilart' ? 'Iheb Chebbi' : 'Iheb Chebbi';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('demoLogin');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <img
            src="https://i.ibb.co/JRtvDcgK/image-removebg-preview-3.png"
            alt="Vilart Production"
            className="h-12 w-auto" // Increased from h-11 to h-12 (approximately 5% increase)
          />
        </div>

        <div className="relative group ml-auto">
          <button className="flex items-center text-gray-300 hover:text-white gap-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-gray-900 font-bold text-lg">
              {userName.charAt(0)}
            </div>
            <span className="font-medium hidden sm:inline">{userName}</span>
            <ChevronDown className="h-4 w-4 hidden sm:block" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 hidden group-hover:block border border-gray-700">
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="font-medium text-white">{userName}</p>
              <p className="text-sm text-gray-400">Administrateur</p>
            </div>
            <button
              onClick={() => navigate('/parametres')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Paramètres du compte
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;