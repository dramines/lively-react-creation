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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <div className="flex gap-2">
          <select
            className="input"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'date' | 'priority')}
          >
            <option value="date">Date</option>
            <option value="priority">Priorité</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un message..."
              className="input pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="card space-y-4">
            <button
              className={`btn-secondary w-full justify-start gap-2 ${activeView === 'inbox' ? 'bg-gray-700' : ''}`}
              onClick={() => setActiveView('inbox')}
            >
              <Inbox className="h-5 w-5" />
              Boîte de réception
            </button>
            <button
              className={`btn-secondary w-full justify-start gap-2 ${activeView === 'sent' ? 'bg-gray-700' : ''}`}
              onClick={() => setActiveView('sent')}
            >
              <Send className="h-5 w-5" />
              Envoyés
            </button>
            <button
              className={`btn-secondary w-full justify-start gap-2 ${activeView === 'archived' ? 'bg-gray-700' : ''}`}
              onClick={() => setActiveView('archived')}
            >
              <Archive className="h-5 w-5" />
              Archivés
            </button>
            <button
              className={`btn-secondary w-full justify-start gap-2 ${activeView === 'draft' ? 'bg-gray-700' : ''}`}
              onClick={() => setActiveView('draft')}
            >
              <Mail className="h-5 w-5" />
              Brouillons
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-white">
              Chargement des messages...
            </div>
          ) : (
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="pb-3 font-semibold text-gray-400">Sujet</th>
                      <th className="pb-3 font-semibold text-gray-400">De</th>
                      <th className="pb-3 font-semibold text-gray-400">Date</th>
                      <th className="pb-3 font-semibold text-gray-400">Priorité</th>
                      <th className="pb-3 font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMessages.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-400">
                          Aucun message trouvé.
                        </td>
                      </tr>
                    ) : (
                      sortedMessages.map((message) => (
                        <tr
                          key={message.id}
                          className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              {message.isRead ? (
                                <Mail className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Mail className="h-5 w-5 text-blue-400" />
                              )}
                              <span>{message.subject}</span>
                            </div>
                          </td>
                          <td className="py-3">{message.from.name}</td>
                          <td className="py-3">
                            {format(new Date(message.date), 'dd MMMM yyyy, HH:mm', { locale: fr })}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              {message.priority === 'haute' && <Flag className="h-4 w-4 text-red-400" />}
                              {message.priority === 'normale' && <Tag className="h-4 w-4 text-yellow-400" />}
                              {message.priority === 'basse' && <AlertCircle className="h-4 w-4 text-green-400" />}
                              <span>{message.priority}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewMessage(message)}
                                className="p-1 hover:text-white text-gray-400"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleArchive(message)}
                                className="p-1 hover:text-white text-gray-400"
                              >
                                <Archive className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleStar(message)}
                                className="p-1 hover:text-yellow-400 text-gray-400"
                              >
                                <Star className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(message)}
                                className="p-1 hover:text-red-400 text-gray-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {isViewMessageOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="card w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center border-b border-gray-700 p-4">
              <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleArchive(selectedMessage)}
                  className="p-1 hover:text-white text-gray-400"
                >
                  <Archive className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggleStar(selectedMessage)}
                  className="p-1 hover:text-yellow-400 text-gray-400"
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteMessage(selectedMessage)}
                  className="p-1 hover:text-red-400 text-gray-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsViewMessageOpen(false)}
                  className="p-1 hover:text-white text-gray-400"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                {selectedMessage.from.avatar && (
                  <img
                    src={selectedMessage.from.avatar}
                    alt={selectedMessage.from.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{selectedMessage.from.name}</p>
                  <p className="text-gray-400">{selectedMessage.from.email}</p>
                </div>
              </div>
              <p className="text-gray-300">{selectedMessage.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
