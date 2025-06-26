import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Eye, Search, Mail, Phone, User, Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id_message: string | number;
  nom_client: string;
  email_client: string;
  telephone_client: string;
  message_client: string;
  vue_par_admin: string | number;
  date_vue_admin: string | null;
  date_creation: string;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_records: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

const AdminMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [vueFilter, setVueFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMessages = async () => {
    console.log('Fetching messages...');
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        vue_filter: vueFilter
      });

      const url = `https://draminesaid.com/lucci/api/get_all_messages.php?${params}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        console.log('Messages data:', result.data);
        setMessages(result.data || []);
        setPagination(result.pagination);
      } else {
        console.error('API Error:', result.message);
        throw new Error(result.message || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les messages',
        variant: 'destructive'
      });
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = async (messageId: string | number) => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/update_message_vue.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_message: messageId
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id_message === messageId
              ? { ...msg, vue_par_admin: "1", date_vue_admin: new Date().toISOString() }
              : msg
          )
        );
        
        if (selectedMessage && selectedMessage.id_message === messageId) {
          setSelectedMessage(prev => prev ? { ...prev, vue_par_admin: "1", date_vue_admin: new Date().toISOString() } : null);
        }
        
        toast({
          title: 'Succès',
          description: 'Message marqué comme lu'
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error marking message as viewed:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer le message comme lu',
        variant: 'destructive'
      });
    }
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    
    if (message.vue_par_admin === "0" || message.vue_par_admin === 0) {
      markAsViewed(message.id_message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, searchTerm, vueFilter]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setVueFilter(value);
    setCurrentPage(1);
  };

  const getStatusBadge = (vue: string | number) => {
    const isViewed = vue === "1" || vue === 1;
    return isViewed ? (
      <Badge variant="secondary">Lu</Badge>
    ) : (
      <Badge variant="destructive">Non lu</Badge>
    );
  };

  const isMessageViewed = (vue: string | number) => {
    return vue === "1" || vue === 1;
  };

  console.log('Current messages state:', messages);
  console.log('Loading state:', loading);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-playfair font-bold" style={{ color: '#212937' }}>
                  <MessageSquare className="mr-3 h-8 w-8 inline" style={{ color: '#212937' }} />
                  Messages
                </h1>
                <p className="text-gray-600 mt-2">
                  Gérez les messages des clients LUCCI BY E.Y
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Dernière mise à jour</div>
                  <div className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card style={{ backgroundColor: '#212937' }} className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Messages</CardTitle>
                <MessageSquare className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{pagination?.total_records || messages.length}</div>
                <p className="text-xs text-gray-300">Tous les messages</p>
              </CardContent>
            </Card>
            
            <Card style={{ backgroundColor: '#212937' }} className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Messages Non Lus</CardTitle>
                <Eye className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {messages.filter(msg => !isMessageViewed(msg.vue_par_admin)).length}
                </div>
                <p className="text-xs text-gray-300">À traiter</p>
              </CardContent>
            </Card>
            
            <Card style={{ backgroundColor: '#212937' }} className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Messages Lus</CardTitle>
                <Eye className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {messages.filter(msg => isMessageViewed(msg.vue_par_admin)).length}
                </div>
                <p className="text-xs text-gray-300">Traités</p>
              </CardContent>
            </Card>
          </div>

          {/* Messages Table */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-playfair" style={{ color: '#212937' }}>
                <MessageSquare className="mr-2 h-5 w-5 inline" style={{ color: '#212937' }} />
                Messages des Clients
              </CardTitle>
              <CardDescription>
                Liste de tous les messages des clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, email ou message..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-8 border"
                      style={{ borderColor: '#212937' }}
                    />
                  </div>
                </div>
                <Select value={vueFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-[180px] border" style={{ borderColor: '#212937' }}>
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="not_vue">Non lus</SelectItem>
                    <SelectItem value="vue">Lus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border" style={{ borderColor: '#212937' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ color: '#212937' }}>Statut</TableHead>
                      <TableHead style={{ color: '#212937' }}>Client</TableHead>
                      <TableHead style={{ color: '#212937' }}>Email</TableHead>
                      <TableHead style={{ color: '#212937' }}>Téléphone</TableHead>
                      <TableHead style={{ color: '#212937' }}>Message</TableHead>
                      <TableHead style={{ color: '#212937' }}>Date</TableHead>
                      <TableHead style={{ color: '#212937' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Chargement...
                        </TableCell>
                      </TableRow>
                    ) : messages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Aucun message trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      messages.map((message) => (
                        <TableRow key={message.id_message}>
                          <TableCell>
                            {getStatusBadge(message.vue_par_admin)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {message.nom_client}
                          </TableCell>
                          <TableCell>{message.email_client}</TableCell>
                          <TableCell>{message.telephone_client}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate">
                              {message.message_client}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(message.date_creation), 'dd/MM/yyyy HH:mm', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewMessage(message)}
                              className="border"
                              style={{ borderColor: '#212937', color: '#212937' }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.current_page} sur {pagination.total_pages} ({pagination.total_records} messages)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!pagination.has_prev}
                      className="border"
                      style={{ borderColor: '#212937', color: '#212937' }}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!pagination.has_next}
                      className="border"
                      style={{ borderColor: '#212937', color: '#212937' }}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Message Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: '#212937' }}>
              <MessageSquare className="h-5 w-5" />
              Message de {selectedMessage?.nom_client}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#212937' }}>
                      <User className="h-4 w-4" />
                      Nom du client
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedMessage.nom_client}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#212937' }}>
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedMessage.email_client}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#212937' }}>
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedMessage.telephone_client}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#212937' }}>
                      <Calendar className="h-4 w-4" />
                      Date de création
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedMessage.date_creation), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#212937' }}>
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </div>
                  <div className="bg-muted p-4 rounded-lg border" style={{ borderColor: '#212937' }}>
                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.message_client}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#212937' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: '#212937' }}>Statut:</span>
                    {getStatusBadge(selectedMessage.vue_par_admin)}
                  </div>
                  
                  {selectedMessage.date_vue_admin && (
                    <p className="text-sm text-muted-foreground">
                      Lu le {format(new Date(selectedMessage.date_vue_admin), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMessages;
