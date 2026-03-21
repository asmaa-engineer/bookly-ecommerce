"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  image_url?: string;
  image?: string;
  category: string;
  rating: number;
}

const BookCard = ({ id, title, author, price, image_url, image, category, rating }: BookCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(id);
  const displayImage = image_url || image || '';

  return (
    <div className="group relative glass rounded-[40px] p-5 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)]">
      <Link to={`/book/${id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] mb-6">
          <img 
            src={displayImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Badge className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-xl border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5">
            {category}
          </Badge>
        </div>
      </Link>

      <div className="absolute top-8 right-8 z-10">
        <Button 
          size="icon" 
          variant="secondary" 
          className={cn(
            "rounded-full w-12 h-12 bg-black/40 backdrop-blur-xl border-white/10 transition-all duration-500 hover:scale-110",
            isWishlisted ? "bg-white text-black" : "hover:bg-white hover:text-black"
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({ id, title, author, price, image: displayImage, category, rating });
          }}
        >
          <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </Button>
      </div>

      <div className="space-y-3 px-2">
        <div className="flex items-center gap-1.5 text-yellow-500">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-black text-white/60">{rating}</span>
        </div>
        <Link to={`/book/${id}`}>
          <h3 className="font-black text-xl leading-tight line-clamp-1 uppercase tracking-tighter group-hover:text-white/70 transition-colors">{title}</h3>
        </Link>
        <p className="text-sm font-bold text-white/30 uppercase tracking-widest">{author}</p>
        
        <div className="flex items-center justify-between pt-4">
          <span className="text-2xl font-black tracking-tighter">${price}</span>
          <Button 
            size="sm" 
            className="rounded-full h-12 px-6 bg-white text-black hover:bg-white/90 font-black uppercase text-xs tracking-widest transition-transform hover:scale-105"
            onClick={() => addToCart({ id, title, price, image: displayImage })}
          >
            <ShoppingCart size={16} className="mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;