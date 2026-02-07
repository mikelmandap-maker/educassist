import React, { useState, useEffect, useRef } from 'react';
import { useAppData } from '../hooks/useAppData';
import { MessageSquare, Send, X, ChevronsDown } from 'lucide-react';
// FIX: Import 'formatDistanceToNow' from its specific sub-package in date-fns.
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const Chatbox: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, setChatMessages } = useAppData();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && lastMessage.sender === 'You') {
      const timer = setTimeout(() => {
        const reply = {
          id: `msg${Date.now()}`,
          sender: 'Dr. Evelyn Reed',
          text: "Thanks for the update! I'll take a look.",
          timestamp: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, reply]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [chatMessages, setChatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      id: `msg${Date.now()}`,
      sender: 'You',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-110"
        title="Open Team Chat"
        aria-label="Open Team Chat"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-40">
      <header className="bg-primary-600 text-white p-3 flex justify-between items-center rounded-t-lg">
        <h3 className="font-bold">Team Chat</h3>
        <button onClick={() => setIsChatOpen(false)} className="p-1 rounded-full hover:bg-primary-700" aria-label="Close chat">
          <ChevronsDown size={20} />
        </button>
      </header>

      <div className="flex-1 p-3 overflow-y-auto">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex flex-col mb-3 ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-xs p-2 rounded-lg ${msg.sender === 'You'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {msg.sender === 'You' ? `You, ${formatDistanceToNow(new Date(msg.timestamp))} ago` : `${msg.sender}, ${formatDistanceToNow(new Date(msg.timestamp))} ago`}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-2 border-t dark:border-gray-700 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button type="submit" className="ml-2 p-2 text-primary-600 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50" disabled={!newMessage.trim()} aria-label="Send message">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;