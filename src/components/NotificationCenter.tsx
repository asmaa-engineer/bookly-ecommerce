"use client";

import React, { useState } from 'react';
import { Bell, Sparkles, Heart, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'ai', title: 'New AI Picks', message: 'We found 4 new books you might love based on your history!', time: '2m ago', read: false },
    { id: 2, type: 'wishlist', title: 'Price Drop', message: 'A book in your wishlist is now 20% off for a limited time!', time: '1h ago', read: false },
    { id: 3, type: 'category', title: 'New in Fiction', message: 'Check out the latest arrivals in your favorite category.', time: '5h ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Sparkles size={16} className="text-white" />;
      case 'wishlist': return <Heart size={16} className="text-white" />;
      case 'category': return <Tag size={16} className="text-white" />;
      default: return <Bell size={16} />;
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 hover:bg-white/10 relative glass">
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-white rounded-full border-2 border-black" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[400px] glass rounded-[32px] border-white/10 p-0 overflow-hidden mt-4" align="end">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h3 className="font-black text-lg uppercase tracking-tighter">Notifications</h3>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{unreadCount} Unread</span>
        </div>
        <ScrollArea className="h-[450px]">
          <div className="divide-y divide-white/5">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-6 hover:bg-white/[0.03] transition-colors cursor-pointer relative ${!n.read ? 'bg-white/[0.01]' : ''}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="font-black text-sm uppercase tracking-tight truncate">{n.title}</h4>
                      <span className="text-[10px] font-bold text-white/20 uppercase">{n.time}</span>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed font-medium">{n.message}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 bg-white/[0.02] border-t border-white/10 text-center">
          <button className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">
            Clear All Notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;