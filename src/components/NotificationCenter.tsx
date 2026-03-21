"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, Heart, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'ai', title: 'New AI Picks', message: 'We found 4 new books you might love!', time: '2m ago', read: false },
    { id: 2, type: 'wishlist', title: 'Price Drop', message: 'A book in your wishlist is now 20% off!', time: '1h ago', read: false },
    { id: 3, type: 'category', title: 'New in Fiction', message: 'Check out the latest arrivals in your favorite category.', time: '5h ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Sparkles size={14} className="text-purple-400" />;
      case 'wishlist': return <Heart size={14} className="text-red-400" />;
      case 'category': return <Tag size={14} className="text-blue-400" />;
      default: return <Bell size={14} />;
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border-2 border-black" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 glass-dark border-white/10 p-0 overflow-hidden" align="end">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="font-bold text-sm">Notifications</h3>
          <span className="text-[10px] uppercase tracking-widest text-white/40">{unreadCount} Unread</span>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="divide-y divide-white/5">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 hover:bg-white/5 transition-colors cursor-pointer relative ${!n.read ? 'bg-white/[0.02]' : ''}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-xs truncate">{n.title}</h4>
                      <span className="text-[10px] text-white/20">{n.time}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.read && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 bg-white/5 border-t border-white/10 text-center">
          <button className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white">
            Clear All
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;