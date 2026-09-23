'use client';

import React, { useState, useMemo, useEffect, useDeferredValue, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Sparkles, AlertCircle, X } from 'lucide-react';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS } from '@/data/menuData';
import { Category, MenuItem } from '@/types';
import CategoryChips from '@/components/CategoryChips';
import MenuCard from '@/components/MenuCard';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category');

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryParam || null);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);
  const [activeFilter, setActiveFilter] = useState<'all' | 'veg' | 'egg' | 'featured' | 'available'>('all');

  // Load from API / Supabase if available
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.categories?.length) setCategories(data.categories);
          if (data.items?.length) setItems(data.items);
        }
      })
      .catch((err) => console.log('Using initial menu data'));
  }, []);

  // Update selected category if url param changes
  useEffect(() => {
    if (initialCategoryParam) {
      setSelectedCategory(initialCategoryParam);
    }
  }, [initialCategoryParam]);

  // Filtered and searched items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Category filter
      if (selectedCategory) {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && item.categoryId !== cat.id) {
          return false;
        }
      }

      // 2. Diet / Availability filters
      if (activeFilter === 'veg' && !item.isVegetarian) return false;
      if (activeFilter === 'egg' && item.foodType !== 'egg') return false;
      if (activeFilter === 'featured' && !item.isFeatured) return false;
      if (activeFilter === 'available' && !item.isAvailable) return false;

      // 3. Search query
      if (deferredQuery.trim()) {
        const q = deferredQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = (item.categoryName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [items, categories, selectedCategory, activeFilter, deferredQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Search Bar */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#881337] bg-rose-50 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#dc7e87]" />
              Amity University Jaipur Campus
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
              OTT Cafe Menu
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
              Over 70 dishes freshly prepared to order at the counter.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search dishes, shakes, momos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#f0e6dd] rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#e8959d] focus:ring-4 focus:ring-[#fce7e9] transition-all shadow-soft"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Horizontal Scrolling Navigation */}
        <div className="pt-1">
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(slug) => setSelectedCategory(slug)}
          />
        </div>

        {/* Filter Pills (All, Veg, Egg, Popular, Available) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3 h-3" /> Filters:
          </span>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#18181b] text-white shadow-xs'
                : 'bg-white border border-[#f0e6dd] text-zinc-600 hover:bg-rose-50'
            }`}
          >
            All Items
          </button>

          <button
            onClick={() => setActiveFilter('veg')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeFilter === 'veg'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_6px_rgba(5,150,105,0.8)]" />
            Pure Veg
          </button>

          <button
            onClick={() => setActiveFilter('egg')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeFilter === 'egg'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50/70 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            Egg Dishes
          </button>

          <button
            onClick={() => setActiveFilter('featured')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeFilter === 'featured'
                ? 'bg-[#18181b] text-[#f4c2c2] shadow-xs'
                : 'bg-white border border-[#f0e6dd] text-zinc-700 hover:bg-rose-50'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#e8959d]" />
            Campus Favs
          </button>

          <button
            onClick={() => setActiveFilter('available')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'available'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'bg-white border border-[#f0e6dd] text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Available Now
          </button>
        </div>
      </div>

      {/* Results Header info */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
        <span>
          Showing <strong className="text-zinc-900">{filteredItems.length}</strong> items
          {selectedCategory && (
            <>
              {' '}in{' '}
              <strong className="text-[#881337]">
                {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              </strong>
            </>
          )}
        </span>
        {(selectedCategory || searchQuery || activeFilter !== 'all') && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="text-xs font-bold text-[#881337] hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Menu Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-3xl border border-dashed border-[#f0e6dd] p-8">
          <div className="w-16 h-16 rounded-full bg-[#fce7e9] text-[#881337] flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-[#dc7e87]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-zinc-900">No dishes found</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              We couldn&apos;t find anything matching your search or filters. Try another keyword or reset filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="bg-[#18181b] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8 text-center text-xs text-zinc-400">Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
