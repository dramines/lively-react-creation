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
  MailOpen,
  MessageSquare,
  Eye,
  EyeOff
} from 'lucide-react';

interface Message {
  id_message: number;
  nom_client: string;
  email_client: string;
  telephone_client: string;
  message_client: string;
  vue_par_admin: number;
  date_vue_admin: string | null;
  date_creation: string;
}

interface MessageStats {
  total_messages: number;
  unread_messages: number;
  read_messages: number;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [vueFilter, setVueFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    per_page: 50,
    has_next: false,
    has_prev: false
  });
  const [stats, setStats] = useState<MessageStats | null>(null);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pagination.current_page),
        limit: String(pagination.per_page),
        search: searchTerm,
        vue_filter: vueFilter
      });

      const response = await fetch(`https://draminesaid.com/lucci/api/get_all_messages.php?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.data || []);
        setPagination(result.pagination);
        setStats({
          total_messages: result.pagination.total_records,
          unread_messages: result.data.filter((message: Message) => message.vue_par_admin === 0).length,
          read_messages: result.data.filter((message: Message) => message.vue_par_admin === 1).length
        });
      } else {
        throw new Error(result.message || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les messages',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/mark_message_as_read.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: messageId
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Succès',
          description: 'Message marqué comme lu'
        });
        fetchMessages(); // Refresh messages
      } else {
        throw new Error(result.message || 'Failed to mark message as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer le message comme lu',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [pagination.current_page, searchTerm, vueFilter]);

  const { sortedData: sortedMessages, sortConfig, requestSort } = useTableSort(messages, 'date_creation');

  const statusOptions = [
    { value: 'all', label: 'Tous' },
    { value: 'vue', label: 'Lus' },
    { value: 'not_vue', label: 'Non lus' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Chargement des messages...</p>
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
                  Messages
                </h1>
                <p className="text-gray-600 mt-1">
                  Messages de contact des clients
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Total Messages
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.total_messages || 0}</div>
                <p className="text-xs text-white/70">
                  Tous les messages
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Messages Non Lus
                </CardTitle>
                <Mail className="h-4 w-4 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.unread_messages || 0}</div>
                <p className="text-xs text-white/70">
                  À traiter
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Messages Lus
                </CardTitle>
                <MailOpen className="h-4 w-4 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.read_messages || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Messages Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle className="font-playfair text-gray-900">
                    Liste des Messages
                  </CardTitle>
                  <CardDescription>
                    Messages de contact des clients (cliquez sur les en-têtes pour trier)
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un message..."
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
                    value={vueFilter}
                    onValueChange={setVueFilter}
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
                        sortKey="nom_client" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Client
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="email_client" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Contact
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="date_creation" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Date
                      </SortableTableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMessages.map((message) => (
                      <TableRow key={message.id_message}>
                        <TableCell className="font-medium">
                          {message.nom_client}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="mr-2 h-3 w-3 text-gray-400" />
                              {message.email_client}
                            </div>
                            <div className="flex items-center text-sm">
                              {message.telephone_client}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(message.date_creation).toLocaleDateString('fr-FR')} à {new Date(message.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMarkAsRead(message.id_message)}
                          >
                            {message.vue_par_admin ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
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

export default AdminMessages;
