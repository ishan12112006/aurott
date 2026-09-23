'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileCartBar() {
  const pathname = usePathname();
  const { itemCount, subtotal, setIsCartDrawerOpen } = useCart();

  // Hide on checkout, order success, and admin pages
  if (
    itemCount === 0 ||
    pathname === '/checkout' ||
    pathname?.startsWith('/order-success') ||
    pathname?.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="w-full glass-dark text-white p-3.5 rounded-3xl shadow-2xl flex items-center justify-between border border-[#e8959d]/40 shadow-glow-rose active:scale-[0.98] transition-all duration-300 animate-in slide-in-from-bottom-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#fce7e9] to-[#f4c2c2] flex items-center justify-center text-[#881337] relative shadow-md">
              <ShoppingBag className="w-5 h-5 text-[#881337]" />
              <span className="absolute -top-1 -right-1 bg-[#18181b] text-[#f4c2c2] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[#e8959d]">
                {itemCount}
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] font-semibold text-zinc-300 block">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
              </span>
              <span className="text-lg font-black text-white tracking-tight">₹{subtotal}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#e8959d] to-[#dc7e87] text-[#18181b] font-black text-xs px-4 py-2.5 rounded-2xl shadow-md">
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </button>
      </div>
    </div>
  );
}
