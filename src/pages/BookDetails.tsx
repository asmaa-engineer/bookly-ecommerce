"use client";

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const ALL_BOOKS = [
  { id: "1", title: "The Echoes of Silence", author: "Elena Thorne", price: 24.99, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop", category: "Fiction", rating: 4.8, description: "A hauntingly beautiful exploration of memory and loss in a world that has forgotten how to speak. Elena Thorne's masterpiece takes readers on a journey through the silent corridors of the human heart." },
  { id: "2", title: "Digital Frontiers", author: "Marcus Chen", price: 19.99, image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop", category: "Technology", rating: 4.5, description: "Marcus Chen explores the intersection of humanity and artificial intelligence in this groundbreaking work. A must-read for anyone interested in the future of our digital existence." },
  // ... other books would be here
];

const BookDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const book = ALL_BOOKS.find(b => b.id === id) || ALL_BOOKS[0];
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="relative group">
              <div className="absolute -inset-4 bg-white/5 rounded-[40px] blur-2xl group-hover:bg-white/10 transition-all" />
              <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden glass-dark border-white/10">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
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
                    <span className="text-xl font-bold text-white">{book.rating}</span>
                    <span className="text-white/40 text-sm">(1.2k reviews)</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-white/60">
                    <BookOpen size={20} />
                    <span className="text-sm font-medium">342 Pages</span>
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
                  onClick={() => addToCart(book)}
                >
                  <ShoppingCart className="mr-3" size={24} />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;