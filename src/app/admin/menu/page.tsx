'use client';

import React, { useState, useEffect, useDeferredValue, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  UtensilsCrossed,
  Search,
  Check,
  AlertCircle,
  Sparkles,
  Edit2,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getCategories, getMenuItems, toggleItemAvailability, updateItemPrice } from '@/lib/db';
import { Category, MenuItem } from '@/types';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminMenuPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, isLoading, router]);

  const loadData = async () => {
    const [cats, its] = await Promise.all([getCategories(), getMenuItems()]);
    setCategories(cats);
    setItems(its);
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    const nextVal = !item.isAvailable;
    await toggleItemAvailability(item.id, nextVal);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isAvailable: nextVal } : i))
    );
    showNotification(
      `${item.name} is now marked as ${nextVal ? 'Available' : 'Currently Unavailable'}`
    );
  };

  const handleSavePrice = async (itemId: string) => {
    const num = parseFloat(tempPrice);
    if (!isNaN(num) && num >= 0) {
      await updateItemPrice(itemId, num);
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, price: num } : i))
      );
      showNotification(`Price updated to ₹${num}`);
    }
    setEditingPriceId(null);
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <RefreshCw className="w-4 h-4 animate-spin text-[#881337]" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory && item.categoryId !== selectedCategory) {
        return false;
      }
      if (deferredQuery.trim()) {
        const q = deferredQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = (item.categoryName || '').toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }
      return true;
    });
  }, [items, selectedCategory, deferredQuery]);

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950">
              Cafe Menu Management
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Toggle availability, change dish prices, and manage campus food items in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 bg-white px-3 py-1.5 rounded-xl border border-zinc-200">
              Total Items: <strong className="text-zinc-900">{items.length}</strong>
            </span>
            <button
              onClick={loadData}
              className="p-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-100 text-zinc-700"
              title="Reload Menu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search dishes by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#e8959d]"
            />
          </div>

          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full sm:w-64 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-zinc-700 focus:outline-none focus:border-[#e8959d]"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Menu Items Table / Grid */}
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100 text-zinc-600 font-extrabold text-[11px] uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Diet Type</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-center">Availability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredItems.map((item) => {
                  const isEditingPrice = editingPriceId === item.id;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-zinc-50/80 transition-colors ${
                        !item.isAvailable ? 'bg-zinc-50/50 opacity-75' : ''
                      }`}
                    >
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-zinc-900 block leading-tight">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-xs font-semibold text-zinc-600">
                        {item.categoryName || 'General'}
                      </td>

                      {/* Diet Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.foodType === 'veg'
                              ? 'bg-green-100 text-green-800'
                              : item.foodType === 'egg'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.foodType === 'veg'
                                ? 'bg-green-600'
                                : item.foodType === 'egg'
                                ? 'bg-amber-600'
                                : 'bg-red-600'
                            }`}
                          />
                          {item.foodType === 'veg' ? 'Veg' : item.foodType === 'egg' ? 'Egg' : 'Non-veg'}
                        </span>
                      </td>

                      {/* Price Editor */}
                      <td className="py-3 px-4">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1">
                            <span className="text-zinc-500 font-bold">₹</span>
                            <input
                              type="number"
                              min="0"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSavePrice(item.id);
                                else if (e.key === 'Escape') setEditingPriceId(null);
                              }}
                              className="w-16 bg-white border border-[#e8959d] rounded px-1.5 py-0.5 text-xs font-bold text-zinc-900 focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSavePrice(item.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Save (Enter)"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-zinc-900">₹{item.price}</span>
                            <button
                              onClick={() => {
                                setEditingPriceId(item.id);
                                setTempPrice(item.price.toString());
                              }}
                              className="p-1 text-zinc-400 hover:text-zinc-700 rounded"
                              title="Edit Price"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Availability status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>

                      {/* Action toggle */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleAvailable(item)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs ${
                            item.isAvailable
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {item.isAvailable ? 'Mark Unavailable' : 'Make Available'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
