"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id,
          total_amount: totalPrice,
          shipping_address: address,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        book_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      showSuccess("Order placed successfully!");
      clearCart();
      navigate('/profile');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            <div className="glass-dark p-8 rounded-[32px] space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Truck size={20} /> Shipping Details</h2>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" className="bg-white/5 border-white/10 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label>Shipping Address</Label>
                <Input 
                  placeholder="123 Library St, Booktown" 
                  className="bg-white/5 border-white/10 rounded-xl" 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="glass-dark p-8 rounded-[32px] space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard size={20} /> Payment</h2>
              <p className="text-white/40 text-sm">Payment is currently simulated. No real charges will be made.</p>
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input placeholder="•••• •••• •••• ••••" className="bg-white/5 border-white/10 rounded-xl" required />
              </div>
            </div>

            <Button type="submit" disabled={loading || cart.length === 0} className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-lg">
              {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
            </Button>
          </form>

          <div className="space-y-8">
            <div className="glass-dark p-8 rounded-[32px]">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/60">{item.title} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white/40 text-sm px-4">
              <ShieldCheck size={20} />
              <span>Secure checkout powered by Bookly SSL</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;