import React from 'react';
import { OrderStatus } from '@/types';
import { Clock, CheckCircle2, ChefHat, Bell, Check, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'PLACED':
        return {
          label: 'Order Placed',
          icon: Clock,
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'ACCEPTED':
        return {
          label: 'Accepted',
          icon: CheckCircle2,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
        };
      case 'PREPARING':
        return {
          label: 'Preparing in Kitchen',
          icon: ChefHat,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'READY':
        return {
          label: 'Ready for Pickup',
          icon: Bell,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-black',
          dot: 'bg-emerald-500',
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          icon: Check,
          bg: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          dot: 'bg-zinc-500',
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          icon: XCircle,
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
        };
      default:
        return {
          label: status,
          icon: Clock,
          bg: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          dot: 'bg-zinc-500',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-xs ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
