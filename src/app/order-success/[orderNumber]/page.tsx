'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Share2,
  Utensils,
  Receipt,
  Copy,
  Check,
} from 'lucide-react';
import { Order } from '@/types';
import OrderStatusBadge from '@/components/OrderStatusBadge';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = (params?.orderNumber as string) || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e8959d', '#881337', '#18181b', '#10b981'],
      });
    } catch {}

    // Fetch order details
    if (orderNumber) {
      fetch(`/api/orders/${orderNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch((err) => console.error('Error fetching order', err))
        .finally(() => setLoading(false));
    }
  }, [orderNumber]);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Celebration Card */}
      <div className="bg-white rounded-3xl border border-[#f0e6dd] p-6 sm:p-10 shadow-lg text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#881337] bg-[#fce7e9] px-3 py-1 rounded-full">
            🎉 Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950">
            Order #{orderNumber}
          </h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Your order has been received by the OTT Cafe kitchen inside Amity University Jaipur!
          </p>
        </div>

        {/* Copy Order Number Button */}
        <div className="inline-flex items-center gap-2 bg-zinc-100 px-4 py-2 rounded-xl text-xs font-bold text-zinc-700">
          <span>Order Number: <strong>{orderNumber}</strong></span>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-zinc-200 rounded text-zinc-600 transition-colors"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Order Quick Details */}
        {order && (
          <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
              <span className="text-xs text-zinc-500 font-medium">Status</span>
              <OrderStatusBadge status={order.orderStatus} size="sm" />
            </div>

            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3 text-xs">
              <span className="text-zinc-500">Customer</span>
              <span className="font-bold text-zinc-900">{order.customerName} ({order.customerPhone})</span>
            </div>

            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3 text-xs">
              <span className="text-zinc-500">Payment</span>
              <span className="font-bold text-zinc-900">
                {order.paymentMethod === 'UPI' ? 'UPI at Counter' : 'Pay at Counter'} • ₹{order.total}
              </span>
            </div>

            <div className="flex items-start justify-between text-xs pt-1">
              <span className="text-zinc-500">Pickup Counter</span>
              <span className="font-bold text-zinc-900 text-right max-w-[240px]">
                OTT Cafe, Amity University Jaipur Campus
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/track-order?orderNumber=${orderNumber}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#18181b] hover:bg-zinc-800 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.98]"
          >
            <span>Live Order Tracking</span>
            <ArrowRight className="w-4 h-4 text-[#f4c2c2]" />
          </Link>

          <Link
            href="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-sm px-6 py-3.5 rounded-2xl border border-[#f0e6dd] transition-colors"
          >
            <span>Back to Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
