"use client";

import { useState, useEffect } from 'react';

const RECENTLY_VIEWED_KEY = 'bookly_recently_viewed';

export function useRecentlyViewed() {
  const [recentBooks, setRecentBooks] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) setRecentBooks(JSON.parse(stored));
  }, []);

  const addViewedBook = (book: any) => {
    setRecentBooks(prev => {
      const filtered = prev.filter(b => b.id !== book.id);
      const updated = [book, ...filtered].slice(0, 4);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { recentBooks, addViewedBook };
}