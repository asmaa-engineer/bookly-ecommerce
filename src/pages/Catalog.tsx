"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';

const ALL_BOOKS = [
  { id: "1", title: "The Echoes of Silence", author: "Elena Thorne", price: 24.99, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop", category: "Fiction", rating: 4.8 },
  { id: "2", title: "Digital Frontiers", author: "Marcus Chen", price: 19.99, image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop", category: "Technology", rating: 4.5 },
  { id: "3", title: "Midnight in Kyoto", author: "Satoshi Nakamoto", price: 22.50, image: "https://images.unsplash.com/photo-1543004218-ee141104638e?q=80&w=800&auto=format&fit=crop", category: "Mystery", rating: 4.9 },
  { id: "4", title: "The Art of Simplicity", author: "Sarah Jenkins", price: 15.00, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop", category: "Lifestyle", rating: 4.7 },
  { id: "5", title: "Beyond the Horizon", author: "David Vance", price: 28.00, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop", category: "Fiction", rating: 4.6 },
  { id: "6", title: "Code & Soul", author: "Aria Stark", price: 32.00, image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop", category: "Technology", rating: 4.9 },
  { id: "7", title: "The Last Alchemist", author: "Julian Black", price: 21.00, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop", category: "Mystery", rating: 4.4 },
  { id: "8", title: "Minimalist Living", author: "Kaito Lee", price: 18.50, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop", category: "Lifestyle", rating: 4.3 },
];

const CATEGORIES = ["All", "Fiction", "Technology", "Mystery", "Lifestyle"];

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredBooks = ALL_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter mb-4">EXPLORE CATALOG</h1>
              <p className="text-white/40">Discover thousands of stories waiting for you.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <Input 
                  placeholder="Search by title or author..." 
                  className="bg-white/5 border-white/10 pl-12 h-12 rounded-2xl focus:ring-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-12 rounded-2xl border-white/10 glass px-6">
                <SlidersHorizontal className="mr-2" size={18} />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? "bg-white text-black" 
                    : "glass text-white/60 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 glass-dark rounded-[40px]">
              <p className="text-white/40 text-xl">No books found matching your criteria.</p>
              <Button 
                variant="link" 
                className="text-white mt-4"
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Catalog;