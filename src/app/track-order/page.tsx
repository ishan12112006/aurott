'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Clock,
  CheckCircle2,
  ChefHat,
  Bell,
  Check,
  AlertCircle,
  MapPin,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { subscribeToOrder } from '@/lib/db';
import OrderStatusBadge from '@/components/OrderStatusBadge';

const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'PLACED', label: 'Order Placed', desc: 'Received by cafe' },
  { status: 'ACCEPTED', label: 'Accepted', desc: 'Kitchen acknowledged' },
  { status: 'PREPARING', label: 'Preparing', desc: 'Cooking fresh now' },
  { status: 'READY', label: 'Ready for Pickup', desc: 'Collect at counter' },
  { status: 'COMPLETED', label: 'Completed', desc: 'Enjoy your food!' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const queryOrderNumber = searchParams.get('orderNumber') || '';

  const [orderNumberInput, setOrderNumberInput] = useState(queryOrderNumber);
  const [phoneInput, setPhoneInput] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch function
  const fetchOrder = async (orderNum: string, phone?: string) => {
    if (!orderNum.trim()) return;
    if (!phone?.trim()) {
      setErrorMsg('Phone number is required to track your order.');
      setOrder(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const url = `/api/orders/${orderNum.trim().toUpperCase()}?phone=${encodeURIComponent(phone.trim())}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Order could not be found.');
      }

      setOrder(data.order);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to find order. Please check order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // If query param is present on mount, search immediately
  useEffect(() => {
    if (queryOrderNumber) {
      fetchOrder(queryOrderNumber);
    }
  }, [queryOrderNumber]);

  // Real-time live status updates subscription
  useEffect(() => {
    if (!order?.orderNumber) return;

    const unsubscribe = subscribeToOrder(order.orderNumber, (updatedOrder) => {
      setOrder(updatedOrder);
      setLastUpdated(new Date());
    });

    // Also periodic poll every 5s for resilience
    const interval = setInterval(() => {
      if (order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED') {
        fetchOrder(order.orderNumber);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [order?.orderNumber, order?.orderStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) {
      setErrorMsg('Phone number is required to track your order.');
      setOrder(null);
      return;
    }
    fetchOrder(orderNumberInput, phoneInput);
  };

  // Determine current active step index
  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return 0;
      case 'ACCEPTED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'READY':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return -1;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search Order Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          Track Your Live Order
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          Enter your OTT order number to watch your food progress in real time.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-4 sm:p-6 rounded-3xl border border-[#f0e6dd] shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Order Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. OTT-1024"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value.toUpperCase())}
              className="w-full bg-white border border-[#f0e6dd] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900 focus:outline-none focus:border-[#e8959d] focus:ring-2 focus:ring-[#fce7e9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Phone Number <span className="text-red-500 font-normal">Required</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full bg-white border border-[#f0e6dd] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#e8959d] focus:ring-2 focus:ring-[#fce7e9]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#18181b] hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-black text-xs sm:text-sm py-3 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#f4c2c2]" />
              <span>Checking Order...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-[#f4c2c2]" />
              <span>Track Order</span>
            </>
          )}
        </button>
      </form>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong className="font-bold">Not Found:</strong> {errorMsg}
          </div>
        </div>
      )}

      {/* Active Order Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-[#f0e6dd] p-5 sm:p-8 shadow-md space-y-8 animate-in fade-in duration-300">
          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-black text-zinc-950">
                  #{order.orderNumber}
                </span>
                <OrderStatusBadge status={order.orderStatus} />
              </div>
              <p className="text-xs text-zinc-500">
                Ordered by <strong className="text-zinc-800">{order.customerName}</strong> ({order.customerPhone})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-zinc-400 block">Total Amount</span>
              <span className="text-xl sm:text-2xl font-black text-[#881337]">
                ₹{order.total}
              </span>
              <span className="text-[10px] text-zinc-400 block">
                {order.paymentMethod === 'UPI' ? 'UPI at Counter' : 'Pay at Counter'}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {order.orderStatus === 'CANCELLED' ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-1">
              <span className="text-sm font-bold text-rose-700">This order has been cancelled</span>
              <p className="text-xs text-zinc-500">
                Please contact the OTT Cafe counter staff for inquiries or assistance.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
                  Live Kitchen Tracker
                </span>
                {lastUpdated && (
                  <span className="text-[10px] text-zinc-400 font-normal">
                    Synced {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>

              {/* Step Flow with Connecting Progress Bar */}
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-4 sm:top-5 left-[10%] right-[10%] h-1 bg-zinc-100 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#e8959d] transition-all duration-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, (currentStepIdx / (STEPS.length - 1)) * 100))}%`,
                    }}
                  />
                </div>

                <div className="relative z-10 grid grid-cols-5 gap-1 sm:gap-2">
                  {STEPS.map((step, idx) => {
                    const isDone = currentStepIdx > idx;
                    const isCurrent = currentStepIdx === idx;

                    return (
                      <div key={step.status} className="flex flex-col items-center text-center space-y-2">
                        <div
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                            isCurrent
                              ? 'bg-[#18181b] text-[#f4c2c2] ring-4 ring-[#fce7e9] scale-110 shadow-lg shadow-rose-900/10'
                              : isDone
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border-2 border-zinc-200 text-zinc-400'
                          }`}
                        >
                          {isDone ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : isCurrent ? (
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8959d] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e8959d]"></span>
                            </span>
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div>
                          <div
                            className={`text-[11px] sm:text-xs font-extrabold leading-tight ${
                              isCurrent
                                ? 'text-zinc-950 font-black'
                                : isDone
                                ? 'text-zinc-800'
                                : 'text-zinc-400'
                            }`}
                          >
                            {step.label}
                          </div>
                          <div className="hidden sm:block text-[10px] text-zinc-400 mt-0.5 font-medium">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Highlight Ready State */}
              {order.orderStatus === 'READY' && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center space-y-1 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-base">
                    <Bell className="w-5 h-5 text-emerald-600" />
                    <span>Your Order is Ready for Pickup!</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Please head over to the OTT Cafe counter and show order <strong>#{order.orderNumber}</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ordered Items Breakdown */}
          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Ordered Items
            </h3>
            <div className="space-y-2">
              {order.items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl text-xs sm:text-sm font-semibold"
                >
                  <div>
                    <span className="text-zinc-900 font-bold">{it.itemNameSnapshot}</span>{' '}
                    <span className="text-[#881337] font-black">× {it.quantity}</span>
                    {it.selectedOption && (
                      <span className="text-[10px] text-zinc-500 block">({it.selectedOption})</span>
                    )}
                  </div>
                  <span className="font-bold text-zinc-900">₹{it.subtotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
              <strong>Special Instructions:</strong> {order.specialInstructions}
            </div>
          )}

          {/* Pickup details */}
          <div className="p-4 bg-[#fce7e9]/30 rounded-2xl flex items-start gap-3 text-xs text-zinc-600">
            <MapPin className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-900 font-bold block mb-0.5">Pickup Counter:</strong>
              OTT Cafe, Food Court Area, Amity University Jaipur Campus.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto p-8 text-center text-xs text-zinc-400">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
