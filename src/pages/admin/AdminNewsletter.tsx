
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import { StatusFilter } from '@/components/admin/filters/StatusFilter';
import { useTableSort } from '@/hooks/useTableSort';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Search, 
  Filter, 
  Download,
  Mail,
  Users,
  Plus,
  Trash2
} from 'lucide-react';

interface NewsletterSubscriber {
  id_subscriber: number;
  email_subscriber: string;
  nom_subscriber?: string;
  prenom_subscriber?: string;
  status_subscriber: string;
  source_subscriber: string;
  date_inscription: string;
  date_unsubscribe?: string;
}

interface NewsletterStats {
  total_subscribers: number;
  active_subscribers: number;
  unsubscribed_count: number;
  today_subscribers: number;
  this_month_subscribers: number;
}

const AdminNewsletter = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'unsubscribed', label: 'Désabonné' },
    { value: 'bounced', label: 'Bounced' },
    { value: 'pending', label: 'En attente' }
  ];

  const fetchNewsletterData = async () => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/get_all_newsletter.php');
      const result = await response.json();
      
      if (result.success) {
        setSubscribers(result.data || []);
        setStats(result.stats);
      } else {
        throw new Error(result.message || 'Failed to fetch newsletter data');
      }
    } catch (error) {
      console.error('Error fetching newsletter data:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données newsletter',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriber = async (subscriberId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) {
      return;
    }

    try {
      const response = await fetch('https://draminesaid.com/lucci/api/delete_newsletter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: subscriberId
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Succès',
          description: 'Abonné supprimé avec succès'
        });
        fetchNewsletterData(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'abonné',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchNewsletterData();
  }, []);

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email_subscriber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscriber.status_subscriber === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { sortedData: sortedSubscribers, sortConfig, requestSort } = useTableSort(filteredSubscribers, 'date_inscription');

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Actif', variant: 'default' as const },
      unsubscribed: { label: 'Désabonné', variant: 'destructive' as const },
      bounced: { label: 'Bounced', variant: 'secondary' as const },
      pending: { label: 'En attente', variant: 'outline' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Chargement des abonnés...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-playfair font-bold text-gray-900">
                  Newsletter
                </h1>
                <p className="text-gray-600 mt-1">
                  Gestion des abonnés email
                </p>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">
                    Total Abonnés
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{stats.total_subscribers}</div>
                  <p className="text-xs text-blue-600">
                    Inscrits à la newsletter
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-900">
                    Abonnés Actifs
                  </CardTitle>
                  <Mail className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{stats.active_subscribers}</div>
                  <p className="text-xs text-green-600">
                    {stats.total_subscribers > 0 ? Math.round((stats.active_subscribers / stats.total_subscribers) * 100) : 0}% du total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">
                    Nouveaux ce Mois
                  </CardTitle>
                  <Plus className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{stats.this_month_subscribers}</div>
                  <p className="text-xs text-purple-600">
                    Nouvelles inscriptions
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subscribers Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle className="font-playfair text-gray-900">
                    Liste des Abonnés
                  </CardTitle>
                  <CardDescription>
                    Emails, dates d'inscription et statuts (cliquez sur les en-têtes pour trier)
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? 'bg-gray-100' : ''}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {showFilters && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <StatusFilter
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    options={statusOptions}
                    placeholder="Filtrer par statut"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTableHead 
                        sortKey="email_subscriber" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Email
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="date_inscription" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Date d'Inscription
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="source_subscriber" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Source
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="status_subscriber" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Statut
                      </SortableTableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id_subscriber}>
                        <TableCell className="font-medium">
                          {subscriber.email_subscriber}
                        </TableCell>
                        <TableCell>
                          {new Date(subscriber.date_inscription).toLocaleDateString('fr-FR')} à {new Date(subscriber.date_inscription).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell className="capitalize">
                          {subscriber.source_subscriber}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(subscriber.status_subscriber)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteSubscriber(subscriber.id_subscriber)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;
