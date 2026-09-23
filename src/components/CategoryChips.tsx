'use client';

import React from 'react';
import { Category } from '@/types';

interface CategoryChipsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export default function CategoryChips({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) {
  return (
    <div className="relative w-full group">
      {/* Scrollable Container */}
      <div className="w-full overflow-x-auto no-scrollbar py-2 px-1">
        <div className="flex items-center gap-2 min-w-max">
          {/* All Button */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 active:scale-95 cursor-pointer ${
              selectedCategory === null
                ? 'bg-[#18181b] text-white shadow-md shadow-zinc-900/20 border border-zinc-700'
                : 'bg-white text-zinc-700 border border-[#f0e6dd] hover:border-[#e8959d]/60 hover:bg-rose-50/60 hover:text-black shadow-xs'
            }`}
          >
            All Items
          </button>

          {/* Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#18181b] text-white shadow-md shadow-zinc-900/20 border border-zinc-700'
                    : 'bg-white text-zinc-700 border border-[#f0e6dd] hover:border-[#e8959d]/60 hover:bg-rose-50/60 hover:text-black shadow-xs'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
