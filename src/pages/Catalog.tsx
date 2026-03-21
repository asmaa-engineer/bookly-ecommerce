"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ["Fiction", "Sci-Fi", "Fantasy", "Self Development", "Thriller", "Mystery", "Biography", "Psychology", "Science"];

const Catalog = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedCategories, priceRange, minRating, sortBy]);

  const fetchBooks = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className={`fixed inset-0 z-50 bg-black md:relative md:bg-transparent md:block md:w-72 space-y-10 transition-transform ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-8 md:p-0 space-y-10 h-full overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between md:hidden">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Filters</h2>
                <Button variant="ghost" onClick={() => setShowFilters(false)} className="rounded-full"><X /></Button>
              </div>

              <div className="space-y-6">
                <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-white/40 flex items-center gap-2">
                  <Filter size={14} /> Categories
                </h3>
                <div className="space-y-3">
                  {CATEGORIES.map(cat => (
                    <div key={cat} className="flex items-center gap-3 group cursor-pointer">
                      <Checkbox 
                        id={cat} 
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(prev => checked ? [...prev, cat] : prev.filter(c => c !== cat));
                        }}
                        className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor={cat} className="text-sm font-bold text-white/60 group-hover:text-white cursor-pointer transition-colors">{cat}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-white/40">Price Range</h3>
                <Slider 
                  defaultValue={[0, 200]} 
                  max={200} 
                  step={1} 
                  value={priceRange} 
                  onValueChange={setPriceRange} 
                  className="py-4" 
                />
                <div className="flex justify-between text-xs font-black text-white/40">
                  <span>$0</span>
                  <span className="text-white">${priceRange[1]}</span>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-white/40">Min Rating</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button 
                      key={r} 
                      onClick={() => setMinRating(r)} 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${minRating === r ? 'bg-white text-black scale-110' : 'bg-white/5 hover:bg-white/10 text-white/40'}`}
                    >
                      {r}+
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full rounded-2xl border-white/10 glass text-[10px] font-black uppercase tracking-widest h-12"
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([0, 200]);
                  setMinRating(0);
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow space-y-10">
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                <Input 
                  placeholder="Search by title or author..." 
                  className="bg-white/5 border-white/10 pl-14 h-14 rounded-[20px] focus:ring-white/20 text-lg" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                />
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <select 
                  className="bg-white/5 border-white/10 rounded-[20px] h-14 px-6 text-xs font-black uppercase tracking-widest outline-none focus:ring-1 ring-white/20 appearance-none cursor-pointer min-w-[180px]" 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rating</option>
                </select>
                <Button 
                  variant="outline" 
                  className="md:hidden h-14 w-14 rounded-[20px] border-white/10 glass" 
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal size={20} />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-white/40 text-xs font-black uppercase tracking-widest">{books.length} results found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] rounded-[40px] bg-white/5 animate-pulse" />
                ))
              ) : (
                books.map(book => <BookCard key={book.id} {...book} />)
              )}
            </div>
            
            {books.length === 0 && !loading && (
              <div className="text-center py-40 glass rounded-[40px] border-white/5">
                <Search size={64} className="mx-auto mb-6 text-white/10" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No books found</h3>
                <p className="text-white/40 font-medium">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalog;