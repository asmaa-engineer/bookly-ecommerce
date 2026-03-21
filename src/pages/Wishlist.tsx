"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { useWishlist } from '@/context/WishlistContext';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-48 pb-20 px-6 text-center">
          <div className="max-w-md mx-auto glass-dark rounded-[40px] p-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="text-white/20" size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-white/40 mb-8">Save books you love to find them easily later.</p>
            <Link to="/">
              <Button className="rounded-full px-8 h-12 bg-white text-black hover:bg-white/90">
                Explore Books
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tighter mb-12">YOUR WISHLIST</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wishlist;