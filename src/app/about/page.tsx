import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Coffee, Heart, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { DEFAULT_CAFE_SETTINGS } from '@/data/menuData';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-[#881337] bg-[#fce7e9] px-3.5 py-1.5 rounded-full inline-block">
          Amity University Jaipur Campus
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">
          About OTT Cafe
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto font-medium">
          &quot;A campus cafe made for students, friends, and everyday cravings.&quot;
        </p>
      </div>

      {/* Main Story & Values */}
      <div className="bg-white rounded-3xl border border-[#f0e6dd] p-6 sm:p-10 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-zinc-900">
              The Heart of Campus Bites
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Located right inside the Amity University Jaipur campus, OTT Cafe (&quot;Out Of The Town&quot;) is where students gather between classes, catch up over chilled cold coffees, and power through study sessions with hot momos, burgers, and biryanis.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Our mission is simple: provide fresh, hygienic, flavorful, and pocket-friendly food with transparent prices and minimal counter wait times.
            </p>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden bg-zinc-100 border border-[#f0e6dd]">
            <Image
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80"
              alt="OTT Cafe Amity Jaipur"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
          <div className="p-4 bg-zinc-50 rounded-2xl space-y-1.5">
            <Coffee className="w-5 h-5 text-[#881337]" />
            <h3 className="text-sm font-bold text-zinc-900">Fresh Preparation</h3>
            <p className="text-xs text-zinc-500">Every order is cooked fresh upon receiving.</p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl space-y-1.5">
            <Heart className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-zinc-900">Student First</h3>
            <p className="text-xs text-zinc-500">Affordable pricing from ₹20 to ₹99.</p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl space-y-1.5">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900">Instant Counter Pickup</h3>
            <p className="text-xs text-zinc-500">Order from class and pick up when notified.</p>
          </div>
        </div>
      </div>

      {/* Official Menu Board Card */}
      <div className="bg-[#18181b] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-black">Official Cafe Menu Board</h3>
          <p className="text-xs text-zinc-400 max-w-md">
            View the high-resolution photo of the physical OTT Cafe price board installed at the Amity Jaipur counter.
          </p>
        </div>
        <a
          href="/menu/ott_menu.jpeg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#e8959d] hover:bg-[#dc7e87] text-[#18181b] font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>View Menu Photo</span>
        </a>
      </div>

      {/* Campus Info & Timings */}
      <div className="bg-white rounded-3xl border border-[#f0e6dd] p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">
          Campus Information & Timings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-zinc-600">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#881337] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-zinc-900">Location:</strong>
              {DEFAULT_CAFE_SETTINGS.locationAddress}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#881337] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-zinc-900">Operating Hours:</strong>
              {DEFAULT_CAFE_SETTINGS.openingHours}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Ishan Panwar. All rights reserved.</p>
          <span className="text-[11px] text-zinc-400">OTT Cafe Amity Jaipur</span>
        </div>
      </div>
    </div>
  );
}
