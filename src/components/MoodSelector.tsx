"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'hover:bg-yellow-500/20' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: 'hover:bg-blue-500/20' },
  { id: 'curious', label: 'Curious', emoji: '🤔', color: 'hover:bg-purple-500/20' },
  { id: 'tired', label: 'Tired', emoji: '😴', color: 'hover:bg-green-500/20' },
  { id: 'motivated', label: 'Motivated', emoji: '🚀', color: 'hover:bg-orange-500/20' },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  activeMood: string | null;
}

const MoodSelector = ({ onMoodSelect, activeMood }: MoodSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
        <Sparkles size={14} />
        How are you feeling?
      </div>
      <div className="flex flex-wrap gap-3">
        {MOODS.map((mood) => (
          <Button
            key={mood.id}
            variant="outline"
            onClick={() => onMoodSelect(mood.id)}
            className={`rounded-full px-6 h-12 border-white/10 glass transition-all ${mood.color} ${
              activeMood === mood.id ? 'bg-white text-black border-white' : ''
            }`}
          >
            <span className="mr-2">{mood.emoji}</span>
            {mood.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;