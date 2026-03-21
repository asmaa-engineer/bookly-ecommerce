"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Github, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full glass-dark rounded-[40px] p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center mb-10">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-black" size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter">
              {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
            </h1>
            <p className="text-white/40 mt-2">
              {isLogin ? 'Enter your details to continue' : 'Join the Bookly community today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                className="bg-white/5 border-white/10 rounded-2xl h-12 focus:ring-white/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-white/5 border-white/10 rounded-2xl h-12 focus:ring-white/20"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-lg">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-white/40">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-2xl border-white/10 glass hover:bg-white/5">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-2xl border-white/10 glass hover:bg-white/5">
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm text-white/40 relative z-10">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;