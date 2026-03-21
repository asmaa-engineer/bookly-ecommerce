"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, Heart, BookOpen, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import SmartSearch from './SmartSearch';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-full px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden relative">
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const icon = e.currentTarget.nextElementSibling as HTMLElement;
                if (icon) icon.style.display = 'block';
              }}
            />
            <BookOpen className="text-black hidden" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter">BOOKLY</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
          <Link to="/wishlist" className="hover:text-white transition-colors relative">
            Wishlist
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-3 w-2 h-2 bg-white rounded-full" />
            )}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <SmartSearch />
          </div>
          
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                      <AvatarFallback className="bg-white/10 text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-dark border-white/10 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-xs leading-none text-white/40">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {user.user_metadata?.role === 'admin' && (
                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-500/20 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                  <UserIcon size={20} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;