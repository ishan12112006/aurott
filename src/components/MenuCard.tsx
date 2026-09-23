'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const optionLabels = (item.options ?? []).map((opt) => (typeof opt === 'string' ? opt : opt.label));
  const [selectedOption, setSelectedOption] = useState<string | undefined>(optionLabels[0]);
  const [imageError, setImageError] = useState(false);

  const currentQuantity = getItemQuantity(item.id, selectedOption);

  const resolveOptionPrice = (optionLabel?: string) => {
    if (!optionLabel) return item.price;
    const matched = item.options?.find((opt) => {
      const label = typeof opt === 'string' ? opt : opt.label;
      return label.toLowerCase() === optionLabel.toLowerCase();
    });

    if (matched && typeof matched !== 'string' && typeof matched.price === 'number') {
      return matched.price;
    }

    if (typeof matched === 'string') {
      const parsed = matched.match(/₹?\s*(\d+(?:\.\d+)?)/);
      if (parsed) return Number(parsed[1]);
    }

    return item.price;
  };

  const displayPrice = resolveOptionPrice(selectedOption);

  const handleAdd = () => {
    if (!item.isAvailable) return;
    addToCart(item, selectedOption);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, 1, selectedOption);
  };

  const handleDecrease = () => {
    updateQuantity(item.id, -1, selectedOption);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
        item.isAvailable
          ? 'border-[#f0e6dd] hover:border-[#e8959d]/60 shadow-soft hover:shadow-card-hover hover:-translate-y-1.5'
          : 'border-zinc-200 bg-zinc-50/70 opacity-75'
      }`}
    >
      <div>
        {/* Card Image Banner */}
        <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-zinc-100">
          <Image
            src={imageError ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80' : item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

          {/* Food Type Indicator (Veg / Egg) */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm border border-black/5">
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                item.foodType === 'veg'
                  ? 'border-emerald-600'
                  : item.foodType === 'egg'
                  ? 'border-amber-600'
                  : 'border-red-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.foodType === 'veg'
                    ? 'bg-emerald-600 shadow-[0_0_6px_rgba(5,150,105,0.7)]'
                    : item.foodType === 'egg'
                    ? 'bg-amber-600 shadow-[0_0_6px_rgba(217,119,6,0.7)]'
                    : 'bg-red-600'
                }`}
              />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-800">
              {item.foodType === 'veg' ? 'Veg' : item.foodType === 'egg' ? 'Egg' : 'Non-Veg'}
            </span>
          </div>

          {/* Featured / Portion Tag */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {item.isFeatured && (
              <span className="bg-gradient-to-r from-[#18181b] to-zinc-900 text-[#f4c2c2] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-[#e8959d]/40">
                Campus Fav
              </span>
            )}
            {item.portionNote && (
              <span className="bg-white/95 backdrop-blur-md text-zinc-700 text-[10px] font-bold px-2.5 py-0.5 rounded-xl shadow-sm border border-black/5">
                {item.portionNote}
              </span>
            )}
          </div>

          {/* Unavailable Overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px] flex items-center justify-center">
              <span className="bg-white/95 text-zinc-800 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Currently Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 group-hover:text-[#dc7e87] transition-colors leading-snug">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>

          {/* Option Selector (e.g. Manchurian Dry / Gravy) */}
          {optionLabels.length > 0 && (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-400">Choice:</span>
              <div className="flex flex-wrap gap-1.5">
                {optionLabels.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedOption(opt)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all duration-200 ${
                      selectedOption === opt
                        ? 'bg-[#18181b] text-white shadow-xs'
                        : 'bg-rose-50/70 text-zinc-700 hover:bg-rose-100/70'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Price & Add To Cart Button */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 flex items-center justify-between gap-3 border-t border-zinc-100 mt-auto">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
              ₹{displayPrice}
            </span>
            {item.secondaryPrice && !selectedOption && (
              <span className="text-xs text-zinc-500 font-semibold">
                / ₹{item.secondaryPrice}
              </span>
            )}
          </div>
          <span className="text-[9.5px] font-semibold text-zinc-400 block tracking-wide uppercase">tax inclusive</span>
        </div>

        {/* Action Button: Add or Stepper */}
        {item.isAvailable ? (
          currentQuantity === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#fce7e9] to-[#f4c2c2]/60 hover:from-[#e8959d] hover:to-[#dc7e87] text-[#881337] hover:text-[#18181b] px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-200 shadow-xs hover:shadow-md hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center bg-[#18181b] text-white rounded-2xl overflow-hidden shadow-md border border-zinc-800">
              <button
                onClick={handleDecrease}
                className="px-3 py-2 hover:bg-zinc-800 active:scale-90 transition-all cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="px-2 text-xs sm:text-sm font-black text-[#f4c2c2] min-w-[22px] text-center">
                {currentQuantity}
              </span>
              <button
                onClick={handleIncrease}
                className="px-3 py-2 hover:bg-zinc-800 active:scale-90 transition-all cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )
        ) : (
          <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3.5 py-1.5 rounded-xl">
            Sold Out
          </span>
        )}
      </div>
    </div>
  );
}
