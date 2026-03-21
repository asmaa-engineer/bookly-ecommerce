"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import BookCard from './BookCard';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm Bookly AI. Tell me what you'd like to read today..." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simple keyword matching for demo
    const keywords = text.toLowerCase();
    const { data: books } = await supabase
      .from('books')
      .select('*')
      .or(`title.ilike.%${keywords}%,category.ilike.%${keywords}%,author.ilike.%${keywords}%`)
      .limit(2);

    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = books && books.length > 0 
        ? `I found some books you might like based on "${text}":`
        : `I couldn't find specific books for "${text}", but check out our latest arrivals!`;
      
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      if (books) setRecommendations(prev => [...books, ...prev].slice(0, 2));
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-white text-black shadow-2xl hover:scale-110 transition-transform"
        >
          <Bot size={32} />
        </Button>
      ) : (
        <div className="w-[380px] h-[500px] glass-dark rounded-[32px] flex flex-col overflow-hidden border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bot className="text-black" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Bookly AI</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Online Assistant</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-white/10">
              <X size={20} />
            </Button>
          </div>

          <ScrollArea className="flex-grow p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' ? 'bg-white text-black' : 'bg-white/5 text-white/80'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              {recommendations.length > 0 && (
                <div className="grid grid-cols-1 gap-4 pt-4">
                  {recommendations.map(book => (
                    <div key={book.id} className="scale-90 origin-left">
                      <BookCard {...book} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 bg-white/5 border-t border-white/10">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
              {["Find me a novel", "Best self-development", "Books like Harry Potter"].map(q => (
                <button 
                  key={q} 
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] hover:bg-white/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
              <Input 
                placeholder="Ask me anything..." 
                className="bg-white/5 border-white/10 rounded-2xl pr-12 h-12"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1.5 top-1.5 h-9 w-9 rounded-xl bg-white text-black hover:bg-white/90"
              >
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;