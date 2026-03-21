"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { chatWithAI } from '@/lib/gemini';
import BookCard from './BookCard';

interface Message {
  role: 'ai' | 'user';
  content: string;
  books?: any[];
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hi! I'm Bookly AI. I can recommend books based on your mood or interests. What are you looking for today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResult = await chatWithAI(text, messages);
      let foundBooks: any[] = [];

      if (aiResult.intent === "search" && aiResult.keywords) {
        const { data } = await supabase
          .from('books')
          .select('*')
          .or(`title.ilike.%${aiResult.keywords}%,category.ilike.%${aiResult.keywords}%,author.ilike.%${aiResult.keywords}%`)
          .limit(3);
        foundBooks = data || [];
      }

      setTimeout(() => {
        setIsTyping(false);
        const aiResponse: Message = { 
          role: 'ai', 
          content: foundBooks.length > 0 
            ? `I found these books for you:` 
            : aiResult.text,
          books: foundBooks.length > 0 ? foundBooks : undefined
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);

    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-white text-black shadow-2xl hover:scale-110 transition-transform border-none"
        >
          <Bot size={32} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
        </Button>
      ) : (
        <div className="w-[400px] h-[600px] glass-dark rounded-[40px] flex flex-col overflow-hidden border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <Bot className="text-black" size={24} />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tight">Bookly AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Always Learning</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-white/10">
              <X size={20} />
            </Button>
          </div>

          {/* Chat Area */}
          <ScrollArea className="flex-grow p-6" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-white text-black font-medium rounded-tr-none' 
                      : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.books && msg.books.length > 0 && (
                    <div className="w-full mt-4 grid grid-cols-1 gap-4">
                      {msg.books.map(book => (
                        <div key={book.id} className="scale-95 origin-left">
                          <BookCard {...book} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-[24px] rounded-tl-none border border-white/10 flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 bg-white/5 border-t border-white/10">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
              {["Recommend a thriller", "Best Sci-Fi books", "Books for motivation"].map(q => (
                <button 
                  key={q} 
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
              <Input 
                placeholder="Ask Bookly AI..." 
                className="bg-white/5 border-white/10 rounded-2xl pr-14 h-14 focus:ring-white/20 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;