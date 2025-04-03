
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { LockKeyhole } from 'lucide-react';

const CORRECT_PASSWORD = 'tazart2025';
const LOCAL_STORAGE_KEY = 'dashboardAuth';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const storedAuth = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 animate-fade-in">
        <div className="text-center mb-6">
          <div className="mx-auto bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <LockKeyhole className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-gray-800">Accès Sécurisé</h2>
          <p className="text-gray-600 mt-2">Veuillez entrer le mot de passe pour accéder aux statistiques</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#96cc39] hover:bg-[#85b52f] text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Accéder au Tableau de Bord
          </Button>
        </form>
      </div>
    </div>
  );
}
