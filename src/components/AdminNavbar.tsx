'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ChefHat,
  UtensilsCrossed,
  ClipboardList,
  BarChart3,
  ExternalLink,
  LogOut,
  Settings,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminNavbar() {
  const pathname = usePathname();
  const { logout, adminEmail } = useAdminAuth();

  const links = [
    { label: 'Live Orders', href: '/admin', icon: LayoutDashboard },
    { label: 'Kitchen KDS', href: '/admin/kitchen', icon: ChefHat },
    { label: 'Menu Manager', href: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Order History', href: '/admin/orders', icon: ClipboardList },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-30 glass-dark text-white border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Name */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#e8959d] to-[#f4c2c2] text-[#18181b] flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition-transform">
                OTT
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  Staff Portal
                </span>
                <span className="text-[10px] bg-rose-950/80 text-[#f4c2c2] border border-[#e8959d]/30 font-bold px-2 py-0.5 rounded-full">
                  Amity Jaipur
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-zinc-900/60 p-1 rounded-2xl border border-zinc-800">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-zinc-800 text-[#f4c2c2] border border-[#e8959d]/40 shadow-xs'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info & Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-[#f4c2c2]" />
            </Link>
            <button
              onClick={logout}
              className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Subnav */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-zinc-800/80">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#e8959d] text-[#18181b]'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
