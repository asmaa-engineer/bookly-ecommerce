"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, BookOpen, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRecentlyViewed } from '@/hooks/use-personalization';
import { showError, showSuccess } from '@/utils/toast';
import { generateReviewSummary } from '@/lib/gemini';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addViewedBook } = useRecentlyViewed();
  
  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
  const [reviewSummary, setReviewSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchBookData();
  }, [id]);

  const fetchBookData = async () => {
    setLoading(true);
    const [bookRes, reviewsRes] = await Promise.all([
      supabase.from('books').select('*').eq('id', id).single(),
      supabase.from('reviews').select('*, user_profiles(full_name)').eq('book_id', id)
    ]);

    if (bookRes.data) {
      setBook(bookRes.data);
      addViewedBook(bookRes.data);
      const { data: related } = await supabase.from('books').select('*').eq('category', bookRes.data.category).neq('id', id).limit(4);
      setRelatedBooks(related || []);
      if (reviewsRes.data && reviewsRes.data.length > 0) {
        const summary = await generateReviewSummary(reviewsRes.data);
        setReviewSummary(summary);
      }
    }
    setReviews(reviewsRes.data || []);
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" /></div>;
  if (!book) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Book not found</div>;

  const isWishlisted = isInWishlist(book.id);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/catalog" className="inline-flex items-center text-white/40 hover:text-white mb-16 transition-colors font-bold uppercase tracking-widest text-xs">
            <ArrowLeft className="mr-2" size={16} />
            Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-40">
            <div className="relative group">
              <div className="absolute -inset-10 bg-white/5 rounded-[60px] blur-[80px] group-hover:bg-white/10 transition-all duration-700" />
              <div className="relative aspect-[3/4] rounded-[48px] overflow-hidden glass border-white/10 shadow-2xl">
                <img src={book.image_url} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-6">
                <Badge className="bg-white/10 text-white border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  {book.category}
                </Badge>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] uppercase">
                  {book.title}
                </h1>
                <p className="text-3xl text-white/40 font-bold tracking-tight">by {book.author}</p>
                
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Star fill="currentColor" size={24} />
                    <span className="text-2xl font-black text-white">{book.rating || 'N/A'}</span>
                    <span className="text-white/20 text-sm font-bold">({reviews.length} REVIEWS)</span>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="flex items-center gap-3 text-white/40">
                    <BookOpen size={24} />
                    <span className="text-sm font-black uppercase tracking-widest">{book.stock_count > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>
              </div>

              <p className="text-xl text-white/40 leading-relaxed max-w-xl font-medium">
                {book.description}
              </p>

              <div className="pt-12 border-t border-white/10">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-6xl font-black tracking-tighter">${book.price}</span>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`rounded-full w-16 h-16 border-white/10 glass transition-all ${isWishlisted ? 'bg-white text-black' : 'hover:scale-110'}`}
                      onClick={() => toggleWishlist(book)}
                    >
                      <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full w-16 h-16 border-white/10 glass hover:scale-110">
                      <Share2 size={24} />
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full h-20 rounded-[32px] bg-white text-black hover:bg-white/90 text-2xl font-black uppercase tracking-tighter transition-transform hover:scale-[1.02]"
                  onClick={() => addToCart({ id: book.id, title: book.title, price: book.price, image: book.image_url })}
                  disabled={book.stock_count === 0}
                >
                  <ShoppingCart className="mr-4" size={28} />
                  {book.stock_count > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>

          {/* AI Review Summary */}
          {reviewSummary && (
            <section className="max-w-4xl mb-40">
              <div className="glass p-12 rounded-[48px] border border-white/10 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter">
                  <Sparkles size={28} className="text-white/40" />
                  What readers are saying
                </h3>
                <p className="text-2xl text-white/60 leading-relaxed italic font-medium">
                  "{reviewSummary}"
                </p>
              </div>
            </section>
          )}

          {/* Readers Also Enjoyed */}
          {relatedBooks.length > 0 && (
            <section className="mb-40">
              <h2 className="text-4xl font-black mb-16 uppercase tracking-tighter">Readers Also Enjoyed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {relatedBooks.map(rb => <BookCard key={rb.id} {...rb} />)}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookDetails;