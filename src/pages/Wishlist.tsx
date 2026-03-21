"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-48 pb-20 px-6 text-center">
          <div className="max-w-md mx-auto glass rounded-[48px] p-16 border-white/5">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10">
              <Heart className="text-white/20" size={48} />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Your wishlist is empty</h1>
            <p className="text-white/40 mb-10 font-medium">Save books you love to find them easily later.</p>
            <Link to="/catalog">
              <Button className="rounded-full px-10 h-14 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs">
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
          <h1 className="text-6xl font-black tracking-tighter mb-16 uppercase">YOUR WISHLIST</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {wishlist.map((book) => (
              <div key={book.id} className="group glass rounded-[40px] p-5 border-white/5 transition-all duration-500 hover:-translate-y-2">
                <Link to={`/book/${book.id}`} className="block mb-6">
                  <div className="aspect-[2/3] rounded-[32px] overflow-hidden shadow-2xl">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                </Link>
                
                <div className="space-y-2 mb-6">
                  <h3 className="font-black text-xl uppercase tracking-tight line-clamp-1">{book.title}</h3>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{book.author}</p>
                  <p className="text-2xl font-black tracking-tighter pt-2">${book.price}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="rounded-2xl h-12 bg-white text-black hover:bg-white/90 font-black uppercase text-[10px] tracking-widest"
                    onClick={() => {
                      addToCart({ id: book.id, title: book.title, price: book.price, image: book.image });
                      toggleWishlist(book);
                    }}
                  >
                    <ShoppingCart size={14} className="mr-2" />
                    Move
                  </Button>
                  <Button 
                    variant="outline"
                    className="rounded-2xl h-12 border-white/10 glass text-white/40 hover:text-red-500 hover:bg-red-500/10 font-black uppercase text-[10px] tracking-widest"
                    onClick={() => toggleWishlist(book)}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wishlist;