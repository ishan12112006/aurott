'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  TrendingUp,
  ShoppingBag,
  ChefHat,
  Bell,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getAllOrders, updateOrderStatus, subscribeToAllOrders } from '@/lib/db';
import { Order, OrderStatus } from '@/types';
import AdminNavbar from '@/components/AdminNavbar';
import OrderStatusBadge from '@/components/OrderStatusBadge';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, isLoading, router]);

  // Load orders
  const loadOrders = async () => {
    const data = await getAllOrders();
    setOrders(data);
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadOrders();

    // Subscribe to real-time order creation / status changes
    const unsubscribe = subscribeToAllOrders(() => {
      loadOrders();
    });

    const interval = setInterval(loadOrders, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isAdmin]);

  const handleStatusChange = async (orderNumber: string, newStatus: OrderStatus) => {
    setIsUpdating(orderNumber);
    try {
      await updateOrderStatus(orderNumber, newStatus);
      await loadOrders();
    } catch (err) {
      console.error('Status change error', err);
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-[#f4c2c2]" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  // Calculate Overview Stats
  const todayRevenue = orders
    .filter((o) => o.orderStatus !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.orderStatus === 'PLACED').length;
  const preparingCount = orders.filter((o) => o.orderStatus === 'ACCEPTED' || o.orderStatus === 'PREPARING').length;
  const readyCount = orders.filter((o) => o.orderStatus === 'READY').length;

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ACTIVE') {
      if (o.orderStatus === 'COMPLETED' || o.orderStatus === 'CANCELLED') return false;
    } else if (filterStatus !== 'ALL') {
      if (o.orderStatus !== filterStatus) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Live Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950">Live Orders Board</h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Real-time incoming customer orders at Amity University Jaipur OTT Cafe.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/kitchen"
              className="bg-[#18181b] hover:bg-zinc-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <ChefHat className="w-4 h-4 text-[#f4c2c2]" />
              <span>Open Kitchen KDS</span>
            </Link>
            <button
              onClick={loadOrders}
              className="p-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-100 text-zinc-700 shadow-xs"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
              <span>Today&apos;s Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-zinc-900">₹{todayRevenue}</div>
            <span className="text-[10px] text-zinc-400 block">{orders.length} total orders</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-blue-600 font-bold">
              <span>Pending New</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-700">{pendingCount}</div>
            <span className="text-[10px] text-zinc-400 block">Needs acceptance</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
              <span>In Kitchen</span>
              <ChefHat className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-700">{preparingCount}</div>
            <span className="text-[10px] text-zinc-400 block">Currently cooking</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
              <span>Ready for Pickup</span>
              <Bell className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700">{readyCount}</div>
            <span className="text-[10px] text-zinc-400 block">Awaiting customer</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
              <span>Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-zinc-900">{orders.length}</div>
            <span className="text-[10px] text-zinc-400 block">All recorded</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {['ACTIVE', 'ALL', 'PLACED', 'PREPARING', 'READY', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-[#18181b] text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {st === 'ACTIVE' ? 'Active Orders' : st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search order #, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#e8959d]"
            />
          </div>
        </div>

        {/* Orders Cards Grid */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-zinc-200 space-y-2">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-800">No matching orders found</h3>
            <p className="text-xs text-zinc-400">
              When students place orders from the campus website, they will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-3xl border shadow-sm p-5 flex flex-col justify-between transition-all ${
                    order.orderStatus === 'PLACED'
                      ? 'border-blue-300 ring-2 ring-blue-100'
                      : order.orderStatus === 'READY'
                      ? 'border-emerald-300 ring-2 ring-emerald-100'
                      : 'border-zinc-200'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-zinc-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-zinc-950">
                            #{order.orderNumber}
                          </span>
                          <OrderStatusBadge status={order.orderStatus} size="sm" />
                        </div>
                        <div className="text-xs font-bold text-zinc-700 mt-0.5">
                          {order.customerName} •{' '}
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="text-[#881337] hover:underline"
                          >
                            {order.customerPhone}
                          </a>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-[#881337] block">
                          ₹{order.total}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-semibold block">
                          {formattedTime}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 bg-zinc-50/80 p-3 rounded-2xl border border-zinc-100 text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-zinc-800 font-medium">
                            <strong className="font-black text-zinc-950">{it.quantity}×</strong>{' '}
                            {it.itemNameSnapshot}
                            {it.selectedOption && (
                              <span className="text-[10px] text-zinc-500 ml-1">
                                ({it.selectedOption})
                              </span>
                            )}
                          </span>
                          <span className="font-bold text-zinc-700">₹{it.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    {/* Special Instructions Note */}
                    {order.specialInstructions && (
                      <div className="p-2.5 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-200/80">
                        <strong className="font-bold">Note:</strong> {order.specialInstructions}
                      </div>
                    )}
                  </div>

                  {/* Status Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-zinc-100 space-y-2">
                    <div className="grid grid-cols-2 gap-1.5">
                      {order.orderStatus === 'PLACED' && (
                        <button
                          onClick={() => handleStatusChange(order.orderNumber, 'ACCEPTED')}
                          disabled={isUpdating === order.orderNumber}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors col-span-2 shadow-xs"
                        >
                          Accept Order
                        </button>
                      )}

                      {(order.orderStatus === 'PLACED' || order.orderStatus === 'ACCEPTED') && (
                        <button
                          onClick={() => handleStatusChange(order.orderNumber, 'PREPARING')}
                          disabled={isUpdating === order.orderNumber}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors col-span-2 shadow-xs"
                        >
                          Start Preparing
                        </button>
                      )}

                      {order.orderStatus === 'PREPARING' && (
                        <button
                          onClick={() => handleStatusChange(order.orderNumber, 'READY')}
                          disabled={isUpdating === order.orderNumber}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors col-span-2 shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>Mark Ready for Pickup</span>
                        </button>
                      )}

                      {order.orderStatus === 'READY' && (
                        <button
                          onClick={() => handleStatusChange(order.orderNumber, 'COMPLETED')}
                          disabled={isUpdating === order.orderNumber}
                          className="bg-[#18181b] hover:bg-zinc-800 text-[#f4c2c2] font-black text-xs py-2.5 px-3 rounded-xl transition-colors col-span-2 shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete & Handover</span>
                        </button>
                      )}

                      {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED' && (
                        <button
                          onClick={() => {
                            if (confirm(`Cancel order #${order.orderNumber}?`)) {
                              handleStatusChange(order.orderNumber, 'CANCELLED');
                            }
                          }}
                          disabled={isUpdating === order.orderNumber}
                          className="text-rose-600 hover:bg-rose-50 text-[11px] font-bold py-1.5 px-2 rounded-lg transition-colors col-span-2 text-center"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
