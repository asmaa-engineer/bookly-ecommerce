"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ["Fiction", "Technology", "Mystery", "Lifestyle", "History", "Science"];

const Catalog = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedCategories, priceRange, minRating, sortBy]);

  const fetchBooks = async () => {
    let query = supabase.from('books').select('*');

    if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);
    if (selectedCategories.length > 0) query = query.in('category', selectedCategories);
    query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
    if (minRating > 0) query = query.gte('rating', minRating);

    if (sortBy === "price-low") query = query.order('price', { ascending: true });
    else if (sortBy === "price-high") query = query.order('price', { ascending: false });
    else if (sortBy === "rating") query = query.order('rating', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data } = await query;
    setBooks(data || []);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className={`fixed inset-0 z-50 bg-black md:relative md:bg-transparent md:block md:w-64 space-y-8 transition-transform ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-6 md:p-0 space-y-8">
              <div className="flex items-center justify-between md:hidden">
                <h2 className="text-2xl font-bold">Filters</h2>
                <Button variant="ghost" onClick={() => setShowFilters(false)}><X /></Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold uppercase tracking-widest text-xs text-white/40">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <div key={cat} className="flex items-center gap-3">
                      <Checkbox 
                        id={cat} 
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(prev => checked ? [...prev, cat] : prev.filter(c => c !== cat));
                        }}
                      />
                      <label htmlFor={cat} className="text-sm cursor-pointer">{cat}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold uppercase tracking-widest text-xs text-white/40">Price Range</h3>
                <Slider defaultValue={[0, 100]} max={100} step={1} value={priceRange} onValueChange={setPriceRange} className="py-4" />
                <div className="flex justify-between text-sm text-white/40"><span>$0</span><span>${priceRange[1]}</span></div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold uppercase tracking-widest text-xs text-white/40">Min Rating</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${minRating === r ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10'}`}>{r}+</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <Input placeholder="Search by title or author..." className="bg-white/5 border-white/10 pl-12 h-12 rounded-2xl" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <select className="bg-white/5 border-white/10 rounded-2xl h-12 px-4 text-sm outline-none focus:ring-1 ring-white/20" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rating</option>
                </select>
                <Button variant="outline" className="md:hidden h-12 rounded-2xl border-white/10 glass" onClick={() => setShowFilters(true)}><SlidersHorizontal size={18} /></Button>
              </div>
            </div>

            <p className="text-white/40 text-sm">{books.length} results found</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map(book => <BookCard key={book.id} {...book} />)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalog;