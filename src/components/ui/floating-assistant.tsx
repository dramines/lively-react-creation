
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, User, Bot, Sparkles, Camera, Paperclip, Plus } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent } from './dialog';
import { Input } from './input';
import { Label } from './label';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { cartEventEmitter } from '@/contexts/CartContext';

interface Message {
  text: string;
  isUser: boolean;
  imageUrl?: string;
  imageName?: string;
  isProductSuggestion?: boolean;
  products?: any[];
}

interface FloatingAssistantProps {
  onClose?: () => void;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  onClose
}) => {
  const { t } = useTranslation('chat');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    text: t('greeting'),
    isUser: false
  }]);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPredefinedQuestions, setShowPredefinedQuestions] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [agentsOnline, setAgentsOnline] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [userInfoCollected, setUserInfoCollected] = useState(false);
  const [showFreeChat, setShowFreeChat] = useState(false);
  const [isPollingMessages, setIsPollingMessages] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const checkStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagePollingRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sound notification function
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+X2u2ocCzSJ0vPTgjAFJYPG79SORQ0PVqzn7KlYFglBmuTMeSgHLYDL8N9NRBA=');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore errors if audio can't play
      });
    } catch {
      // Ignore errors
    }
  }, []);

  // Handle cart updates to show product suggestions
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      const { item, action } = event.detail;
      if (action === 'add') {
        handleNewProductAdded(item);
      }
    };

    cartEventEmitter.addEventListener('cartUpdate', handleCartUpdate as EventListener);
    
    return () => {
      cartEventEmitter.removeEventListener('cartUpdate', handleCartUpdate as EventListener);
    };
  }, []);

  const handleNewProductAdded = async (item: any) => {
    // Add initial message about the product
    setMessages(prev => [...prev, {
      text: t('productSuggestion.newItemAdded', { productName: item.name }),
      isUser: false
    }]);

    // Add suggestion message
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: t('productSuggestion.suggestSimilar'),
        isUser: false
      }]);
    }, 1000);

    // Fetch and show related products
    setTimeout(() => {
      fetchAndShowRelatedProducts(item.id);
    }, 2000);
  };

  const fetchAndShowRelatedProducts = async (productId: string) => {
    setLoadingSuggestions(true);
    
    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/get_related_products.php?id_product=${productId}&limit=3`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setMessages(prev => [...prev, {
          text: t('productSuggestion.relatedProducts'),
          isUser: false,
          isProductSuggestion: true,
          products: data.data
        }]);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
  const checkAgentStatus = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('https://draminesaid.com/lucci/api/agent_status.php?action=count', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const responseText = await response.text();
        // Only try to parse if it looks like JSON
        if (responseText.trim().startsWith('{')) {
          try {
            const data = JSON.parse(responseText);
            if (data.success) {
              setAgentsOnline(data.status === 'online');
            }
          } catch (parseError) {
            // Silently fail and keep current state
            setAgentsOnline(false);
          }
        } else {
          // Not JSON response, silently fail
          setAgentsOnline(false);
        }
      }
    } catch (error) {
      // Silently fail on any error
      setAgentsOnline(false);
    }
  }, []);
  
  const isBusinessHours = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 8 && hour < 17;
  };

  useEffect(() => {
    // Show assistant after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsOpen(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Optimized agent status checking - reduced frequency to every 60 seconds
  useEffect(() => {
    checkAgentStatus();
    
    // Only check during business hours and when component is visible
    if (isVisible && isBusinessHours()) {
      checkStatusIntervalRef.current = setInterval(checkAgentStatus, 60000); // Check every 60 seconds instead of 30
    }
    
    return () => {
      if (checkStatusIntervalRef.current) {
        clearInterval(checkStatusIntervalRef.current);
      }
    };
  }, [isVisible, checkAgentStatus]);

  // Removed auto-close behavior - chat will only close when user clicks X button

  // Auto-show contact form when chat opens if user info not collected
  useEffect(() => {
    if (isOpen && !userInfoCollected && !showContactForm) {
      setTimeout(() => {
        setShowContactForm(true);
      }, 1000);
    }
  }, [isOpen, userInfoCollected, showContactForm]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert(t('errors.fileType'));
      return;
    }

    if (file.size > maxSize) {
      alert(t('errors.fileSize'));
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for uploads

      const response = await fetch('https://draminesaid.com/lucci/api/upload_chat_image.php', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (data.success) {
        // Add image message
        setMessages(prev => [...prev, {
          text: '',
          isUser: true,
          imageUrl: `https://draminesaid.com/lucci/${data.data.url}`,
          imageName: data.data.filename
        }]);

        // Send to backend
        await sendImageMessage(data.data.url, data.data.filename, data.data.size);
      } else {
        alert(data.error || t('errors.uploadError'));
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        alert(t('errors.uploadTimeout'));
      } else {
        console.error('Error uploading image:', error);
        alert(t('errors.uploadError'));
      }
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const sendImageMessage = async (imageUrl: string, imageName: string, imageSize: number) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch('https://draminesaid.com/lucci/api/chat_messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId || 'floating_assistant_session',
          sender_type: 'client',
          sender_name: contactForm.name || 'Client',
          message_content: t('imageShared'),
          message_type: 'image',
          image_url: imageUrl,
          image_name: imageName,
          image_size: imageSize
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (data.success) {
        // Assistant response
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: t('imageReceived'),
            isUser: false
          }]);
        }, 1000);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sending image message:', error);
      }
    }
  };

  // Start polling for new messages when in live chat mode
  const startMessagePolling = useCallback(() => {
    if (isPollingMessages || !sessionId) return;
    
    setIsPollingMessages(true);
    messagePollingRef.current = setInterval(async () => {
      try {
        const url = new URL('api/chat_messages.php', window.location.origin);
        url.searchParams.append('session_id', sessionId);
        if (lastMessageId) {
          url.searchParams.append('last_message_id', lastMessageId.toString());
        }

        const response = await fetch(url.toString());
        const data = await response.json();
        
        if (data.success && data.messages.length > 0) {
          const newMessages = data.messages.filter((msg: any) => msg.sender_type === 'agent');
          
          if (newMessages.length > 0) {
            // Play notification sound for new agent messages
            playNotificationSound();
            
            newMessages.forEach((msg: any) => {
              setMessages(prev => [...prev, {
                text: msg.message_content,
                isUser: false,
                imageUrl: msg.image_url ? `https://draminesaid.com/lucci/${msg.image_url}` : undefined,
                imageName: msg.image_name
              }]);
            });
            
            setLastMessageId(Math.max(...data.messages.map((m: any) => m.id_message)));
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 3000);
  }, [sessionId, lastMessageId, isPollingMessages, playNotificationSound]);

  const stopMessagePolling = useCallback(() => {
    if (messagePollingRef.current) {
      clearInterval(messagePollingRef.current);
      messagePollingRef.current = null;
    }
    setIsPollingMessages(false);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (message.trim()) {
      const userMessage = message.trim();
      setMessage('');
      
      // Add user message to UI immediately
      setMessages(prev => [...prev, {
        text: userMessage,
        isUser: true
      }]);

      // If agents are online and user info is collected, send to real chat system
      if (agentsOnline && userInfoCollected) {
        try {
          const response = await fetch('https://draminesaid.com/lucci/api/chat_messages.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              sender_type: 'client',
              sender_name: contactForm.name || 'Client',
              message_content: userMessage,
              message_type: 'text'
            }),
          });

          const data = await response.json();
          if (data.success) {
            setLastMessageId(data.message.id_message);
            // Start polling for agent responses if not already polling
            if (!isPollingMessages) {
              startMessagePolling();
            }
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      } else {
        // Show contact form if user info not collected
        if (!userInfoCollected) {
          setTimeout(() => {
            setShowContactForm(true);
            setMessages(prev => [...prev, {
              text: t('contactFormRequest'),
              isUser: false
            }]);
          }, 1000);
        } else {
          // Fallback to automated responses for offline agents
          setTimeout(() => {
            let autoResponse = t('autoResponses.general');
            
            if (userMessage.toLowerCase().includes('prix') || userMessage.toLowerCase().includes('price')) {
              autoResponse = t('autoResponses.pricing');
            } else if (userMessage.toLowerCase().includes('livraison') || userMessage.toLowerCase().includes('delivery')) {
              autoResponse = t('autoResponses.delivery');
            } else if (userMessage.toLowerCase().includes('taille') || userMessage.toLowerCase().includes('size')) {
              autoResponse = t('autoResponses.sizing');
            }

            setMessages(prev => [...prev, {
              text: autoResponse,
              isUser: false
            }]);
          }, 1000);
        }
      }
    }
  }, [message, agentsOnline, userInfoCollected, sessionId, contactForm.name, isPollingMessages, t, startMessagePolling]);

  const predefinedQuestions = [
    {
      id: 1,
      text: t('questions.delivery.text'),
      description: t('questions.delivery.description'),
      answer: t('questions.delivery.answer')
    },
    {
      id: 2,
      text: t('questions.pricing.text'),
      description: t('questions.pricing.description'),
      answer: t('questions.pricing.answer')
    },
    {
      id: 3,
      text: t('questions.appointment.text'),
      description: t('questions.appointment.description'),
      answer: t('questions.appointment.answer')
    },
    {
      id: 4,
      text: t('questions.sizing.text'),
      description: t('questions.sizing.description'),
      answer: t('questions.sizing.answer')
    },
    {
      id: 5,
      text: t('questions.advisor.text'),
      description: t('questions.advisor.description'),
      answer: t('questions.advisor.answer')
    }
  ];

  const handleContactSubmit = () => {
    if (contactForm.name && contactForm.email && contactForm.phone) {
      setShowContactForm(false);
      setUserInfoCollected(true);
      
      // Generate session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      
      // Create session in backend
      fetch('https://draminesaid.com/lucci/api/chat_sessions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: newSessionId,
          client_name: contactForm.name,
          client_email: contactForm.email,
          client_phone: contactForm.phone
        }),
      }).catch(error => {
        console.error('Error creating session:', error);
      });

      setMessages(prev => [...prev, {
        text: agentsOnline 
          ? t('contactFormThank', { name: contactForm.name }) + ' ' + t('agentWillRespond')
          : t('contactFormThank', { name: contactForm.name }) + ' ' + t('agentOfflineMessage'),
        isUser: false
      }]);
      
      // Show appropriate interface based on agent status
      if (agentsOnline) {
        setShowFreeChat(true);
        // Start message polling for live chat
        setTimeout(() => {
          startMessagePolling();
        }, 1000);
      } else {
        setTimeout(() => {
          setShowPredefinedQuestions(true);
        }, 500);
      }
    }
  };

  const handleQuestionClick = (question: typeof predefinedQuestions[0]) => {
    setMessages(prev => [...prev, {
      text: question.text,
      isUser: true
    }]);
    
    // Simulate assistant response based on question
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: question.answer,
        isUser: false
      }]);
    }, 1000);
  };

  // Simplified handlers - no side effects
  const openMobileModal = () => {
    if (isMobile) {
      setIsMobileModalOpen(true);
    }
  };

  if (!isVisible) return null;

  const ChatContent = () => (
    <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm">
      <div className="bg-gradient-to-r from-primary via-accent to-primary p-4 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-semibold block">{t('assistantName')}</span>
            <span className="text-white/80 text-xs">{t('onlineNow')}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 h-8 w-8 p-0 relative z-10">
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/30">
        {messages.map((msg, index) => (
          <div key={index} className={cn("flex gap-2 items-start", msg.isUser ? "flex-row-reverse" : "flex-row")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", msg.isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-r from-accent to-primary text-white")}>
              {msg.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
           <div className={cn("max-w-[75%] rounded-2xl text-sm shadow-sm", msg.isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-white text-foreground border border-border rounded-tl-sm")}>
               {msg.imageUrl ? (
                 <div className="p-2">
                   <img 
                     src={msg.imageUrl} 
                     alt={msg.imageName || t('imageShared')} 
                     className="max-w-full max-h-48 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                     onClick={() => window.open(msg.imageUrl, '_blank')}
                     loading="lazy"
                   />
                   {msg.text && <p className="mt-2 p-2">{msg.text}</p>}
                 </div>
               ) : msg.isProductSuggestion && msg.products ? (
                 <div className="p-3">
                   <p className="mb-3">{msg.text}</p>
                   <div className="grid grid-cols-1 gap-2">
                     {msg.products.map((product: any) => (
                       <div key={product.id_product} className="flex gap-2 items-center p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                         <img 
                           src={`https://draminesaid.com/lucci/${product.img_product}`}
                           alt={product.nom_product}
                           className="w-12 h-12 object-cover rounded"
                         />
                         <div className="flex-1 min-w-0">
                           <p className="text-xs font-medium truncate">{product.nom_product}</p>
                           <p className="text-xs text-muted-foreground">{product.price_product}€</p>
                         </div>
                         <Button 
                           size="sm" 
                           variant="outline" 
                           className="text-xs px-2 py-1 h-auto"
                           onClick={() => window.open(`/product/${product.id_product}`, '_blank')}
                         >
                           {t('productSuggestion.viewProduct')}
                         </Button>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <div className="p-3">{msg.text}</div>
               )}
             </div>
          </div>
        ))}
      </div>
      
      {showContactForm && (
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="space-y-3">
            <div>
              <Label htmlFor="name" className="text-xs font-medium">{t('form.fullName')}</Label>
              <Input
                id="name"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('form.fullNamePlaceholder')}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs font-medium">{t('form.email')}</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t('form.emailPlaceholder')}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs font-medium">{t('form.phone')}</Label>
              <Input
                id="phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t('form.phonePlaceholder')}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <Button 
              onClick={handleContactSubmit} 
              className="w-full h-8 text-xs bg-gradient-to-r from-primary to-accent"
              disabled={!contactForm.name || !contactForm.email || !contactForm.phone}
            >
              {t('form.send')}
            </Button>
          </div>
        </div>
      )}

      {/* Show predefined questions only when agents are offline */}
      {showPredefinedQuestions && !agentsOnline && (
        <div className="p-3 border-t border-border bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground mb-2">{t('frequentQuestions')}</p>
          <div className="grid grid-cols-2 gap-2">
            {predefinedQuestions.map((question) => (
              <Button
                key={question.id}
                onClick={() => handleQuestionClick(question)}
                variant="outline"
                size="sm"
                className="h-auto p-2 text-xs border-border hover:bg-accent/50 flex flex-col items-start text-left"
              >
                <div className="font-medium text-xs truncate w-full">{question.text}</div>
                <div className="text-muted-foreground text-xs mt-1 line-clamp-2 w-full">{question.description}</div>
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Area - Show only when user info collected or when agents offline with predefined questions */}
      {(userInfoCollected || (!agentsOnline && showPredefinedQuestions)) && (
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-3">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            {/* Camera Button - Only show when agents are online */}
            {agentsOnline && userInfoCollected && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
              >
                {uploadingImage ? (
                  <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>
            )}
            
            {/* Text Input */}
            <div className="flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  agentsOnline && userInfoCollected 
                    ? t('writeMessage') 
                    : t('chooseQuestion')
                }
                disabled={!userInfoCollected && agentsOnline}
                className="w-full px-4 py-3 rounded-full border border-border bg-muted/30 focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground disabled:opacity-50"
              />
            </div>
            
            {/* Send Button */}
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!message.trim() || (!userInfoCollected && agentsOnline)}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop/Tablet Chat */}
      {!isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          {showTooltip && !isOpen && (
            <div className="absolute bottom-16 right-0 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap shadow-xl animate-fade-in border border-white/20">
              {t('tooltip')}
              <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
            </div>
          )}
          
          {isOpen ? (
            <div className="w-80">
              <ChatContent />
            </div>
          ) : (
            <Button onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }} size="lg" className="rounded-full w-16 h-16 bg-gradient-to-r from-primary via-accent to-primary shadow-xl ring-4 ring-primary/20">
              <div className="relative">
                <User className="w-6 h-6" />
                <div className={cn(
                  "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white my-[-105%] mx-[-60%]",
                  agentsOnline ? "bg-green-400 animate-pulse" : "bg-red-400"
                )}></div>
              </div>
            </Button>
          )}
        </div>
      )}

      {/* Mobile Chat */}
      {isMobile && (
        <>
          <div className="fixed bottom-6 right-6 z-50">
            {showTooltip && !isOpen && (
              <div className="absolute bottom-16 right-0 bg-gradient-to-r from-primary to-accent text-white px-3 py-2 rounded-xl text-xs whitespace-nowrap shadow-xl animate-fade-in max-w-48 border border-white/20">
                {t('tooltip')}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
              </div>
            )}
            
            {isOpen ? (
              <div className="w-72">
                <ChatContent />
              </div>
            ) : (
              <Button onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }} size="lg" className="rounded-full w-14 h-14 bg-gradient-to-r from-primary via-accent to-primary shadow-xl ring-4 ring-primary/20">
                <div className="relative">
                  <User className="w-5 h-5" />
                  <div className={cn(
                    "absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white",
                    agentsOnline ? "bg-green-400 animate-pulse" : "bg-red-400"
                  )}></div>
                </div>
              </Button>
            )}
          </div>

          {/* Mobile Full Screen Modal with image support */}
          <Dialog open={isMobileModalOpen} onOpenChange={setIsMobileModalOpen}>
            <DialogContent className="w-full h-full max-w-none max-h-none p-0 gap-0">
              <div className="flex flex-col h-full">
                <div className="bg-gradient-to-r from-primary via-accent to-primary p-4 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold">{t('assistantName')}</span>
                      <div className="text-white/80 text-xs">{t('onlineNow')}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsMobileModalOpen(false)} className="text-white hover:bg-white/20 h-10 w-10 p-0 relative z-10">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/30">
                  {messages.map((msg, index) => (
                    <div key={index} className={cn("flex gap-3 items-start", msg.isUser ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", msg.isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-r from-accent to-primary text-white")}>
                        {msg.isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                       <div className={cn("max-w-[75%] rounded-2xl shadow-sm", msg.isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-white text-foreground border border-border rounded-tl-sm")}>
                         {msg.imageUrl ? (
                           <div className="p-3">
                             <img 
                               src={msg.imageUrl} 
                               alt={msg.imageName || t('imageShared')} 
                               className="max-w-full max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                               onClick={() => window.open(msg.imageUrl, '_blank')}
                               loading="lazy"
                             />
                             {msg.text && <p className="mt-2">{msg.text}</p>}
                           </div>
                         ) : msg.isProductSuggestion && msg.products ? (
                           <div className="p-4">
                             <p className="mb-4">{msg.text}</p>
                             <div className="space-y-3">
                               {msg.products.map((product: any) => (
                                 <div key={product.id_product} className="flex gap-3 items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                   <img 
                                     src={`https://draminesaid.com/lucci/${product.img_product}`}
                                     alt={product.nom_product}
                                     className="w-16 h-16 object-cover rounded"
                                   />
                                   <div className="flex-1 min-w-0">
                                     <p className="font-medium truncate">{product.nom_product}</p>
                                     <p className="text-sm text-muted-foreground">{product.price_product}€</p>
                                   </div>
                                   <Button 
                                     size="sm" 
                                     variant="outline" 
                                     className="px-3 py-2"
                                     onClick={() => window.open(`/product/${product.id_product}`, '_blank')}
                                   >
                                     {t('productSuggestion.viewProduct')}
                                   </Button>
                                 </div>
                               ))}
                             </div>
                           </div>
                         ) : (
                           <div className="p-4">{msg.text}</div>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {showContactForm && (
                  <div className="p-4 border-t border-border bg-muted/50">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="mobile-name" className="text-sm font-medium">{t('form.fullName')}</Label>
                        <Input
                          id="mobile-name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder={t('form.fullNamePlaceholder')}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile-email" className="text-sm font-medium">{t('form.email')}</Label>
                        <Input
                          id="mobile-email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder={t('form.emailPlaceholder')}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile-phone" className="text-sm font-medium">{t('form.phone')}</Label>
                        <Input
                          id="mobile-phone"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder={t('form.phonePlaceholder')}
                          className="mt-2"
                        />
                      </div>
                      <Button 
                        onClick={handleContactSubmit} 
                        className="w-full bg-gradient-to-r from-primary to-accent"
                        disabled={!contactForm.name || !contactForm.email || !contactForm.phone}
                      >
                        {t('form.send')}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Show predefined questions only when agents are offline */}
                {showPredefinedQuestions && !agentsOnline && (
                  <div className="p-4 border-t border-border bg-muted/30">
                    <p className="text-sm font-medium text-muted-foreground mb-3">{t('frequentQuestions')}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {predefinedQuestions.map((question) => (
                        <Button
                          key={question.id}
                          onClick={() => handleQuestionClick(question)}
                          variant="outline"
                          className="h-auto p-3 text-sm border-border hover:bg-accent/50 flex flex-col items-start text-left"
                        >
                          <div className="font-medium text-sm truncate w-full">{question.text}</div>
                          <div className="text-muted-foreground text-xs mt-1 line-clamp-2 w-full">{question.description}</div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Mobile Input - Show only when user info collected or when agents offline with predefined questions */}
                {(userInfoCollected || (!agentsOnline && showPredefinedQuestions)) && (
                  <div className="sticky bottom-0 p-4 border-t border-border bg-card">
                    <div className="flex items-center gap-3">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      {/* Camera Button - Only show when agents are online */}
                      {agentsOnline && userInfoCollected && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {uploadingImage ? (
                            <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <Camera className="w-6 h-6" />
                          )}
                        </button>
                      )}
                      
                      {/* Text Input */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder={
                            agentsOnline && userInfoCollected 
                              ? t('typeMessage') 
                              : t('chooseQuestion')
                          }
                          disabled={!userInfoCollected && agentsOnline}
                          className="w-full px-4 py-3 rounded-full border border-border bg-muted/30 focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground text-base disabled:opacity-50"
                        />
                      </div>
                      
                      {/* Send Button */}
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || (!userInfoCollected && agentsOnline)}
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};
