import { useState, useEffect } from 'react';
import { Search, Eye, Mail, Phone, User, Calendar, Filter } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Email {
  id_email: number;
  nom_client: string;
  email_client: string;
  telephone_client: string;
  sujet_message: string;
  message_client: string;
  vue_par_admin: number;
  date_vue_admin: string | null;
  date_creation: string;
}

const AdminEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const { toast } = useToast();

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        vue_filter: statusFilter
      });

      const response = await fetch(`https://draminesaid.com/lucci/api/get_all_emails.php?${params}`);
      const data = await response.json();

      if (data.success) {
        setEmails(data.data);
        setTotalPages(data.pagination.total_pages);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les emails",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [currentPage, searchTerm, statusFilter]);

  const markAsRead = async (emailId: number) => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/mark_email_as_read.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: emailId }),
      });

      const result = await response.json();
      if (result.success) {
        setEmails(emails.map(email => 
          email.id_email === emailId 
            ? { ...email, vue_par_admin: 1, date_vue_admin: new Date().toISOString() }
            : email
        ));
        if (selectedEmail && selectedEmail.id_email === emailId) {
          setSelectedEmail({ ...selectedEmail, vue_par_admin: 1, date_vue_admin: new Date().toISOString() });
        }
        toast({
          title: "Succès",
          description: "Email marqué comme lu",
        });
      }
    } catch (error) {
      console.error('Error marking email as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer l'email comme lu",
        variant: "destructive",
      });
    }
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.vue_par_admin) {
      markAsRead(email.id_email);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestion des Emails</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, email ou message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les emails</SelectItem>
              <SelectItem value="not_vue">Non lus</SelectItem>
              <SelectItem value="vue">Lus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Email List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Liste des Emails ({emails.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : emails.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucun email trouvé</div>
              ) : (
                emails.map((email) => (
                  <Card
                    key={email.id_email}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedEmail?.id_email === email.id_email ? 'ring-2 ring-blue-500' : ''
                    } ${email.vue_par_admin ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-500'}`}
                    onClick={() => handleEmailClick(email)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{email.nom_client}</span>
                          {!email.vue_par_admin && (
                            <Badge variant="secondary" className="text-xs">Nouveau</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(email.date_creation)}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{email.email_client}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{email.telephone_client}</span>
                        </div>
                        {email.sujet_message && (
                          <div className="font-medium text-gray-800 mt-2">
                            Sujet: {email.sujet_message}
                          </div>
                        )}
                        <p className="text-gray-700 line-clamp-2 mt-2">
                          {email.message_client}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <span className="px-3 py-2 text-sm">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>

          {/* Email Detail */}
          <div>
            {selectedEmail ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Détails de l'Email
                    </CardTitle>
                    {!selectedEmail.vue_par_admin && (
                      <Button
                        size="sm"
                        onClick={() => markAsRead(selectedEmail.id_email)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nom</label>
                      <p className="text-gray-900">{selectedEmail.nom_client}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedEmail.email_client}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Téléphone</label>
                      <p className="text-gray-900">{selectedEmail.telephone_client}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date</label>
                      <p className="text-gray-900">{formatDate(selectedEmail.date_creation)}</p>
                    </div>
                  </div>
                  
                  {selectedEmail.sujet_message && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sujet</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {selectedEmail.sujet_message}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">Message</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedEmail.message_client}
                      </p>
                    </div>
                  </div>

                  {selectedEmail.vue_par_admin && selectedEmail.date_vue_admin && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Eye className="w-4 h-4" />
                      <span>Lu le {formatDate(selectedEmail.date_vue_admin)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez un email pour voir les détails</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmails;
