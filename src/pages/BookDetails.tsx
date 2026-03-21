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
      
      // Fetch related books
      const { data: related } = await supabase
        .from('books')
        .select('*')
        .eq('category', bookRes.data.category)
        .neq('id', id)
        .limit(4);
      setRelatedBooks(related || []);

      // Generate AI Summary
      if (reviewsRes.data && reviewsRes.data.length > 0) {
        const summary = await generateReviewSummary(reviewsRes.data);
        setReviewSummary(summary);
      }
    }
    setReviews(reviewsRes.data || []);
    setLoading(false);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return showError("Please login to leave a review");

    const { error } = await supabase.from('reviews').insert([{
      user_id: user.id,
      book_id: id,
      rating: newReview.rating,
      comment: newReview.comment
    }]);

    if (error) showError(error.message);
    else {
      showSuccess("Review added!");
      setNewReview({ rating: 5, comment: '' });
      fetchBookData();
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" /></div>;
  if (!book) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Book not found</div>;

  const isWishlisted = isInWishlist(book.id);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/catalog" className="inline-flex items-center text-white/40 hover:text-white mb-12 transition-colors">
            <ArrowLeft className="mr-2" size={20} />
            Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-32">
            <div className="relative group">
              <div className="absolute -inset-4 bg-white/5 rounded-[40px] blur-2xl group-hover:bg-white/10 transition-all" />
              <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden glass-dark border-white/10">
                <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/10 text-white border-white/10 px-4 py-1 rounded-full">
                  {book.category}
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                  {book.title}
                </h1>
                <p className="text-2xl text-white/60 font-medium">by {book.author}</p>
                
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Star fill="currentColor" size={20} />
                    <span className="text-xl font-bold text-white">{book.rating || 'N/A'}</span>
                    <span className="text-white/40 text-sm">({reviews.length} reviews)</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-white/60">
                    <BookOpen size={20} />
                    <span className="text-sm font-medium">{book.stock_count > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-white/50 leading-relaxed max-w-xl">
                {book.description}
              </p>

              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-bold">${book.price}</span>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`rounded-full w-12 h-12 border-white/10 glass ${isWishlisted ? 'bg-white text-black' : ''}`}
                      onClick={() => toggleWishlist(book)}
                    >
                      <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/10 glass">
                      <Share2 size={20} />
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full h-16 rounded-2xl bg-white text-black hover:bg-white/90 text-xl font-bold"
                  onClick={() => addToCart({ id: book.id, title: book.title, price: book.price, image: book.image_url })}
                  disabled={book.stock_count === 0}
                >
                  <ShoppingCart className="mr-3" size={24} />
                  {book.stock_count > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>

          {/* AI Review Summary */}
          {reviewSummary && (
            <section className="max-w-3xl mb-32">
              <div className="glass-dark p-8 rounded-[32px] border border-white/10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-white/40" />
                  What readers are saying
                </h3>
                <p className="text-white/70 leading-relaxed italic">
                  "{reviewSummary}"
                </p>
              </div>
            </section>
          )}

          {/* Readers Also Enjoyed */}
          {relatedBooks.length > 0 && (
            <section className="mb-32">
              <h2 className="text-3xl font-bold mb-12">Readers Also Enjoyed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedBooks.map(rb => <BookCard key={rb.id} {...rb} />)}
              </div>
            </section>
          )}

          {/* Reviews Section */}
          <section className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
              <MessageSquare className="text-white/40" />
              Reader Reviews
            </h2>

            {user && (
              <div className="glass-dark p-8 rounded-[32px] mb-12">
                <h3 className="text-xl font-bold mb-6">Write a Review</h3>
                <form onSubmit={handleAddReview} className="space-y-6">
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button 
                        key={r} 
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: r})}
                        className={`p-2 rounded-lg transition-colors ${newReview.rating >= r ? 'text-yellow-500' : 'text-white/10'}`}
                      >
                        <Star fill="currentColor" size={24} />
                      </button>
                    ))}
                  </div>
                  <Textarea 
                    placeholder="Share your thoughts on this book..." 
                    className="bg-white/5 border-white/10 rounded-2xl min-h-[120px]"
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    required
                  />
                  <Button type="submit" className="bg-white text-black hover:bg-white/90 rounded-xl px-8">
                    Post Review
                  </Button>
                </form>
              </div>
            )}

            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="glass-dark p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold">{review.user_profiles?.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-white/40">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">{review.comment}</p>
                </div>
              )) : (
                <p className="text-white/40 text-center py-12">No reviews yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;