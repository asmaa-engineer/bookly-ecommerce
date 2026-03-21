"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, StarHalf } from 'lucide-react';
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
  review_count?: number;
}

const BookCard = ({ id, title, author, price, image_url, image, category, rating, review_count = 12 }: BookCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(id);
  const displayImage = image_url || image || '/placeholder.svg';

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={cn(i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-white/20")} 
      />
    ));
  };

  return (
    <div className="group relative glass-card rounded-[32px] p-4 transition-all duration-500 hover:-translate-y-2">
      <Link to={`/book/${id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[24px] mb-4 shadow-2xl">
          <img 
            src={displayImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Badge className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
            {category}
          </Badge>
        </div>
      </Link>

      <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button 
          size="icon" 
          variant="secondary" 
          className={cn(
            "rounded-full w-10 h-10 glass border-white/10 transition-all hover:scale-110",
            isWishlisted ? "bg-white text-black" : "bg-black/40 text-white hover:bg-white hover:text-black"
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({ id, title, author, price, image: displayImage, category, rating });
          }}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </Button>
      </div>

      <div className="space-y-2 px-1">
        <div className="flex items-center gap-1 mb-1">
          {renderStars(rating)}
          <span className="text-[10px] text-white/40 font-bold ml-1">({review_count})</span>
        </div>
        
        <Link to={`/book/${id}`}>
          <h3 className="font-bold text-lg leading-tight line-clamp-1 text-white group-hover:text-white/80 transition-colors uppercase tracking-tight">
            {title}
          </h3>
        </Link>
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider">{author}</p>
        
        <div className="flex items-center justify-between pt-3">
          <span className="text-xl font-black tracking-tighter">${price}</span>
          <Button 
            size="sm" 
            className="rounded-full h-10 px-5 bg-white text-black hover:bg-white/90 font-bold uppercase text-[10px] tracking-widest transition-transform hover:scale-105"
            onClick={() => addToCart({ id, title, price, image: displayImage })}
          >
            <ShoppingCart size={14} className="mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;