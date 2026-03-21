"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

const FEATURED_BOOKS = [
  { id: "1", title: "The Echoes of Silence", author: "Elena Thorne", price: 24.99, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop", category: "Fiction", rating: 4.8 },
  { id: "2", title: "Digital Frontiers", author: "Marcus Chen", price: 19.99, image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop", category: "Technology", rating: 4.5 },
  { id: "3", title: "Midnight in Kyoto", author: "Satoshi Nakamoto", price: 22.50, image: "https://images.unsplash.com/photo-1543004218-ee141104638e?q=80&w=800&auto=format&fit=crop", category: "Mystery", rating: 4.9 },
  { id: "4", title: "The Art of Simplicity", author: "Sarah Jenkins", price: 15.00, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop", category: "Lifestyle", rating: 4.7 }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto mb-32 text-center relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -z-10" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-float">
            <Sparkles size={16} className="text-white" />
            <span className="text-xs font-medium tracking-wider uppercase">AI-Powered Recommendations</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            DISCOVER YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">NEXT CHAPTER</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-white/50 mb-12 leading-relaxed">
            Immerse yourself in a curated collection of literary masterpieces. 
            Experience the future of book shopping with our glassmorphism interface.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/catalog">
              <Button size="lg" className="rounded-full px-8 h-14 bg-white text-black hover:bg-white/90 text-lg font-bold">
                Explore Catalog
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/wishlist">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 border-white/10 glass hover:bg-white/5 text-lg">
                View Wishlist
              </Button>
            </Link>
          </div>
        </section>

        {/* Featured Section */}
        <section className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Picks</h2>
              <p className="text-white/40">Hand-selected stories for your collection.</p>
            </div>
            <Link to="/catalog">
              <Button variant="link" className="text-white hover:text-white/70">
                View all books
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_BOOKS.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </section>

        {/* AI Section Preview */}
        <section className="max-w-7xl mx-auto mt-32">
          <div className="glass-dark rounded-[40px] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent" />
            
            <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
                Personalized AI <br /> Recommendations
              </h2>
              <p className="text-white/50 text-lg mb-10 leading-relaxed">
                Our intelligent system analyzes your reading habits and preferences to suggest 
                books that resonate with your soul.
              </p>
              <Link to="/catalog">
                <Button className="rounded-full px-8 h-12 bg-white text-black hover:bg-white/90">
                  Get Started
                </Button>
              </Link>
            </div>
            
            <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 w-80 h-[400px] glass rounded-3xl rotate-6 animate-float">
              <div className="p-6 space-y-4">
                <div className="w-full h-48 bg-white/10 rounded-xl" />
                <div className="h-4 w-3/4 bg-white/20 rounded" />
                <div className="h-4 w-1/2 bg-white/10 rounded" />
                <div className="pt-4 flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20" />
                  <div className="h-8 w-8 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <BookOpen className="text-black" size={16} />
            </div>
            <span className="text-lg font-bold tracking-tighter">BOOKLY</span>
          </div>
          <p className="text-white/30 text-sm">© 2024 Bookly. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;