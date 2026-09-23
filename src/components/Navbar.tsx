'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu as MenuIcon, X, MapPin, Coffee, Utensils, Clock, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, subtotal, setIsCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If inside /admin, we show AdminNavbar or customized view
  const isAdminRoute = pathname?.startsWith('/admin');

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      {/* Campus Top Announcement Bar */}
      <div className="bg-[#121113] text-white text-xs py-1.5 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400 text-[11px] sm:text-xs">
              Live Counter Open
            </span>
            <span className="text-zinc-500">•</span>
            <span className="inline-flex items-center gap-1 font-medium text-zinc-300 text-[11px] sm:text-xs">
              <MapPin className="w-3 h-3 text-[#e8959d]" />
              Amity University Jaipur
            </span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400">
              <Clock className="w-3 h-3 text-[#e8959d]" /> 9:00 AM – 10:00 PM
            </span>
            <Link
              href="/admin"
              className="text-[11px] text-[#f4c2c2] hover:text-white flex items-center gap-1 pl-2.5 border-l border-zinc-800 transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-[#e8959d]" /> Staff
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#18181b] border border-[#e8959d]/60 flex flex-col items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#e8959d] group-hover:shadow-[0_0_20px_rgba(232,149,157,0.35)]">
              <span className="text-[7.5px] font-black tracking-widest text-[#e8959d] leading-none mb-0.5">OUT OF</span>
              <span className="text-xs sm:text-sm font-black tracking-wider leading-none text-white">OTT</span>
              <span className="text-[6.5px] font-bold text-zinc-400 leading-none mt-0.5">THE TOWN</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#18181b] group-hover:text-zinc-900 transition-colors">
                  OTT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc7e87] to-[#881337]">Cafe</span>
                </span>
                <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#fce7e9] to-[#f4c2c2]/50 text-[#881337] px-2.5 py-0.5 rounded-full border border-rose-200/50 shadow-xs">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block font-medium">Amity University Jaipur</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-white/70 p-1.5 rounded-full border border-zinc-200/60 shadow-xs backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-[#18181b] text-white shadow-sm'
                      : 'text-zinc-600 hover:text-[#18181b] hover:bg-rose-50/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#881337] bg-gradient-to-r from-[#fce7e9] to-[#fce7e9]/60 hover:from-[#f4c2c2] hover:to-[#e8959d] hover:text-[#18181b] transition-all border border-[#e8959d]/40 ml-1 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Action buttons (Search & Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/menu"
              className="p-2.5 rounded-full text-zinc-700 hover:text-black hover:bg-rose-50/80 transition-all border border-transparent hover:border-rose-100"
              title="Search Menu"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Cart trigger button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold transition-all duration-300 active:scale-95 shadow-md ${
                itemCount > 0
                  ? 'bg-gradient-to-r from-[#18181b] to-zinc-900 text-white shadow-rose-950/10 border border-[#e8959d]/40'
                  : 'bg-[#18181b] text-white hover:bg-zinc-800'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#f4c2c2]" />
                {itemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-[#e8959d] to-[#dc7e87] text-[#18181b] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-subtle-pulse">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs sm:text-sm font-extrabold tracking-tight">
                {itemCount > 0 ? `₹${subtotal}` : 'Cart'}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-700 hover:bg-rose-50 rounded-xl transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#f0e6dd] px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#18181b] text-white'
                    : 'text-zinc-700 hover:bg-[#fce7e9]/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Amity University Jaipur</span>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-[#881337] bg-[#fce7e9] px-3 py-1.5 rounded-full"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
