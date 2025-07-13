import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AgentStatusToggle } from '@/components/admin/AgentStatusToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id_session: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  status: string;
  last_activity: string;
  unread_count: number;
  message_count: number;
}

interface ChatMessage {
  id_message: number;
  id_session: string;
  sender_type: 'client' | 'agent';
  sender_name: string;
  message_content: string;
  message_type: string;
  is_read: boolean;
  date_sent: string;
  image_url?: string;
}

export const AdminChat: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession);
      markMessagesAsRead(activeSession);
    }
  }, [activeSession]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/chat_sessions.php');
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/chat_messages.php?session_id=${sessionId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (sessionId: string) => {
    try {
      await fetch('https://draminesaid.com/lucci/api/chat_messages.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          sender_type: 'client'
        }),
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeSession || !isOnline) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/chat_messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession,
          sender_type: 'agent',
          sender_name: 'Luxury Assistant',
          message_content: newMessage.trim(),
          message_type: 'text'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        fetchMessages(activeSession);
        fetchSessions(); // Refresh to update last activity
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible d\'envoyer le message',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur de connexion',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeSessionData = sessions.find(s => s.id_session === activeSession);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Chat Assistant</h1>
        </div>

        {/* Agent Status Toggle */}
        <AgentStatusToggle onStatusChange={setIsOnline} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Sessions List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Sessions ({sessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id_session}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        activeSession === session.id_session
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setActiveSession(session.id_session)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium text-sm">
                              {session.client_name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {session.client_email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(session.last_activity)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {session.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {session.unread_count}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2">
            {activeSession && activeSessionData ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {activeSessionData.client_name}
                      </div>
                      <p className="text-sm text-muted-foreground font-normal">
                        {activeSessionData.client_email}
                      </p>
                    </div>
                    <Badge variant={isOnline ? 'default' : 'secondary'}>
                      {isOnline ? 'EN LIGNE' : 'HORS LIGNE'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-0 flex flex-col h-[440px]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id_message}
                          className={`flex ${
                            message.sender_type === 'agent' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.sender_type === 'agent'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.message_content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {formatTime(message.date_sent)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                          isOnline 
                            ? "Tapez votre message..." 
                            : "Vous devez être en ligne pour envoyer des messages"
                        }
                        disabled={!isOnline || isLoading}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={!isOnline || isLoading || !newMessage.trim()}
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une session pour commencer à chatter</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};