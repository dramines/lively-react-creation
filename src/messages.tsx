import { useState, useEffect } from 'react';
import { Message } from './types';

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Fix the category issue when setting messages
  const processMessages = (messages: any[]) => {
    return messages.map(message => ({
      ...message,
      category: message.category as 'inbox' | 'sent' | 'archived' | 'draft'
    }));
  };
  
  // Use the processed messages in your component
  useEffect(() => {
    // Example code - replace with your actual implementation 
    const fetchedMessages = []; // Your fetched messages
    setMessages(processMessages(fetchedMessages));
  }, []);
  
  return (
    <div>
      {/* Your messages component UI */}
    </div>
  );
};

export default Messages;
