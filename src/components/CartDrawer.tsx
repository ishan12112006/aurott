'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    total,
    itemCount,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#121113] text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#fce7e9] to-[#f4c2c2] flex items-center justify-center text-[#881337] shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight leading-none text-white">Your Campus Order</h2>
                <span className="text-[11px] text-zinc-400 font-medium">OTT Cafe • Amity University</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#e8959d] text-[#18181b] px-2.5 py-0.5 rounded-full font-black">
                {itemCount}
              </span>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center text-[#881337] border border-rose-100 shadow-soft">
                  <ShoppingBag className="w-10 h-10 text-[#dc7e87]" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-900">Your cart is empty</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
                    Add something delicious from the menu. Fresh snacks, shakes and combos await!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="bg-[#18181b] text-white text-xs font-black px-6 py-3 rounded-2xl hover:bg-zinc-800 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-100">
                  <span className="font-bold text-zinc-700">Selected Dishes</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                  </button>
                </div>

                {items.map((cartItem) => {
                  const lineTotal = cartItem.selectedPrice * cartItem.quantity;
                  return (
                    <div
                      key={`${cartItem.menuItem.id}-${cartItem.selectedOption || 'def'}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#f0e6dd] shadow-xs hover:border-[#e8959d]/50 transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                        <Image
                          src={cartItem.menuItem.imageUrl}
                          alt={cartItem.menuItem.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-extrabold text-zinc-900 truncate">
                          {cartItem.menuItem.name}
                        </h4>
                        {cartItem.selectedOption && (
                          <span className="text-[10px] font-bold text-zinc-600 bg-rose-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            {cartItem.selectedOption}
                          </span>
                        )}
                        <p className="text-xs text-zinc-500 mt-1 font-medium">
                          {cartItem.quantity} × ₹{cartItem.selectedPrice} ={' '}
                          <span className="font-black text-zinc-950">₹{lineTotal}</span>
                        </p>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center bg-[#18181b] text-white rounded-xl overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(cartItem.menuItem.id, -1, cartItem.selectedOption)}
                          className="p-1.5 hover:bg-zinc-800 active:scale-90 text-white cursor-pointer transition-all"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <span className="px-2 text-xs font-black text-[#f4c2c2] min-w-[18px] text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.menuItem.id, 1, cartItem.selectedOption)}
                          className="p-1.5 hover:bg-zinc-800 active:scale-90 text-white cursor-pointer transition-all"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Drawer Footer with Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#f0e6dd] bg-white space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-zinc-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span className="font-medium">Campus Pickup</span>
                  <span className="font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t border-zinc-100">
                  <span>Grand Total</span>
                  <span className="text-[#881337] text-xl font-black">₹{total}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#18181b] to-zinc-900 hover:from-black hover:to-zinc-800 text-white font-black text-sm py-4 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-[0.98] border border-zinc-800"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#f4c2c2] stroke-[2.5]" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
