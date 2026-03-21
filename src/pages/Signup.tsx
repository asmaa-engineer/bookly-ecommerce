"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, User, Mail, Lock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return showError("Passwords don't match");
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile manually if trigger isn't set up
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          full_name: fullName,
          email: email
        });
      }

      showSuccess('Account created! Please check your email for verification.');
      navigate('/login');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-3xl font-bold tracking-tighter uppercase">Join Bookly</h1>
            <p className="text-white/40 mt-2">Start your literary journey today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <Input 
                  id="name" type="text" placeholder="John Doe" required
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-12 focus:ring-white/20"
                  value={fullName} onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <Input 
                  id="email" type="email" placeholder="name@example.com" required
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-12 focus:ring-white/20"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <Input 
                  id="password" type="password" placeholder="••••••••" required
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-12 focus:ring-white/20"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <Input 
                  id="confirm" type="password" placeholder="••••••••" required
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-12 focus:ring-white/20"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-lg mt-4">
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </form>

          <div className="mt-10 text-center text-sm text-white/40 relative z-10">
            Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;