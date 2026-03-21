"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        const { data } = await supabase
          .from('books')
          .select('*')
          .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
          .limit(5);
        setResults(data || []);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <Input 
          placeholder="Search by title or author..." 
          className="bg-white/5 border-white/10 pl-12 h-12 rounded-2xl focus:ring-white/20"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-dark rounded-3xl border border-white/10 overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="p-2">
            {results.map((book) => (
              <Link 
                key={book.id} 
                to={`/book/${book.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
              >
                <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                  <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-sm truncate group-hover:text-white transition-colors">
                    {book.title.split(new RegExp(`(${query})`, 'gi')).map((part, i) => 
                      part.toLowerCase() === query.toLowerCase() 
                        ? <span key={i} className="text-white bg-white/20 rounded-sm px-0.5">{part}</span> 
                        : part
                    )}
                  </h4>
                  <p className="text-xs text-white/40 truncate">{book.author}</p>
                </div>
                <BookOpen size={14} className="text-white/20 group-hover:text-white/60" />
              </Link>
            ))}
          </div>
          <div className="p-3 bg-white/5 border-t border-white/10 text-center">
            <Link to="/catalog" className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white">
              View All Results
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;