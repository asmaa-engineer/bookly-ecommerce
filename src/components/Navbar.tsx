"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-full px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="text-black" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter">BOOKLY</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
          <Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <Input 
              placeholder="Search books..." 
              className="bg-white/5 border-white/10 pl-10 w-64 rounded-full focus:ring-white/20"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
              <Heart size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                <User size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;