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

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error: any) {
      showError(error.message);
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
            <h1 className="text-3xl font-bold tracking-tighter uppercase">Sign In</h1>
            <p className="text-white/40 mt-2">Welcome back to your library</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-white/40 hover:text-white">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <Input 
                  id="password" type="password" placeholder="••••••••" required
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-12 focus:ring-white/20"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
              <label htmlFor="remember" className="text-sm text-white/40 cursor-pointer">Remember me</label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-lg">
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="ml-2" size={20} />
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-white/40">Or</span></div>
            </div>

            <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full h-12 rounded-2xl border-white/10 glass hover:bg-white/5">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
          </form>

          <div className="mt-10 text-center text-sm text-white/40 relative z-10">
            Don't have an account? <Link to="/signup" className="text-white font-bold hover:underline">Create Account</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;