"use client";

import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'ai', content: "Hi! I'm Bookly AI. What kind of book are you looking for?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    // Simple response
    setTimeout(() => {
      setIsTyping(false);
      let response = "";
      const lowerMsg = text.toLowerCase();
      
      if (lowerMsg.includes("thriller")) {
        response = "I recommend checking out our thriller section! Try looking for books by Dan Brown or Gillian Flynn.";
      } else if (lowerMsg.includes("sci-fi") || lowerMsg.includes("science fiction")) {
        response = "Sci-fi is amazing! Check out Dune by Frank Herbert or The Martian by Andy Weir.";
      } else if (lowerMsg.includes("motivation")) {
        response = "For motivation, I recommend Atomic Habits by James Clear or The 7 Habits of Highly Effective People.";
      } else {
        response = "I can help you find books! Try asking for 'thriller', 'sci-fi', or 'motivation' books.";
      }
      
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    }, 1000);
  };

  const suggestedQuestions = ["Recommend a thriller", "Best Sci-Fi books", "Books for motivation"];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-white text-black shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
        >
          <Bot size={28} />
        </button>
      ) : (
        <div className="w-[380px] h-[550px] bg-black/90 backdrop-blur-xl rounded-2xl flex flex-col overflow-hidden border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-white" />
              <span className="font-bold text-white">Bookly AI</span>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-white text-black rounded-br-none' 
                    : 'bg-white/10 text-white rounded-bl-none border border-white/10'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-2 rounded-2xl rounded-bl-none flex gap-1">
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Questions */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/10 bg-white/5">
            {suggestedQuestions.map(q => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-full bg-white/10 text-xs text-white/80 whitespace-nowrap hover:bg-white hover:text-black transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Bookly AI..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;