'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Trash2, Plus, Minus, ShoppingBag, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-[#fce7e9] flex items-center justify-center text-[#881337] mx-auto">
          <ShoppingBag className="w-10 h-10 text-[#dc7e87]" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-zinc-900">Your cart is empty</h1>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            You haven&apos;t added any cravings yet. Check out our burgers, shakes, and momos!
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-[#18181b] hover:bg-zinc-800 text-white font-bold text-sm px-6 py-3 rounded-full transition-colors shadow-sm"
        >
          <span>Browse Campus Menu</span>
          <ArrowRight className="w-4 h-4 text-[#f4c2c2]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0e6dd] pb-4">
        <div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900">Review Cart</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((cartItem) => {
            const lineTotal = cartItem.selectedPrice * cartItem.quantity;
            return (
              <div
                key={`${cartItem.menuItem.id}-${cartItem.selectedOption || 'def'}`}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#f0e6dd] shadow-xs"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                  <Image
                    src={cartItem.menuItem.imageUrl}
                    alt={cartItem.menuItem.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 truncate">
                    {cartItem.menuItem.name}
                  </h3>
                  {cartItem.selectedOption && (
                    <span className="text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded font-medium">
                      {cartItem.selectedOption}
                    </span>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">
                    ₹{cartItem.selectedPrice} each
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm sm:text-base font-black text-zinc-900">
                    ₹{lineTotal}
                  </span>

                  <div className="flex items-center bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                    <button
                      onClick={() => updateQuantity(cartItem.menuItem.id, -1, cartItem.selectedOption)}
                      className="p-1.5 hover:bg-zinc-200 text-zinc-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-black text-zinc-900 min-w-[20px] text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.menuItem.id, 1, cartItem.selectedOption)}
                      className="p-1.5 hover:bg-zinc-200 text-zinc-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Checkout Box */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#f0e6dd] p-6 shadow-sm space-y-6 sticky top-28">
            <h2 className="text-lg font-black text-zinc-900 pb-3 border-b border-zinc-100">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Items ({itemCount})</span>
                <span className="font-semibold text-zinc-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Campus Pickup</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Taxes & Charges</span>
                <span className="font-semibold text-zinc-900">₹0</span>
              </div>
              <div className="pt-3 border-t border-zinc-100 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-zinc-950">Grand Total</span>
                <span className="text-2xl font-black text-[#881337]">₹{total}</span>
              </div>
            </div>

            {/* Campus Pickup Note */}
            <div className="p-3 bg-[#fce7e9]/40 rounded-xl flex items-start gap-2.5 text-xs text-[#881337]">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#dc7e87]" />
              <span>
                <strong>Counter Pickup:</strong> OTT Cafe, Amity University Jaipur Campus.
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-[#18181b] hover:bg-zinc-800 text-white font-black text-sm py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#f4c2c2]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
