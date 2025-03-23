import { useEffect } from 'react';
import { useVisitors } from '../hooks/useVisitors';
import { PasswordProtection } from '../components/dashboard/PasswordProtection';
import { VisitorStats } from '../components/dashboard/VisitorStats';
import { VisitorTable } from '../components/dashboard/VisitorTable';
import { Button } from '../components/ui/button';
import { ArrowLeft, Download, Loader, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVisitorTracking } from '../hooks/useVisitorTracking';
import { Toaster } from "../components/ui/toaster";

export default function Statistics() {
  const { visitors, isLoading, error, refetch } = useVisitors();
  const navigate = useNavigate();
  
  // Track visits to the statistics page but skip actual tracking
  useVisitorTracking('statistique', true);

  useEffect(() => {
    // Set the document title
    document.title = 'Statistiques - Tazart';
  }, []);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    refetch();
  };

  const exportAllData = () => {
    if (!visitors.length) return;
    
    // Create CSV content
    const headers = ['ID', 'Page', 'Ville', 'Pays', 'IP', 'Date', 'Créé le'];
    const csvContent = [
      headers.join(','),
      ...visitors.map(visitor => {
        return [
          visitor.id,
          `"${visitor.page_visitors.replace(/"/g, '""')}"`,
          `"${visitor.city_visitors.replace(/"/g, '""')}"`,
          `"${visitor.country_visitors.replace(/"/g, '""')}"`,
          visitor.ip_visitors,
          new Date(visitor.date_visitors).toLocaleString('fr-FR'),
          new Date(visitor.created_at).toLocaleString('fr-FR')
        ].join(',');
      })
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tazart_statistiques_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
 
  };

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-800">Tableau de Bord</h1>
              <p className="text-gray-600">Statistiques des visiteurs et analyses</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={exportAllData} 
                variant="outline"
                className="flex items-center gap-2 border-[#96cc39] text-[#96cc39] hover:bg-[#96cc39] hover:text-white"
                disabled={isLoading || visitors.length === 0}
              >
                <Download className="h-4 w-4" />
                Exporter tout
              </Button>
              <Button 
                onClick={handleRefresh} 
                variant="outline"
                className="flex items-center gap-2 border-[#96cc39] text-[#96cc39] hover:bg-[#96cc39] hover:text-white"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button 
                onClick={handleBackToHome} 
                className="flex items-center gap-2 bg-[#96cc39] hover:bg-[#85b52f]"
              >
                <ArrowLeft className="h-4 w-4" />
                Retourner à l'accueil
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 text-[#96cc39] animate-spin" />
              <span className="ml-2 text-gray-700">Chargement des données...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <p>{error}</p>
              <p className="mt-2">Veuillez réessayer ultérieurement.</p>
            </div>
          ) : visitors.length === 0 ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
              <p>Aucune donnée de visiteur trouvée.</p>
              <p className="mt-2">Les statistiques apparaîtront ici une fois que des visiteurs auront consulté le site.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <VisitorStats visitors={visitors} />
              <VisitorTable visitors={visitors} />
            </div>
          )}
        </div>
        <Toaster />
      </div>
    </PasswordProtection>
  );
}
