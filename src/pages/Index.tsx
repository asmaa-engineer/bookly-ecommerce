"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import MoodSelector from '@/components/MoodSelector';
import AIChatbot from '@/components/AIChatbot';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Sparkles, RefreshCw, TrendingUp, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { analyzeUserMood } from '@/lib/gemini';

const Index = () => {
  const { user } = useAuth();
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [aiPicks, setAiPicks] = useState<any[]>([]);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [moodBooks, setMoodBooks] = useState<any[]>([]);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const { data: books } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    setAllBooks(books || []);
    
    const { data: topRated } = await supabase.from('books').select('*').order('rating', { ascending: false }).limit(4);
    setBestsellers(topRated || []);
    
    await fetchAIPicks();
    setLoading(false);
  };

  const fetchAIPicks = async () => {
    setAiLoading(true);
    try {
      const { data: picks } = await supabase.from('books').select('*').order('rating', { ascending: false }).limit(6);
      setAiPicks(picks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleMoodSelect = async (mood: string) => {
    setActiveMood(mood);
    const categories = analyzeUserMood(mood);
    const { data } = await supabase.from('books').select('*').in('category', categories).limit(4);
    setMoodBooks(data || []);
    document.getElementById('mood-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto mb-32 text-center relative py-40 rounded-[60px] overflow-hidden border border-white/5">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
          </div>

          <div className="relative z-10 px-4">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass mb-8 animate-float">
              <Sparkles size={18} className="text-white" />
              <span className="text-xs font-black tracking-[0.3em] uppercase">Bookly AI – Discover Your Next Read</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase">
              READING <br />
              <span className="text-gradient">REIMAGINED</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-white/40 mb-12 font-medium leading-relaxed">
              Immerse yourself in a curated collection of literary masterpieces, tailored to your unique taste by our advanced AI.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link to="/catalog">
                <Button size="lg" className="rounded-full px-12 h-16 bg-white text-black hover:bg-white/90 text-lg font-black uppercase tracking-tighter transition-transform hover:scale-105">
                  Explore Catalog <ArrowRight className="ml-2" size={24} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* AI Picks Section */}
        <section className="max-w-7xl mx-auto mb-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-5xl font-black tracking-tighter mb-3 flex items-center gap-4 uppercase">
                <Sparkles className="text-white/40" size={40} /> AI Picks For You
              </h2>
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Smart recommendations based on your reading history.</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-white/40 hover:text-white rounded-full h-12 px-6 glass border-white/10" 
              onClick={fetchAIPicks}
              disabled={aiLoading}
            >
              <RefreshCw size={18} className={`mr-2 ${aiLoading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {aiLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[2/3] rounded-[32px] bg-white/5" />
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                </div>
              ))
            ) : (
              aiPicks.map(book => (
                <div key={book.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10 bg-white text-black text-[8px] font-black px-2 py-1 rounded-full shadow-2xl uppercase tracking-widest">
                    AI PICK
                  </div>
                  <BookCard {...book} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Mood Selector */}
        <section className="max-w-7xl mx-auto mb-32">
          <MoodSelector onMoodSelect={handleMoodSelect} activeMood={activeMood} />
          {activeMood && (
            <div id="mood-results" className="mt-12 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-3xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
                Books for your {activeMood} mood
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {moodBooks.map(book => <BookCard key={book.id} {...book} />)}
              </div>
            </div>
          )}
        </section>

        {/* Bestsellers Section */}
        <section className="max-w-7xl mx-auto mb-32">
          <h2 className="text-5xl font-black tracking-tighter mb-12 flex items-center gap-4 uppercase">
            <TrendingUp className="text-white/40" size={40} /> Bestsellers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellers.map(book => <BookCard key={book.id} {...book} />)}
          </div>
        </section>

        {/* All Books Grid */}
        <section className="max-w-7xl mx-auto mb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-5xl font-black tracking-tighter uppercase">All Collections</h2>
            <Link to="/catalog" className="text-white/40 hover:text-white font-black uppercase tracking-widest text-xs transition-colors">
              View All Catalog
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-[40px] bg-white/5" />
              ))
            ) : (
              allBooks.map(book => <BookCard key={book.id} {...book} />)
            )}
          </div>
        </section>
      </main>
      <AIChatbot />
    </div>
  );
};

export default Index;