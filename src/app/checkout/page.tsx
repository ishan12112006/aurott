'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PaymentMethod } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, total, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PAY_AT_COUNTER');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If cart is empty, show empty redirect
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#fce7e9] text-[#881337] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-[#dc7e87]" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Your cart is empty</h2>
        <p className="text-xs text-zinc-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/menu"
          className="inline-block bg-[#18181b] text-white text-xs font-bold px-6 py-2.5 rounded-full"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        specialInstructions: specialInstructions.trim() || undefined,
        paymentMethod,
        items: items.map((ci) => ({
          menuItemId: ci.menuItem.id,
          quantity: ci.quantity,
          selectedOption: ci.selectedOption,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order. Please try again.');
      }

      // Clear guest cart
      clearCart();

      // Persist locally for instant tracking & admin dashboard synchronization
      if (typeof window !== 'undefined' && data.order) {
        try {
          const raw = localStorage.getItem('ott_orders');
          const existing = raw ? JSON.parse(raw) : [];
          existing.unshift(data.order);
          localStorage.setItem('ott_orders', JSON.stringify(existing));
          window.dispatchEvent(new CustomEvent('ott_order_created', { detail: data.order }));
        } catch {}
      }

      // Deep link to order success
      router.push(`/order-success/${data.order.orderNumber}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900">
          Campus Pickup Checkout
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          No sign-up required. Your order will be prepared hot for pickup at OTT Cafe.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong className="font-bold">Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customer Details Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Pickup Details */}
            <div className="bg-white rounded-3xl border border-[#f0e6dd] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                <MapPin className="w-5 h-5 text-[#881337]" />
                <h2 className="text-base font-bold text-zinc-900">Pickup Location</h2>
              </div>

              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1">
                <div className="text-xs font-bold text-zinc-900">OTT Cafe Counter</div>
                <div className="text-xs text-zinc-500 leading-relaxed">
                  Food Court Area, Amity University Jaipur Campus, Kant Kalwar, NH-11C, Jaipur.
                </div>
                <span className="inline-block text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-1">
                  Ready in approx 10–15 mins
                </span>
              </div>
            </div>

            {/* 2. Customer Contact */}
            <div className="bg-white rounded-3xl border border-[#f0e6dd] p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">
                Your Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ishan Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-[#f0e6dd] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#e8959d] focus:ring-2 focus:ring-[#fce7e9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#f0e6dd] bg-zinc-50 text-zinc-500 text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-[#f0e6dd] rounded-r-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#e8959d] focus:ring-2 focus:ring-[#fce7e9]"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Used to track your order and verify pickup at the counter.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Email Address <span className="text-zinc-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="student@amity.edu"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white border border-[#f0e6dd] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#e8959d] focus:ring-2 focus:ring-[#fce7e9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Special Cooking Instructions <span className="text-zinc-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Less spicy red sauce, extra crispy fries, no onion..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full bg-white border border-[#f0e6dd] rounded-xl px-4 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#e8959d] focus:ring-2 focus:ring-[#fce7e9]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-3xl border border-[#f0e6dd] p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'PAY_AT_COUNTER'
                      ? 'border-[#18181b] bg-[#fce7e9]/20 shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="PAY_AT_COUNTER"
                    checked={paymentMethod === 'PAY_AT_COUNTER'}
                    onChange={() => setPaymentMethod('PAY_AT_COUNTER')}
                    className="mt-1 text-[#18181b] focus:ring-[#e8959d]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-zinc-900">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Pay at Counter
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Pay cash or UPI scan when collecting your food.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#18181b] bg-[#fce7e9]/20 shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 text-[#18181b] focus:ring-[#e8959d]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-zinc-900">
                      <QrCode className="w-4 h-4 text-[#881337]" />
                      UPI QR at Counter
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      GPay, PhonePe, Paytm scan supported at counter.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & CTA */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#f0e6dd] p-6 shadow-sm space-y-6 sticky top-28">
              <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100 flex items-center justify-between">
                <span>Items in Order</span>
                <span className="text-xs text-zinc-500 font-semibold">{items.length} items</span>
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.menuItem.id}-${item.selectedOption || 'def'}`}
                    className="flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-zinc-900">
                        {item.menuItem.name} × {item.quantity}
                      </span>
                      {item.selectedOption && (
                        <span className="text-[10px] text-zinc-500 block">
                          ({item.selectedOption})
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-zinc-900">
                      ₹{item.selectedPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Pickup Fee</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="pt-2 border-t border-zinc-100 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-zinc-950">Total Amount</span>
                  <span className="text-2xl font-black text-[#881337]">₹{total}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#18181b] hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-extrabold text-sm py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#f4c2c2]" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#f4c2c2]" />
                    <span>Place Order (₹{total})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified campus ordering • Live kitchen notifications</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
