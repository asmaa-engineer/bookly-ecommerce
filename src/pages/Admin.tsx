"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit, Users, ShoppingCart, Book, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

const Admin = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({ title: '', author: '', price: '', category: '', description: '', image_url: '', stock_count: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [booksRes, ordersRes, usersRes] = await Promise.all([
      supabase.from('books').select('*'),
      supabase.from('orders').select('*, user_profiles(full_name)'),
      supabase.from('user_profiles').select('*')
    ]);
    setBooks(booksRes.data || []);
    setOrders(ordersRes.data || []);
    setUsers(usersRes.data || []);
    setLoading(false);
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('books').insert([newBook]);
    if (error) showError(error.message);
    else {
      showSuccess('Book added successfully');
      fetchData();
      setNewBook({ title: '', author: '', price: '', category: '', description: '', image_url: '', stock_count: 0 });
    }
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) showError(error.message);
    else {
      showSuccess('Book deleted');
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-dark p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl"><Book size={24} /></div>
            <div><p className="text-white/40 text-sm">Total Books</p><p className="text-2xl font-bold">{books.length}</p></div>
          </div>
          <div className="glass-dark p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl"><ShoppingCart size={24} /></div>
            <div><p className="text-white/40 text-sm">Total Orders</p><p className="text-2xl font-bold">{orders.length}</p></div>
          </div>
          <div className="glass-dark p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl"><Users size={24} /></div>
            <div><p className="text-white/40 text-sm">Total Users</p><p className="text-2xl font-bold">{users.length}</p></div>
          </div>
          <div className="glass-dark p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl"><BarChart3 size={24} /></div>
            <div><p className="text-white/40 text-sm">Revenue</p><p className="text-2xl font-bold">${orders.reduce((acc, o) => acc + o.total_amount, 0).toFixed(2)}</p></div>
          </div>
        </div>

        <Tabs defaultValue="books" className="space-y-8">
          <TabsList className="bg-white/5 border-white/10 rounded-full p-1">
            <TabsTrigger value="books" className="rounded-full px-8">Books</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full px-8">Orders</TabsTrigger>
            <TabsTrigger value="users" className="rounded-full px-8">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-8">
            <div className="glass-dark p-8 rounded-[40px]">
              <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
              <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label>Title</Label><Input value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="bg-white/5 border-white/10" required /></div>
                <div className="space-y-2"><Label>Author</Label><Input value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} className="bg-white/5 border-white/10" required /></div>
                <div className="space-y-2"><Label>Price</Label><Input type="number" step="0.01" value={newBook.price} onChange={e => setNewBook({...newBook, price: e.target.value})} className="bg-white/5 border-white/10" required /></div>
                <div className="space-y-2"><Label>Category</Label><Input value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} className="bg-white/5 border-white/10" required /></div>
                <div className="space-y-2 md:col-span-2"><Label>Image URL</Label><Input value={newBook.image_url} onChange={e => setNewBook({...newBook, image_url: e.target.value})} className="bg-white/5 border-white/10" required /></div>
                <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})} className="bg-white/5 border-white/10" required /></div>
                <Button type="submit" className="md:col-span-2 bg-white text-black hover:bg-white/90 rounded-2xl h-12 font-bold"><Plus className="mr-2" /> Add Book</Button>
              </form>
            </div>

            <div className="glass-dark rounded-[40px] overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map(book => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>${book.price}</TableCell>
                      <TableCell>{book.stock_count}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" className="hover:bg-white/10"><Edit size={18} /></Button>
                        <Button variant="ghost" size="icon" className="hover:bg-red-500/20 text-red-500" onClick={() => deleteBook(book.id)}><Trash2 size={18} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="glass-dark rounded-[40px] overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>{order.user_profiles?.full_name || 'Unknown'}</TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell><span className="px-3 py-1 rounded-full bg-white/10 text-xs uppercase font-bold">{order.status}</span></TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="glass-dark rounded-[40px] overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell><span className={`px-3 py-1 rounded-full text-xs uppercase font-bold ${user.role === 'admin' ? 'bg-white text-black' : 'bg-white/10'}`}>{user.role}</span></TableCell>
                      <TableCell>{new Date(user.updated_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;