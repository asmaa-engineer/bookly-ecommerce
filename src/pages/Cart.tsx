"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const shipping = totalPrice > 50 ? 0 : 10;
  const finalTotal = totalPrice + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-48 pb-20 px-6 text-center">
          <div className="max-w-md mx-auto glass rounded-[48px] p-16 border-white/5">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10">
              <ShoppingBag className="text-white/20" size={48} />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Your cart is empty</h1>
            <p className="text-white/40 mb-10 font-medium">Looks like you haven't added any books to your collection yet.</p>
            <Link to="/catalog">
              <Button className="rounded-full px-10 h-14 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs">
                Start Shopping
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-black tracking-tighter mb-16 uppercase">YOUR CART ({totalItems})</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              {cart.map((item) => (
                <div key={item.id} className="glass rounded-[32px] p-6 flex flex-col sm:flex-row items-center gap-8 border-white/5 group">
                  <div className="w-32 h-44 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{item.title}</h3>
                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-6">${item.price}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-6">
                      <div className="flex items-center glass rounded-full px-2 py-1 border-white/10">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-full hover:bg-white/10"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-10 text-center font-black text-lg">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-full hover:bg-white/10"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-full w-12 h-12 transition-colors"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-3xl font-black tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass rounded-[48px] p-10 sticky top-32 border-white/10">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">Order Summary</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-white/40 font-bold uppercase tracking-widest text-xs">
                    <span>Subtotal</span>
                    <span className="text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/40 font-bold uppercase tracking-widest text-xs">
                    <span>Shipping</span>
                    <span className="text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between text-3xl font-black tracking-tighter">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link to="/checkout">
                  <Button className="w-full h-16 rounded-[24px] bg-white text-black hover:bg-white/90 text-lg font-black uppercase tracking-tighter transition-transform hover:scale-[1.02]">
                    Checkout
                    <ArrowRight className="ml-3" size={24} />
                  </Button>
                </Link>
                
                <div className="mt-8 flex items-center justify-center gap-3 text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                  <ShieldCheck size={16} />
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;