import { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  Inbox, 
  Send, 
  Archive, 
  Star, 
  Trash2, 
  MoreHorizontal,
  Flag,
  Tag,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getMessages } from '../messages';
import { Message } from '../types';

const Messages = () => {
  const [activeView, setActiveView] = useState<'inbox' | 'sent' | 'archived' | 'draft'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewMessageOpen, setIsViewMessageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'date' | 'priority'>('date');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await getMessages();
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(message => {
    const searchText = searchTerm.toLowerCase();
    return (
      message.subject.toLowerCase().includes(searchText) ||
      message.preview.toLowerCase().includes(searchText) ||
      message.content.toLowerCase().includes(searchText) ||
      message.from.name.toLowerCase().includes(searchText) ||
      message.from.email.toLowerCase().includes(searchText)
    );
  }).filter(message => {
    if (activeView === 'inbox') {
      return !message.isArchived && message.category === 'inbox';
    } else if (activeView === 'sent') {
      return message.category === 'sent';
    } else if (activeView === 'archived') {
      return message.isArchived;
    } else {
      return message.category === 'draft';
    }
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (sortOption === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      const priorityValues = { 'haute': 3, 'normale': 2, 'basse': 1 };
      return priorityValues[b.priority] - priorityValues[a.priority];
    }
  });

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewMessageOpen(true);

    if (!message.isRead) {
      const updatedMessage = { ...message, isRead: true };
      const updatedMessages = messages.map(m => 
        m.id === message.id ? updatedMessage : m
      );
      setMessages(updatedMessages);
    }
  };

  const handleCloseMessage = () => {
    setIsViewMessageOpen(false);
    setSelectedMessage(null);
  };

  const handleToggleStar = (message: Message) => {
    const updatedMessage = { ...message, isStarred: !message.isStarred };
    const updatedMessages = messages.map(m => 
      m.id === message.id ? updatedMessage : m
    );
    setMessages(updatedMessages);
    
    if (isViewMessageOpen && selectedMessage?.id === message.id) {
      setSelectedMessage(updatedMessage);
    }
  };

  const handleToggleArchive = (message: Message) => {
    const updatedMessage = { ...message, isArchived: !message.isArchived };
    const updatedMessages = messages.map(m => 
      m.id === message.id ? updatedMessage : m
    );
    setMessages(updatedMessages);
    
    if (isViewMessageOpen && selectedMessage?.id === message.id) {
      setSelectedMessage(updatedMessage);
    }
  };

  const handleDeleteMessage = (message: Message) => {
    const updatedMessages = messages.filter(m => m.id !== message.id);
    setMessages(updatedMessages);
    setIsViewMessageOpen(false);
    setSelectedMessage(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Rechercher..."
              className="input pr-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-700 px-4 py-6 overflow-y-auto">
          <nav className="space-y-3">
            <button
              onClick={() => setActiveView('inbox')}
              className={`flex items-center space-x-2 w-full rounded-md p-2 transition-colors ${
                activeView === 'inbox' ? 'bg-gray-700 text-gold-400' : 'hover:bg-gray-700/20 text-gray-300'
              }`}
            >
              <Inbox className="h-4 w-4" />
              <span>Boîte de réception</span>
            </button>
            <button
              onClick={() => setActiveView('sent')}
              className={`flex items-center space-x-2 w-full rounded-md p-2 transition-colors ${
                activeView === 'sent' ? 'bg-gray-700 text-gold-400' : 'hover:bg-gray-700/20 text-gray-300'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>Envoyés</span>
            </button>
            <button
              onClick={() => setActiveView('archived')}
              className={`flex items-center space-x-2 w-full rounded-md p-2 transition-colors ${
                activeView === 'archived' ? 'bg-gray-700 text-gold-400' : 'hover:bg-gray-700/20 text-gray-300'
              }`}
            >
              <Archive className="h-4 w-4" />
              <span>Archivés</span>
            </button>
            <button
              onClick={() => setActiveView('draft')}
              className={`flex items-center space-x-2 w-full rounded-md p-2 transition-colors ${
                activeView === 'draft' ? 'bg-gray-700 text-gold-400' : 'hover:bg-gray-700/20 text-gray-300'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Brouillons</span>
            </button>
          </nav>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">Chargement des messages...</div>
          ) : sortedMessages.length === 0 ? (
            <div className="p-6 text-center text-gray-400">Aucun message trouvé.</div>
          ) : (
            <div className="divide-y divide-gray-700">
              {sortedMessages.map(message => (
                <button
                  key={message.id}
                  onClick={() => handleViewMessage(message)}
                  className={`w-full p-4 text-left hover:bg-gray-700/20 transition-colors ${
                    message.isRead ? 'text-gray-400' : 'text-white font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={message.from.avatar || 'https://via.placeholder.com/40'}
                        alt={message.from.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p>{message.from.name}</p>
                        <p className="text-sm text-gray-500">{message.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{format(new Date(message.date), 'dd MMM yyyy', { locale: fr })}</span>
                      {message.isStarred && <Star className="h-4 w-4 text-gold-400" />}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{message.preview}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message View */}
        {isViewMessageOpen && selectedMessage && (
          <div className="w-96 border-l border-gray-700 p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedMessage.subject}</h2>
                <div className="flex items-center space-x-2 text-gray-400">
                  <p>De: {selectedMessage.from.name} ({selectedMessage.from.email})</p>
                  <p>{format(new Date(selectedMessage.date), 'dd MMM yyyy HH:mm', { locale: fr })}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleStar(selectedMessage)}
                  className="hover:text-gold-400 transition-colors"
                >
                  <Star className={`h-5 w-5 ${selectedMessage.isStarred ? 'text-gold-400' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => handleToggleArchive(selectedMessage)}
                  className="hover:text-blue-400 transition-colors"
                >
                  <Archive className="h-5 w-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handleDeleteMessage(selectedMessage)}
                  className="hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-5 w-5 text-gray-400" />
                </button>
                <button onClick={handleCloseMessage} className="hover:text-white transition-colors">
                  <MoreHorizontal className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="text-gray-300 flex-1 overflow-y-auto">
              {selectedMessage.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
