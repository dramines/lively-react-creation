
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MessageSquare, Mail, Phone, Calendar, Eye, Trash2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id_message: number;
  nom_message: string;
  prenom_message: string;
  email_message: string;
  telephone_message: string;
  message_message: string;
  date_creation_message: string;
  vue_message: boolean;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('https://www.draminesaid.com/luccy/api/get_all_messages.php');
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch('https://www.draminesaid.com/luccy/api/mark_message_as_read.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_message: id }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(messages.map(m => 
          m.id_message === id ? { ...m, vue_message: true } : m
        ));
        toast({
          title: "Succès",
          description: "Message marqué comme lu",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer le message comme lu",
        variant: "destructive",
      });
    }
  };

  const filteredMessages = messages.filter(message =>
    message.nom_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.prenom_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadMessages = messages.filter(m => !m.vue_message).length;
  const todayMessages = messages.filter(m => 
    new Date(m.date_creation_message).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Messages
          </h1>
          <p className="text-gray-600 text-lg mt-1">
            Gérez vos messages clients ({messages.length} messages)
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
          <MessageSquare className="h-4 w-4 mr-2" />
          Nouveau message
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{messages.length}</div>
            <div className="flex items-center mt-2">
              <MessageSquare className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-blue-600">Tous les messages</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Non lus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800">{unreadMessages}</div>
            <div className="flex items-center mt-2">
              <Mail className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm text-red-600">À traiter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">{todayMessages}</div>
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">Nouveaux messages</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Taux de lecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {messages.length > 0 ? Math.round(((messages.length - unreadMessages) / messages.length) * 100) : 0}%
            </div>
            <div className="flex items-center mt-2">
              <Eye className="h-4 w-4 text-purple-600 mr-1" />
              <span className="text-sm text-purple-600">Messages lus</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-xl font-semibold text-gray-900">Liste des messages</CardTitle>
          <CardDescription className="text-gray-600">
            Tous vos messages clients avec leurs détails
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Rechercher un message..." 
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
              <p className="text-gray-500">Chargement des messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun message trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card key={message.id_message} className={`hover:shadow-md transition-all duration-200 ${
                  !message.vue_message ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {message.nom_message.charAt(0)}{message.prenom_message.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {message.nom_message} {message.prenom_message}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{message.email_message}</span>
                            </div>
                            {message.telephone_message && (
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span>{message.telephone_message}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!message.vue_message && (
                          <Badge className="bg-red-100 text-red-800 border-red-200" variant="outline">
                            Nouveau
                          </Badge>
                        )}
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200" variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(message.date_creation_message).toLocaleDateString('fr-FR')}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 leading-relaxed">{message.message_message}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>Reçu le {new Date(message.date_creation_message).toLocaleDateString('fr-FR')} à {new Date(message.date_creation_message).toLocaleTimeString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!message.vue_message && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(message.id_message)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Marquer comme lu
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Répondre
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;
