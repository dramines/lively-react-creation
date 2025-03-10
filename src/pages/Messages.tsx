import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Star,
  Archive,
  Mail,
  MailOpen,
  Send,
} from 'lucide-react';
import Modal from '../components/Modal';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

interface Message {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  preview: string;
  content: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  category: 'inbox' | 'sent' | 'archived' | 'draft';
  priority: 'haute' | 'normale' | 'basse';
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState<'inbox' | 'sent'>('inbox');
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: ''
  });

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = getFromLocalStorage<Message[]>('messages', []);
    setMessages(storedMessages);
  }, []);

  const filteredMessages = messages.filter(message => 
    message.category === currentCategory &&
    !message.isArchived &&
    (message.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }
  };

  const toggleStar = (messageId: string) => {
    const updatedMessages = messages.map(message =>
      message.id === messageId
        ? { ...message, isStarred: !message.isStarred }
        : message
    );
    setMessages(updatedMessages);
    saveToLocalStorage('messages', updatedMessages);
  };

  const markAsRead = (messageId: string) => {
    const updatedMessages = messages.map(message =>
      message.id === messageId
        ? { ...message, isRead: true }
        : message
    );
    setMessages(updatedMessages);
    saveToLocalStorage('messages', updatedMessages);
  };

  const archiveMessage = (messageId: string) => {
    const updatedMessages = messages.map(message =>
      message.id === messageId
        ? { ...message, isArchived: true, category: 'archived' }
        : message
    );
    setMessages(updatedMessages);
    saveToLocalStorage('messages', updatedMessages);
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'haute':
        return 'bg-red-500';
      case 'normale':
        return 'bg-yellow-500';
      case 'basse':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSendMessage = () => {
    const newMessageData: Message = {
      id: Date.now().toString(),
      from: {
        name: 'Moi',
        email: 'john.doe@example.com'
      },
      subject: newMessage.subject,
      preview: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : ''),
      content: newMessage.content,
      date: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      category: 'sent',
      priority: 'normale'
    };

    const updatedMessages = [...messages, newMessageData];
    setMessages(updatedMessages);
    saveToLocalStorage('messages', updatedMessages);
    
    setIsNewMessageModalOpen(false);
    setNewMessage({ to: '', subject: '', content: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setIsNewMessageModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Nouveau message
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <div className="card space-y-2">
            <button
              onClick={() => setCurrentCategory('inbox')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                currentCategory === 'inbox' ? 'bg-gray-700' : 'hover:bg-gray-700/50'
              }`}
            >
              <Mail className="h-5 w-5" />
              <span>Boîte de réception</span>
              <span className="ml-auto bg-gold-500 text-gray-900 px-2 rounded-full text-sm">
                {messages.filter(m => !m.isRead && m.category === 'inbox').length}
              </span>
            </button>
            <button
              onClick={() => setCurrentCategory('sent')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                currentCategory === 'sent' ? 'bg-gray-700' : 'hover:bg-gray-700/50'
              }`}
            >
              <MailOpen className="h-5 w-5" />
              <span>Messages envoyés</span>
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="col-span-12 lg:col-span-9">
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Rechercher des messages..."
                  className="input pr-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-gray-700'
                        : 'hover:bg-gray-700/50'
                    } ${!message.isRead ? 'bg-gray-800/50' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      markAsRead(message.id);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(message.id);
                        }}
                        className={`text-gray-400 hover:text-gold-400 ${
                          message.isStarred ? 'text-gold-400' : ''
                        }`}
                      >
                        <Star className="h-5 w-5" />
                      </button>
                      {message.from.avatar ? (
                        <img
                          src={message.from.avatar}
                          alt={message.from.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-lg font-semibold">
                            {message.from.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">
                            {message.from.name}
                          </h3>
                          <span className="text-sm text-gray-400">
                            {formatDate(message.date)}
                          </span>
                        </div>
                        <p className="font-medium text-gray-300 truncate">
                          {message.subject}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {message.preview}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveMessage(message.id);
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <Archive className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Aucun message trouvé</p>
              )}
            </div>
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mt-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {selectedMessage.from.avatar ? (
                    <img
                      src={selectedMessage.from.avatar}
                      alt={selectedMessage.from.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-xl font-semibold">
                        {selectedMessage.from.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>{selectedMessage.from.name}</span>
                      <span>&#8226;</span>
                      <span>{selectedMessage.from.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-secondary">
                    Répondre
                  </button>
                  <button
                    onClick={() => archiveMessage(selectedMessage.id)}
                    className="btn-secondary"
                  >
                    Archiver
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-gray-300">
                {selectedMessage.content}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      <Modal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        title="Nouveau message"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              À
            </label>
            <input
              type="email"
              className="input w-full"
              value={newMessage.to}
              onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
              placeholder="email@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Sujet
            </label>
            <input
              type="text"
              className="input w-full"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              placeholder="Sujet du message"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Message
            </label>
            <textarea
              className="input w-full h-32 resize-none"
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              placeholder="Votre message..."
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="btn-secondary"
              onClick={() => setIsNewMessageModalOpen(false)}
            >
              Annuler
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleSendMessage}
            >
              <Send className="h-4 w-4" />
              Envoyer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Messages;