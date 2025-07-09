
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, UserPlus, Mail, Calendar, Trash2, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Newsletter {
  id_newsletter: number;
  email_newsletter: string;
  date_creation_newsletter: string;
  status_newsletter: 'active' | 'inactive';
}

const AdminNewsletter = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const response = await fetch('https://www.draminesaid.com/luccy/api/get_all_newsletter.php');
      const data = await response.json();
      
      if (data.success) {
        setNewsletters(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des newsletters:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les newsletters",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('https://www.draminesaid.com/luccy/api/delete_newsletter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_newsletter: id }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewsletters(newsletters.filter(n => n.id_newsletter !== id));
        toast({
          title: "Succès",
          description: "Newsletter supprimée avec succès",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la newsletter",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch('https://www.draminesaid.com/luccy/api/update_newsletter_status.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_newsletter: id, status_newsletter: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewsletters(newsletters.map(n => 
          n.id_newsletter === id ? { ...n, status_newsletter: newStatus } : n
        ));
        toast({
          title: "Succès",
          description: "Statut mis à jour avec succès",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const filteredNewsletters = newsletters.filter(newsletter =>
    newsletter.email_newsletter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSubscribers = newsletters.filter(n => n.status_newsletter === 'active').length;
  const inactiveSubscribers = newsletters.filter(n => n.status_newsletter === 'inactive').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Newsletter
          </h1>
          <p className="text-gray-600 text-lg mt-1">
            Gérez vos abonnés newsletter ({newsletters.length} abonnés)
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un abonné
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Abonnés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{newsletters.length}</div>
            <div className="flex items-center mt-2">
              <Mail className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-blue-600">Tous les abonnés</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">{activeSubscribers}</div>
            <div className="flex items-center mt-2">
              <Eye className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">Abonnés actifs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Inactifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800">{inactiveSubscribers}</div>
            <div className="flex items-center mt-2">
              <EyeOff className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm text-red-600">Abonnés inactifs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Taux d'engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {newsletters.length > 0 ? Math.round((activeSubscribers / newsletters.length) * 100) : 0}%
            </div>
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 text-purple-600 mr-1" />
              <span className="text-sm text-purple-600">Engagement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-xl font-semibold text-gray-900">Liste des abonnés</CardTitle>
          <CardDescription className="text-gray-600">
            Tous vos abonnés newsletter avec leurs informations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Rechercher par email..." 
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2 border-gray-200 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filtrer</span>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Chargement des abonnés...</p>
            </div>
          ) : filteredNewsletters.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun abonné trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Date d'inscription</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Statut</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNewsletters.map((newsletter) => (
                    <tr key={newsletter.id_newsletter} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {newsletter.email_newsletter.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{newsletter.email_newsletter}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(newsletter.date_creation_newsletter).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={newsletter.status_newsletter === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                          }
                          variant="outline"
                        >
                          {newsletter.status_newsletter === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(
                              newsletter.id_newsletter, 
                              newsletter.status_newsletter === 'active' ? 'inactive' : 'active'
                            )}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            {newsletter.status_newsletter === 'active' ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(newsletter.id_newsletter)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewsletter;
