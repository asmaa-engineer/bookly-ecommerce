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
  image: string;
  category: string;
  rating: number;
}

const BookCard = ({ id, title, author, price, image, category, rating }: BookCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(id);

  return (
    <div className="group relative glass-dark rounded-3xl p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-white/5">
      <Link to={`/book/${id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <Badge className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-md border-white/10 text-white">
            {category}
          </Badge>
        </div>
      </Link>

      <div className="absolute top-7 right-7 z-10">
        <Button 
          size="icon" 
          variant="secondary" 
          className={cn(
            "rounded-full bg-black/40 backdrop-blur-md border-white/10 transition-colors",
            isWishlisted ? "bg-white text-black" : "hover:bg-white hover:text-black"
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({ id, title, author, price, image, category, rating });
          }}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1 text-yellow-500">
          <Star size={14} fill="currentColor" />
          <span className="text-xs font-medium text-white/60">{rating}</span>
        </div>
        <Link to={`/book/${id}`}>
          <h3 className="font-bold text-lg leading-tight line-clamp-1 hover:text-white/70 transition-colors">{title}</h3>
        </Link>
        <p className="text-sm text-white/40">{author}</p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold">${price}</span>
          <Button 
            size="sm" 
            className="rounded-full bg-white text-black hover:bg-white/90"
            onClick={() => addToCart({ id, title, price, image })}
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