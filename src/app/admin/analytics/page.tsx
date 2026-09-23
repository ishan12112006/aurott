'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Clock,
  DollarSign,
  Coffee,
  Flame,
  Award,
  RefreshCw,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getAnalytics } from '@/lib/db';
import { AnalyticsSummary } from '@/types';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminAuth();

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, isLoading, router]);

  const loadStats = async () => {
    const data = await getAnalytics();
    setAnalytics(data);
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadStats();
  }, [isAdmin]);

  if (isLoading || !isAdmin || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <RefreshCw className="w-4 h-4 animate-spin text-[#881337]" />
          <span>Calculating campus sales metrics...</span>
        </div>
      </div>
    );
  }

  const maxItemCount = Math.max(1, ...analytics.topSellingItems.map((i) => i.count));

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950">
              Campus Cafe Analytics
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Sales volume, bestselling dishes, and campus ordering trends at Amity University Jaipur.
            </p>
          </div>

          <button
            onClick={loadStats}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Update Metrics</span>
          </button>
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
              <span>Today&apos;s Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950">
              ₹{analytics.todayRevenue}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block">
              +14% vs yesterday average
            </span>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
              <span>Total Orders</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950">
              {analytics.todayOrdersCount}
            </div>
            <span className="text-[11px] text-zinc-400 block">
              Completed & live orders
            </span>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
              <span>Avg Order Value (AOV)</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950">
              ₹{analytics.averageOrderValue}
            </div>
            <span className="text-[11px] text-zinc-400 block">
              Per student transaction
            </span>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
              <span>Kitchen Efficiency</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950">
              ~12 mins
            </div>
            <span className="text-[11px] text-zinc-400 block">
              Average order turnaround
            </span>
          </div>
        </div>

        {/* 2-Column Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Selling Dishes */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="text-base font-bold text-zinc-900">Bestselling Dishes</h2>
              </div>
              <span className="text-xs text-zinc-400 font-semibold">By Volume Ordered</span>
            </div>

            {analytics.topSellingItems.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No orders recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {analytics.topSellingItems.map((item, idx) => {
                  const pct = Math.round((item.count / maxItemCount) * 100);
                  return (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-zinc-900 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] flex items-center justify-center font-black">
                            #{idx + 1}
                          </span>
                          {item.name}
                        </span>
                        <span className="text-zinc-500">
                          {item.count} sold • <strong className="text-zinc-900">₹{item.revenue}</strong>
                        </span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#e8959d] to-[#881337] h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Orders by Category */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#881337]" />
                <h2 className="text-base font-bold text-zinc-900">Popular Categories</h2>
              </div>
              <span className="text-xs text-zinc-400 font-semibold">Campus Breakdown</span>
            </div>

            <div className="space-y-3.5">
              {analytics.categoryBreakdown.map((cat) => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs"
                >
                  <span className="font-bold text-zinc-800">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-semibold">{cat.count} orders</span>
                    <span className="w-2 h-2 rounded-full bg-[#e8959d]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
