import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot, 
  Clock, 
  Mail, 
  Phone,
  Circle,
  Search,
  Wifi,
  WifiOff,
  Settings,
  MoreHorizontal,
  Paperclip,
  Smile,
  Archive,
  Star,
  CheckCheck,
  Check,
  ArrowLeft,
  Menu,
  X,
  ImageIcon,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSession {
  id_session: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: 'active' | 'closed' | 'archived';
  last_activity: string;
  date_created: string;
  message_count: number;
  unread_count: number;
}

interface ChatMessage {
  id_message: number;
  id_session: string;
  sender_type: 'client' | 'agent';
  sender_name: string;
  message_content: string;
  message_type: 'text' | 'file' | 'system' | 'image';
  is_read: boolean;
  date_sent: string;
  image_url?: string;
  image_name?: string;
  image_size?: number;
}

const AdminMessanger = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const [agentEmail] = useState('support@lucci.com');
  const [agentName] = useState('Agent Support');
  const [isTypingClient, setIsTypingClient] = useState(false);
  const [showSessionsList, setShowSessionsList] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const API_BASE = 'api';

  // Set agent online status
  const setAgentStatus = async (online: boolean) => {
    try {
      console.log('Setting agent status to:', online);
      const response = await fetch(`${API_BASE}/agent_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: online ? 'online' : 'offline',
          agent_name: agentName,
          agent_email: agentEmail,
          status_message: online ? 'Disponible maintenant' : 'Absent temporairement'
        }),
      });
      
      const data = await response.json();
      console.log('Agent status response:', data);
      
      if (data.success) {
        setIsOnline(online);
        toast({
          title: online ? "Vous êtes en ligne" : "Vous êtes hors ligne",
          description: online ? "Vous pouvez maintenant recevoir des messages" : "Vous ne recevrez plus de nouveaux messages"
        });
        
        // Send heartbeat every 30 seconds when online
        if (online) {
          const heartbeatInterval = setInterval(async () => {
            if (isOnline) {
              await fetch(`${API_BASE}/agent_status.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'heartbeat',
                  agent_email: agentEmail
                }),
              });
            } else {
              clearInterval(heartbeatInterval);
            }
          }, 30000);
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de changer le statut. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error setting agent status:', error);
      toast({
        title: "Erreur de connexion",
        description: "Problème de connexion au serveur.",
        variant: "destructive"
      });
    }
  };

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat_sessions.php`);
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages
  const fetchMessages = async (sessionId: string, lastMsgId?: number) => {
    try {
      const url = new URL(`${API_BASE}/chat_messages.php`, window.location.origin);
      url.searchParams.append('session_id', sessionId);
      if (lastMsgId) {
        url.searchParams.append('last_message_id', lastMsgId.toString());
      }

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.success) {
        if (lastMsgId) {
          setMessages(prev => [...prev, ...data.messages]);
        } else {
          setMessages(data.messages);
        }
        
        if (data.messages.length > 0) {
          const newLastId = Math.max(...data.messages.map((m: ChatMessage) => m.id_message));
          setLastMessageId(newLastId);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeSession || sendingMessage) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`${API_BASE}/chat_messages.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession.id_session,
          sender_type: 'agent',
          sender_name: agentName,
          message_content: newMessage,
          message_type: 'text'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setNewMessage('');
        setMessages(prev => [...prev, data.message]);
        setLastMessageId(data.message.id_message);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Select session
  const selectSession = (session: ChatSession) => {
    setActiveSession(session);
    setMessages([]);
    setLastMessageId(null);
    fetchMessages(session.id_session);
    
    // Close mobile sessions list
    if (isMobile) {
      setShowSessionsList(false);
    }
    
    // Mark messages as read
    fetch(`${API_BASE}/chat_messages.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: session.id_session,
        sender_type: 'client'
      }),
    });
  };

  // Mobile back to sessions
  const backToSessions = () => {
    if (isMobile) {
      setActiveSession(null);
      setShowSessionsList(true);
    }
  };

  // Handle mobile keyboard
  const handleMobileInput = () => {
    if (isMobile && messageInputRef.current) {
      // Scroll to input when keyboard opens
      setTimeout(() => {
        messageInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredSessions = sessions.filter(session =>
    session.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Effects
  useEffect(() => {
    fetchSessions();
    setAgentStatus(true);
    
    // On mobile, show sessions list by default
    if (isMobile && !activeSession) {
      setShowSessionsList(true);
    }
    
    return () => {
      setAgentStatus(false);
    };
  }, []);

  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      fetchMessages(activeSession.id_session, lastMessageId || undefined);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSession, lastMessageId]);

  useEffect(() => {
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeSession) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erreur",
        description: "Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "Erreur", 
        description: "Fichier trop volumineux. Maximum 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE}/upload_chat_image.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        await sendImageMessage(data.data.url, data.data.filename, data.data.size);
        
        toast({
          title: "Image envoyée",
          description: "L'image a été partagée avec succès."
        });
      } else {
        throw new Error(data.error || 'Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de l'image.",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const sendImageMessage = async (imageUrl: string, imageName: string, imageSize: number) => {
    if (!activeSession) return;

    try {
      const response = await fetch(`${API_BASE}/chat_messages.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession.id_session,
          sender_type: 'agent',
          sender_name: agentName,
          message_content: 'Image partagée',
          message_type: 'image',
          image_url: imageUrl,
          image_name: imageName,
          image_size: imageSize
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setLastMessageId(data.message.id_message);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending image message:', error);
    }
  };

  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(`https://draminesaid.com/lucci/${imageUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageName || 'image.jpg';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de l'image.",
        variant: "destructive"
      });
    }
  };

  const renderMessage = (message: ChatMessage) => (
    <div
      key={message.id_message}
      className={cn(
        "flex gap-3",
        isMobile ? "max-w-[85%]" : "max-w-[80%]",
        message.sender_type === 'agent' ? "ml-auto flex-row-reverse" : ""
      )}
    >
      <Avatar className={cn(isMobile ? "w-8 h-8" : "w-8 h-8", "flex-shrink-0")}>
        <AvatarFallback className={cn(
          "text-xs",
          message.sender_type === 'agent'
            ? "bg-gradient-to-r from-gray-900 to-black text-white"
            : "bg-gray-200 text-gray-700"
        )}>
          {message.sender_type === 'agent' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "space-y-1",
        message.sender_type === 'agent' ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl shadow-sm",
          isMobile ? "max-w-md" : "max-w-md",
          message.sender_type === 'agent'
            ? "bg-gradient-to-r from-gray-900 to-black text-white rounded-tr-md"
            : "bg-white border rounded-tl-md"
        )}>
          {message.message_type === 'image' && message.image_url ? (
            <div className="p-2">
              <div className="relative group">
                <img 
                  src={`https://draminesaid.com/lucci/${message.image_url}`}
                  alt={message.image_name || 'Image partagée'} 
                  className={cn(
                    "max-w-full rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity",
                    isMobile ? "max-h-48" : "max-h-64"
                  )}
                  onClick={() => window.open(`https://draminesaid.com/lucci/${message.image_url}`, '_blank')}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => downloadImage(message.image_url!, message.image_name!)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {message.message_content && message.message_content !== 'Image partagée' && (
                <p className="mt-2 p-2 text-sm">{message.message_content}</p>
              )}
            </div>
          ) : (
            <div className={cn("px-4 py-2", isMobile ? "py-3" : "py-2")}>
              {message.message_content}
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex items-center gap-1 text-xs text-gray-500 px-1",
          message.sender_type === 'agent' ? "justify-end" : "justify-start"
        )}>
          <span>{formatTime(message.date_sent)}</span>
          {message.sender_type === 'agent' && (
            <div className="flex">
              {message.is_read ? (
                <CheckCheck className="w-3 h-3 text-blue-500" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Sessions List Component
  const SessionsList = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("font-bold", isMobile ? "text-lg" : "text-xl")}>Messanger</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <Switch
                checked={isOnline}
                onCheckedChange={(checked) => {
                  console.log('Switch clicked, new value:', checked);
                  setAgentStatus(checked);
                }}
                className="data-[state=checked]:bg-green-500"
              />
              <span className={cn("text-xs", isOnline ? "text-green-400" : "text-red-400")}>
                {isOnline ? "En ligne" : "Hors ligne"}
              </span>
            </div>
            {!isMobile && <Settings className="w-5 h-5 opacity-70 hover:opacity-100 cursor-pointer" />}
          </div>
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isOnline ? "bg-green-400 animate-pulse" : "bg-red-400"
          )} />
          <span className="text-sm font-medium">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className={cn("p-2", isMobile ? "pb-20" : "")}>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Chargement...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune conversation
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id_session}
                className={cn(
                  "flex items-center gap-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50 mb-2",
                  isMobile ? "p-4 active:bg-gray-100" : "p-3",
                  activeSession?.id_session === session.id_session
                    ? "bg-gradient-to-r from-gray-900 to-black text-white"
                    : "bg-white hover:shadow-md"
                )}
                onClick={() => selectSession(session)}
              >
                <div className="relative">
                  <Avatar className={cn(isMobile ? "w-14 h-14" : "w-12 h-12")}>
                    <AvatarFallback className={cn(
                      "font-medium",
                      activeSession?.id_session === session.id_session
                        ? "bg-white/20 text-white"
                        : "bg-gradient-to-r from-gray-900 to-black text-white"
                    )}>
                      {getInitials(session.client_name || 'C')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 rounded-full border-2",
                    isMobile ? "w-5 h-5" : "w-4 h-4",
                    session.status === 'active' ? "bg-green-400" : "bg-gray-400",
                    activeSession?.id_session === session.id_session ? "border-gray-900" : "border-white"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("font-medium truncate", isMobile ? "text-base" : "text-sm")}>
                      {session.client_name || 'Client Anonyme'}
                    </h3>
                    <span className={cn(
                      "text-xs flex-shrink-0 ml-2",
                      activeSession?.id_session === session.id_session
                        ? "text-white/70"
                        : "text-gray-500"
                    )}>
                      {formatDate(session.last_activity)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "text-sm truncate",
                      activeSession?.id_session === session.id_session
                        ? "text-white/70"
                        : "text-gray-600"
                    )}>
                      {session.client_email || 'Aucun email'}
                    </div>
                    
                    {session.unread_count > 0 && (
                      <Badge className={cn(
                        "bg-red-500 text-white text-xs flex-shrink-0 ml-2",
                        isMobile ? "h-6 px-3" : "h-5 px-2"
                      )}>
                        {session.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <AdminLayout>
      <div className={cn(
        "flex bg-gradient-to-br from-gray-50 to-white",
        isMobile ? "h-[calc(100vh-4rem)] flex-col" : "h-[calc(100vh-6rem)]"
      )}>
        {/* Mobile Layout */}
        {isMobile ? (
          <>
            {/* Mobile Sessions View */}
            {(!activeSession || showSessionsList) && (
              <Card className="flex-1 flex flex-col bg-white rounded-none shadow-xl">
                <SessionsList />
              </Card>
            )}

            {/* Mobile Chat View */}
            {activeSession && !showSessionsList && (
              <Card className="flex-1 flex flex-col bg-white rounded-none shadow-xl">
                {/* Mobile Chat Header */}
                <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={backToSessions}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-white/20 text-white">
                      {getInitials(activeSession.client_name || 'C')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{activeSession.client_name || 'Client Anonyme'}</h3>
                    <div className="text-sm text-white/70 truncate">
                      {activeSession.client_email || 'Aucun email'}
                    </div>
                  </div>
                  
                  <Badge 
                    variant={activeSession.status === 'active' ? 'default' : 'secondary'}
                    className={cn(
                      "capitalize text-xs",
                      activeSession.status === 'active' ? "bg-green-500" : "bg-gray-500"
                    )}
                  >
                    {activeSession.status === 'active' ? 'Actif' : 'Fermé'}
                  </Badge>
                </div>

                <Separator />

                {/* Mobile Messages */}
                <ScrollArea className="flex-1 bg-gradient-to-b from-gray-50/50 to-white">
                  <div className="p-4 space-y-4 pb-6">
                    {messages.map(renderMessage)}

                    {/* Mobile Typing indicator */}
                    {isTypingClient && (
                      <div className="flex gap-3 max-w-[85%]">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Mobile Message Input with Image Upload */}
                {activeSession.status === 'active' && (
                  <>
                    <Separator />
                    <div className="p-4 bg-white">
                      <div className="flex items-end gap-2 p-3 bg-gray-50 rounded-2xl">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="rounded-full p-2 flex-shrink-0"
                        >
                          {uploadingImage ? (
                            <div className="w-5 h-5 animate-spin border-2 border-primary border-t-transparent rounded-full" />
                          ) : (
                            <ImageIcon className="w-5 h-5" />
                          )}
                        </Button>
                        <div className="flex-1 min-w-0">
                          <Input
                            ref={messageInputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onFocus={handleMobileInput}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                            placeholder="Tapez votre message..."
                            disabled={sendingMessage}
                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                          />
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full p-2 flex-shrink-0">
                          <Smile className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="rounded-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 p-3 flex-shrink-0"
                          size="sm"
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            )}
          </>
        ) : (
          /* Desktop Layout */
          <>
            {/* Desktop Sessions Sidebar */}
            <Card className="w-80 flex flex-col bg-white border-r-0 rounded-r-none shadow-xl">
              <SessionsList />
            </Card>

            {/* Desktop Chat Area */}
            <Card className="flex-1 flex flex-col bg-white rounded-l-none shadow-xl">
              {activeSession ? (
                <>
                  {/* Desktop Chat Header */}
                  <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-white/20 text-white">
                          {getInitials(activeSession.client_name || 'C')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{activeSession.client_name || 'Client Anonyme'}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/70">
                          {activeSession.client_email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {activeSession.client_email}
                            </span>
                          )}
                          {activeSession.client_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {activeSession.client_phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={activeSession.status === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          "capitalize",
                          activeSession.status === 'active' ? "bg-green-500" : "bg-gray-500"
                        )}
                      >
                        {activeSession.status === 'active' ? 'Actif' : 'Fermé'}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Desktop Messages */}
                  <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50/50 to-white">
                    <div className="space-y-4">
                      {messages.map(renderMessage)}

                      {/* Desktop Typing indicator */}
                      {isTypingClient && (
                        <div className="flex gap-3 max-w-[80%]">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white border rounded-2xl rounded-tl-md px-4 py-2 shadow-sm">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Desktop Message Input with Image Upload */}
                  {activeSession.status === 'active' && (
                    <>
                      <Separator />
                      <div className="p-4 bg-white">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-full">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="rounded-full"
                          >
                            {uploadingImage ? (
                              <div className="w-4 h-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
                            ) : (
                              <ImageIcon className="w-4 h-4" />
                            )}
                          </Button>
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                            placeholder="Tapez votre message..."
                            disabled={sendingMessage}
                            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <Button variant="ghost" size="sm" className="rounded-full">
                            <Smile className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || sendingMessage}
                            className="rounded-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900"
                            size="sm"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* Desktop No Chat Selected */
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Messanger Professionnel</h3>
                    <p className="text-gray-600 max-w-md">
                      Sélectionnez une conversation pour commencer à chatter avec vos clients en temps réel.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessanger;
