"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-48 pb-20 px-6 text-center">
          <div className="max-w-md mx-auto glass-dark rounded-[40px] p-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="text-white/20" size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-white/40 mb-8">Looks like you haven't added any books to your collection yet.</p>
            <Link to="/">
              <Button className="rounded-full px-8 h-12 bg-white text-black hover:bg-white/90">
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
          <h1 className="text-5xl font-bold tracking-tighter mb-12">YOUR CART ({totalItems})</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="glass-dark rounded-3xl p-6 flex items-center gap-6">
                  <div className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-white/40 text-sm mb-4">${item.price}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center glass rounded-full px-2 py-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-white/10"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-white/10"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-full"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-dark rounded-[40px] p-8 sticky top-32">
                <h2 className="text-2xl font-bold mb-8">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button className="w-full h-14 rounded-full bg-white text-black hover:bg-white/90 text-lg font-bold">
                  Checkout
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;