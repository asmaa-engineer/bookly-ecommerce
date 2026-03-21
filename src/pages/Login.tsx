"use client";

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showSuccess('Welcome back to Bookly!');
      navigate(from, { replace: true });
    } catch (error: any) {
      showError(error.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full glass rounded-[48px] p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
          
          <div className="relative z-10 text-center mb-12">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <BookOpen className="text-black" size={40} />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter uppercase mb-3">Sign In</h1>
            <p className="text-white/40 font-medium">Welcome back to your personal library</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                <Input 
                  id="email" type="email" placeholder="name@example.com" required
                  className="bg-white/5 border-white/10 rounded-3xl h-14 pl-14 focus:ring-white/20 text-lg"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-white/40">Password</Label>
                <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                <Input 
                  id="password" type="password" placeholder="••••••••" required
                  className="bg-white/5 border-white/10 rounded-3xl h-14 pl-14 focus:ring-white/20 text-lg"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 px-1">
              <Checkbox id="remember" className="w-5 h-5 border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black rounded-md" />
              <label htmlFor="remember" className="text-sm text-white/40 font-medium cursor-pointer">Remember me</label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-16 rounded-3xl bg-white text-black hover:bg-white/90 font-bold text-xl transition-transform hover:scale-[1.02]">
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="ml-2" size={24} />
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.3em]"><span className="bg-black px-4 text-white/20">Or</span></div>
            </div>

            <Button type="button" variant="outline" className="w-full h-14 rounded-3xl border-white/10 glass hover:bg-white/5 font-bold">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>
          </form>

          <div className="mt-12 text-center text-sm text-white/40 font-medium relative z-10">
            Don't have an account? <Link to="/signup" className="text-white font-bold hover:underline ml-1">Create Account</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;