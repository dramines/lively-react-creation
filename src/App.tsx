
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Artistes from './pages/Artistes';
import ArtisteDetail from './pages/ArtisteDetail';
import Evenements from './pages/Evenements';
import Taches from './pages/Taches';
import Finances from './pages/Finances';
import NouveauDevis from './pages/NouveauDevis';
import Reservations from './pages/Reservations';
import Parametres from './pages/Parametres';
import FileManager from './pages/FileManager';
import { AuthService } from './services';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = () => {
      const authStatus = AuthService.isAuthenticated();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Show simple loading state while checking authentication
  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="artistes" element={<Artistes />} />
          <Route path="artistes/:id" element={<ArtisteDetail />} />
          <Route path="evenements" element={<Evenements />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="taches" element={<Taches />} />
          <Route path="finances" element={<Finances />} />
          <Route path="finances/nouveau-devis" element={<NouveauDevis />} />
          <Route path="parametres" element={<Parametres />} />
          <Route path="fichiers" element={<FileManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
