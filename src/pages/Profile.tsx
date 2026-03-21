"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Package, Star, Bell, Shield, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    const [profileRes, reviewsRes, ordersRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user?.id).single(),
      supabase.from('reviews').select('*, books(title)').eq('user_id', user?.id),
      supabase.from('orders').select('*').eq('user_id', user?.id)
    ]);
    setProfile(profileRes.data);
    setReviews(reviewsRes.data || []);
    setOrders(ordersRes.data || []);
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('user_profiles').update({
      full_name: profile.full_name,
      newsletter_subscribed: profile.newsletter_subscribed
    }).eq('id', user?.id);
    
    if (error) showError(error.message);
    else showSuccess('Profile updated');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-64 space-y-4">
            <div className="glass-dark p-8 rounded-[40px] text-center">
              <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
              <p className="text-white/40 text-sm mb-6">{user?.email}</p>
              <Button variant="outline" className="w-full rounded-2xl border-white/10 glass" onClick={() => signOut()}>
                <LogOut size={18} className="mr-2" /> Sign Out
              </Button>
            </div>
          </aside>

          <div className="flex-grow">
            <Tabs defaultValue="settings" className="space-y-8">
              <TabsList className="bg-white/5 border-white/10 rounded-full p-1">
                <TabsTrigger value="settings" className="rounded-full px-6"><Settings size={16} className="mr-2" /> Settings</TabsTrigger>
                <TabsTrigger value="orders" className="rounded-full px-6"><Package size={16} className="mr-2" /> Orders</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-full px-6"><Star size={16} className="mr-2" /> Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="space-y-8">
                <div className="glass-dark p-8 rounded-[40px]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><User size={20} /> Personal Info</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2"><Label>Full Name</Label><Input value={profile?.full_name || ''} onChange={e => setProfile({...profile, full_name: e.target.value})} className="bg-white/5 border-white/10 rounded-2xl h-12" /></div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                      <div><p className="font-bold">Newsletter</p><p className="text-sm text-white/40">Receive updates and recommendations</p></div>
                      <Switch checked={profile?.newsletter_subscribed} onCheckedChange={val => setProfile({...profile, newsletter_subscribed: val})} />
                    </div>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-white/90 rounded-2xl h-12 font-bold">Save Changes</Button>
                  </form>
                </div>

                <div className="glass-dark p-8 rounded-[40px] border border-red-500/20">
                  <h3 className="text-xl font-bold mb-6 text-red-500 flex items-center gap-2"><Shield size={20} /> Danger Zone</h3>
                  <p className="text-white/40 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                  <Button variant="destructive" className="w-full rounded-2xl h-12 font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20">
                    <Trash2 size={18} className="mr-2" /> Delete Account
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="orders">
                <div className="space-y-4">
                  {orders.length > 0 ? orders.map(order => (
                    <div key={order.id} className="glass-dark p-6 rounded-3xl flex justify-between items-center">
                      <div><p className="font-bold">Order #{order.id.slice(0, 8)}</p><p className="text-sm text-white/40">{new Date(order.created_at).toLocaleDateString()}</p></div>
                      <div className="text-right"><p className="font-bold">${order.total_amount}</p><span className="text-xs uppercase font-bold text-white/40">{order.status}</span></div>
                    </div>
                  )) : <p className="text-center py-12 text-white/40">No orders yet.</p>}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="glass-dark p-6 rounded-3xl">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-bold">{review.books?.title}</h4>
                        <div className="flex text-yellow-500">{Array.from({length: review.rating}).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                      </div>
                      <p className="text-white/60 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;