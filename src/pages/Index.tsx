"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import MoodSelector from '@/components/MoodSelector';
import AIChatbot from '@/components/AIChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Sparkles, Mail, RefreshCw, History, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRecentlyViewed } from '@/hooks/use-personalization';
import { showSuccess, showError } from '@/utils/toast';
import { analyzeUserMood } from '@/lib/gemini';

const Index = () => {
  const { user } = useAuth();
  const { recentBooks } = useRecentlyViewed();
  const [aiPicks, setAiPicks] = useState<any[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);
  const [moodBooks, setMoodBooks] = useState<any[]>([]);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const { data: featured } = await supabase.from('books').select('*').limit(4);
    setFeaturedBooks(featured || []);
    await fetchAIPicks();
    setLoading(false);
  };

  const fetchAIPicks = async () => {
    setAiLoading(true);
    try {
      let query = supabase.from('books').select('*');
      
      if (user) {
        const { data: profile } = await supabase.from('user_profiles').select('favorite_categories').eq('id', user.id).single();
        if (profile?.favorite_categories?.length > 0) {
          query = query.in('category', profile.favorite_categories);
        } else {
          query = query.order('rating', { ascending: false });
        }
      } else {
        query = query.order('rating', { ascending: false });
      }

      const { data: picks } = await query.limit(4);
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
    const { data } = await supabase
      .from('books')
      .select('*')
      .in('category', categories)
      .limit(4);
    setMoodBooks(data || []);
    
    // Scroll to mood section
    document.getElementById('mood-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('newsletter').insert([{ email }]);
    if (error) showError(error.message);
    else {
      showSuccess('Subscribed successfully!');
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto mb-32 text-center relative py-24 rounded-[60px] overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src="/images/hero-bg.jpg" alt="Hero" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-float">
              <Sparkles size={16} className="text-white" />
              <span className="text-xs font-medium tracking-wider uppercase">AI-Powered Recommendations</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
              {user ? `WELCOME BACK, ${user.user_metadata?.full_name?.split(' ')[0].toUpperCase()}` : 'DISCOVER YOUR'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">NEXT CHAPTER</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/50 mb-12">
              Immerse yourself in a curated collection of literary masterpieces, tailored to your unique taste.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/catalog">
                <Button size="lg" className="rounded-full px-8 h-14 bg-white text-black hover:bg-white/90 text-lg font-bold">
                  Explore Catalog <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mood Selector */}
        <section className="max-w-7xl mx-auto mb-32">
          <MoodSelector onMoodSelect={handleMoodSelect} activeMood={activeMood} />
          {activeMood && (
            <div id="mood-results" className="mt-12 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                Books for your {activeMood} mood
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {moodBooks.map(book => <BookCard key={book.id} {...book} />)}
              </div>
            </div>
          )}
        </section>

        {/* AI Picks Section */}
        <section className="max-w-7xl mx-auto mb-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                ✨ AI Picks For You
              </h2>
              <p className="text-white/40">Smart recommendations based on your preferences.</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-white/40 hover:text-white" 
              onClick={fetchAIPicks}
              disabled={aiLoading}
            >
              <RefreshCw size={18} className={`mr-2 ${aiLoading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] rounded-3xl bg-white/5" />
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                  <Skeleton className="h-4 w-1/2 bg-white/5" />
                </div>
              ))
            ) : (
              aiPicks.map(book => (
                <div key={book.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-xl">
                    AI RECOMMENDED ✨
                  </div>
                  <BookCard {...book} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentBooks.length > 0 && (
          <section className="max-w-7xl mx-auto mb-32">
            <h2 className="text-3xl font-bold tracking-tight mb-12 flex items-center gap-3">
              <History className="text-white/40" /> Recently Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentBooks.map(book => <BookCard key={book.id} {...book} />)}
            </div>
          </section>
        )}

        {/* Featured Section */}
        <section className="max-w-7xl mx-auto mb-32">
          <h2 className="text-3xl font-bold tracking-tight mb-12">Featured Picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBooks.map(book => <BookCard key={book.id} {...book} />)}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="max-w-7xl mx-auto">
          <div className="glass-dark rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <Mail className="mx-auto mb-6 text-white/40" size={48} />
              <h2 className="text-4xl font-bold mb-6">Join the Bookly Newsletter</h2>
              <p className="text-white/50 text-lg mb-10">Get weekly recommendations and exclusive offers delivered to your inbox.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <Input 
                  placeholder="Enter your email address" 
                  className="bg-white/5 border-white/10 h-14 rounded-2xl px-6" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
                <Button type="submit" className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 font-bold">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <AIChatbot />
    </div>
  );
};

export default Index;