'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChefHat,
  Clock,
  ArrowRight,
  CheckCircle2,
  Bell,
  RefreshCw,
  Flame,
  Volume2,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getAllOrders, updateOrderStatus, subscribeToAllOrders } from '@/lib/db';
import { Order, OrderStatus } from '@/types';
import AdminNavbar from '@/components/AdminNavbar';

export default function KitchenKDSPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, isLoading, router]);

  const loadOrders = async () => {
    const data = await getAllOrders();
    setOrders(data);
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadOrders();

    const unsubscribe = subscribeToAllOrders(() => {
      loadOrders();
    });

    const interval = setInterval(loadOrders, 4000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isAdmin]);

  const handleUpdate = async (orderNumber: string, nextStatus: OrderStatus) => {
    setUpdatingId(orderNumber);
    try {
      await updateOrderStatus(orderNumber, nextStatus);
      await loadOrders();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#e8959d]" />
          <span>Opening Kitchen KDS...</span>
        </div>
      </div>
    );
  }

  // Filter into Kanban columns
  const newOrders = orders.filter((o) => o.orderStatus === 'PLACED');
  const preparingOrders = orders.filter(
    (o) => o.orderStatus === 'ACCEPTED' || o.orderStatus === 'PREPARING'
  );
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');
  const completedOrders = orders.filter((o) => o.orderStatus === 'COMPLETED').slice(0, 10);

  const getElapsedMinutes = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <AdminNavbar />

      {/* KDS Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#e8959d] text-zinc-950 flex items-center justify-center font-black">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>Kitchen Display System (KDS)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h1>
            <p className="text-[11px] text-zinc-400">
              OTT Cafe Amity Jaipur • High-Contrast Cook Line Screen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-400 hidden sm:inline">
            Active in kitchen: <strong>{newOrders.length + preparingOrders.length} orders</strong>
          </span>
          <button
            onClick={loadOrders}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-[320px]">
          {/* COLUMN 1: NEW / PLACED */}
          <div className="bg-zinc-900/90 rounded-2xl border border-blue-900/50 p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <h2 className="text-sm font-black uppercase tracking-wider text-blue-400">
                  New Placed
                </h2>
              </div>
              <span className="bg-blue-950 text-blue-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-800">
                {newOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
              {newOrders.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-600">No new orders</div>
              ) : (
                newOrders.map((o) => {
                  const elapsed = getElapsedMinutes(o.createdAt);
                  return (
                    <div
                      key={o.id}
                      className="bg-zinc-950 rounded-xl p-4 border-2 border-blue-500/80 shadow-md space-y-3 animate-pulse"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xl font-black text-white">#{o.orderNumber}</div>
                          <div className="text-xs text-zinc-400 font-bold">{o.customerName}</div>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                          <Clock className="w-3 h-3" /> {elapsed}m ago
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-baseline text-xs">
                            <span className="font-bold text-white">
                              <span className="text-amber-400 font-black text-sm">{it.quantity}×</span>{' '}
                              {it.itemNameSnapshot}
                            </span>
                            {it.selectedOption && (
                              <span className="text-[10px] text-zinc-400">({it.selectedOption})</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {o.specialInstructions && (
                        <div className="p-2 bg-amber-950/60 border border-amber-700/80 rounded-lg text-xs text-amber-300 font-bold">
                          ⚠️ {o.specialInstructions}
                        </div>
                      )}

                      <button
                        onClick={() => handleUpdate(o.orderNumber, 'PREPARING')}
                        disabled={updatingId === o.orderNumber}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-3 rounded-lg shadow-sm transition-transform active:scale-95 uppercase tracking-wider"
                      >
                        Accept & Start Preparing
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 2: PREPARING */}
          <div className="bg-zinc-900/90 rounded-2xl border border-amber-900/50 p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <h2 className="text-sm font-black uppercase tracking-wider text-amber-400">
                  Preparing
                </h2>
              </div>
              <span className="bg-amber-950 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-800">
                {preparingOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
              {preparingOrders.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-600">Kitchen idle</div>
              ) : (
                preparingOrders.map((o) => {
                  const elapsed = getElapsedMinutes(o.createdAt);
                  return (
                    <div
                      key={o.id}
                      className="bg-zinc-950 rounded-xl p-4 border border-amber-500/60 shadow-md space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xl font-black text-amber-400">#{o.orderNumber}</div>
                          <div className="text-xs text-zinc-400 font-bold">{o.customerName}</div>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                          <Flame className="w-3 h-3 text-amber-500" /> {elapsed}m
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-baseline text-xs">
                            <span className="font-bold text-white text-sm">
                              <span className="text-amber-400 font-black text-base">{it.quantity}×</span>{' '}
                              {it.itemNameSnapshot}
                            </span>
                            {it.selectedOption && (
                              <span className="text-[10px] text-zinc-400">({it.selectedOption})</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {o.specialInstructions && (
                        <div className="p-2 bg-amber-950/70 border border-amber-600 rounded-lg text-xs text-amber-200 font-bold">
                          ⚠️ {o.specialInstructions}
                        </div>
                      )}

                      <button
                        onClick={() => handleUpdate(o.orderNumber, 'READY')}
                        disabled={updatingId === o.orderNumber}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-lg shadow-sm transition-transform active:scale-95 uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <Bell className="w-4 h-4" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 3: READY FOR PICKUP */}
          <div className="bg-zinc-900/90 rounded-2xl border border-emerald-900/50 p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400">
                  Ready at Counter
                </h2>
              </div>
              <span className="bg-emerald-950 text-emerald-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-800">
                {readyOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
              {readyOrders.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-600">No ready orders</div>
              ) : (
                readyOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-zinc-950 rounded-xl p-4 border border-emerald-500/50 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xl font-black text-emerald-400">#{o.orderNumber}</div>
                        <div className="text-xs text-zinc-300 font-bold">
                          {o.customerName} ({o.customerPhone})
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        ₹{o.total}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-400 pt-1 border-t border-zinc-800">
                      {o.items.map((it, idx) => (
                        <div key={idx}>
                          {it.quantity}× {it.itemNameSnapshot}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleUpdate(o.orderNumber, 'COMPLETED')}
                      disabled={updatingId === o.orderNumber}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-[#f4c2c2] font-black text-xs py-2.5 rounded-lg transition-transform active:scale-95 uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Handover</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 4: RECENTLY COMPLETED */}
          <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-zinc-500" />
                <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400">
                  Completed
                </h2>
              </div>
              <span className="bg-zinc-800 text-zinc-400 text-xs font-black px-2.5 py-0.5 rounded-full">
                {completedOrders.length}
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[70vh] pr-1">
              {completedOrders.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-600">None completed yet</div>
              ) : (
                completedOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/80 text-xs space-y-1 opacity-70"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-300">#{o.orderNumber}</span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(o.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-zinc-500 text-[11px] truncate">{o.customerName}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
