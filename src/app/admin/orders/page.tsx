'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getAllOrders, updateOrderStatus } from '@/lib/db';
import { Order, OrderStatus } from '@/types';
import AdminNavbar from '@/components/AdminNavbar';
import OrderStatusBadge from '@/components/OrderStatusBadge';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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
  }, [isAdmin]);

  const handleStatusChange = async (orderNumber: string, nextStatus: OrderStatus) => {
    setUpdatingOrder(orderNumber);
    setActionError(null);
    try {
      const updated = await updateOrderStatus(orderNumber, nextStatus);
      if (!updated) throw new Error('The order could not be updated. Please reload and try again.');
      await loadOrders();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'The order could not be updated.');
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <RefreshCw className="w-4 h-4 animate-spin text-[#881337]" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'ALL' && o.orderStatus !== selectedStatus) {
      return false;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950">

        {actionError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-800">
            {actionError}
          </div>
        )}
              Orders History & Archives
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Search and filter every order placed at OTT Cafe Amity University Jaipur.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Orders</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by order #, phone, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#e8959d]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-48 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-zinc-700 focus:outline-none focus:border-[#e8959d]"
            >
              <option value="ALL">All Statuses ({orders.length})</option>
              <option value="PLACED">Placed</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY">Ready</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100 text-zinc-600 font-extrabold text-[11px] uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-zinc-500">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const dateObj = new Date(order.createdAt);
                    const formattedDate = dateObj.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    });
                    const formattedTime = dateObj.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-black text-zinc-950">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-zinc-900">{order.customerName}</div>
                          <div className="text-[11px] text-zinc-500">{order.customerPhone}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-xs text-zinc-700 font-medium truncate">
                            {order.items.map((i) => `${i.quantity}x ${i.itemNameSnapshot}`).join(', ')}
                          </div>
                          {order.specialInstructions && (
                            <div className="text-[10px] text-amber-700 truncate">
                              Note: {order.specialInstructions}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-black text-[#881337]">₹{order.total}</span>
                          <span className="text-[10px] text-zinc-400 block">
                            {order.paymentMethod === 'UPI' ? 'UPI' : 'Cash'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <OrderStatusBadge status={order.orderStatus} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-xs text-zinc-500">
                          <div>{formattedDate}</div>
                          <div className="text-[10px] text-zinc-400">{formattedTime}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {order.orderStatus === 'PLACED' && (
                            <button
                              onClick={() => handleStatusChange(order.orderNumber, 'ACCEPTED')}
                              disabled={updatingOrder === order.orderNumber}
                              className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
                            >
                              {updatingOrder === order.orderNumber ? 'Updating...' : 'Accept'}
                            </button>
                          )}
                          {order.orderStatus === 'ACCEPTED' && (
                            <button
                              onClick={() => handleStatusChange(order.orderNumber, 'PREPARING')}
                              disabled={updatingOrder === order.orderNumber}
                              className="text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg hover:bg-amber-100 disabled:opacity-50"
                            >
                              Prepare
                            </button>
                          )}
                          {order.orderStatus === 'PREPARING' && (
                            <button
                              onClick={() => handleStatusChange(order.orderNumber, 'READY')}
                              disabled={updatingOrder === order.orderNumber}
                              className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                            >
                              Ready
                            </button>
                          )}
                          {order.orderStatus === 'READY' && (
                            <button
                              onClick={() => handleStatusChange(order.orderNumber, 'COMPLETED')}
                              disabled={updatingOrder === order.orderNumber}
                              className="text-xs font-bold bg-[#18181b] text-white px-2.5 py-1 rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                            >
                              Complete
                            </button>
                          )}
                          {order.orderStatus === 'COMPLETED' && (
                            <span className="text-xs text-zinc-400 font-semibold">Done</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
