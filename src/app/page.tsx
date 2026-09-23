import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Flame,
  Sparkles,
  Clock,
  MapPin,
  Coffee,
  CheckCircle,
  FileText,
  Search,
} from 'lucide-react';
import { getCategories, getMenuItems } from '@/lib/db';
import MenuCard from '@/components/MenuCard';

export const revalidate = 60; // ISR cache

export default async function HomePage() {
  const [categories, items] = await Promise.all([getCategories(), getMenuItems()]);

  // Featured items on campus
  const featuredItems = items.filter((i) => i.isFeatured).slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fce7e9]/40 via-white to-[#fdfbf9] pt-8 sm:pt-20 pb-16 sm:pb-24 border-b border-[#f0e6dd]">
        {/* Ambient Blurred Glowing Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-tr from-rose-200/40 to-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-purple-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fce7e9] to-[#f4c2c2]/50 text-[#881337] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs border border-rose-200/50">
                <Sparkles className="w-3.5 h-3.5 text-[#dc7e87]" />
                Inside Amity University Jaipur Campus
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.08]">
                Your Campus.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc7e87] via-[#881337] to-[#18181b]">
                  Your Cafe.
                </span>{' '}
                <br className="hidden sm:inline" />
                Your Cravings.
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Fresh food, thick shakes, crunchy kurkure momos, and hot combos — prepared fresh to order right inside Amity University Jaipur.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#18181b] to-zinc-900 hover:from-black hover:to-zinc-800 text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-zinc-700/50"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4 text-[#f4c2c2]" />
                </Link>
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-zinc-800 border-2 border-[#f0e6dd] hover:border-[#e8959d] font-bold text-base px-6 py-3.5 rounded-2xl shadow-xs transition-all hover:scale-[1.02]"
                >
                  <Search className="w-4 h-4 text-zinc-500" />
                  <span>View Full Menu</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-200/60 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="bg-white/60 p-3 rounded-2xl border border-zinc-200/50 backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-black text-zinc-950">70+</div>
                  <div className="text-[11px] text-zinc-500 font-semibold">Menu Dishes</div>
                </div>
                <div className="bg-white/60 p-3 rounded-2xl border border-zinc-200/50 backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-black text-zinc-950">10-15m</div>
                  <div className="text-[11px] text-zinc-500 font-semibold">Average Prep</div>
                </div>
                <div className="bg-white/60 p-3 rounded-2xl border border-zinc-200/50 backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-black text-zinc-950">₹20 - ₹99</div>
                  <div className="text-[11px] text-zinc-500 font-semibold">Student Friendly</div>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                {/* Background decorative blob */}
                <div className="absolute -inset-6 bg-gradient-to-tr from-[#fce7e9] via-[#f4c2c2] to-amber-100 rounded-3xl blur-2xl opacity-75 transform -rotate-3" />

                {/* Main Hero Card */}
                <div className="relative bg-white/95 p-3.5 sm:p-4 rounded-3xl shadow-card border border-white backdrop-blur-md">
                  <div className="relative w-full h-72 sm:h-84 rounded-2xl overflow-hidden bg-zinc-100">
                    <Image
                      src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80"
                      alt="OTT Cafe Cold Coffee and Fast Food"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#e8959d] to-[#dc7e87] text-[#18181b] px-2.5 py-0.5 rounded-full inline-block mb-1.5 shadow-sm">
                        Student Favorite
                      </span>
                      <h3 className="text-xl font-black leading-tight text-white">Thick Cold Coffee & Shakes</h3>
                      <p className="text-xs text-zinc-200 mt-1">₹90 • Campus classic with chocolate drizzle</p>
                    </div>
                  </div>

                  {/* Floating Micro-badge 1 (Bottom Left) */}
                  <div className="absolute -bottom-5 -left-5 bg-[#18181b] text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-700/60 animate-float-slow z-20">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e8959d] to-[#f4c2c2] text-[#18181b] flex items-center justify-center font-black shadow-sm">
                      OTT
                    </div>
                    <div>
                      <div className="text-xs font-bold">Counter Pickup</div>
                      <div className="text-[10px] text-zinc-400">Order ahead, skip the line</div>
                    </div>
                  </div>

                  {/* Floating Micro-badge 2 (Top Right) */}
                  <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md text-zinc-900 px-3.5 py-2 rounded-2xl shadow-lg border border-[#f0e6dd] flex items-center gap-2 text-xs font-black animate-float-delayed z-20">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Hot Momos & Combos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY CHIPS BROWSE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Explore Campus Menu
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Select your craving and jump straight to that section.
            </p>
          </div>
          <Link
            href="/menu"
            className="text-xs sm:text-sm font-extrabold text-[#881337] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>See All 12 Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.slug}`}
              className="group relative flex flex-col items-center p-4 sm:p-5 bg-white rounded-3xl border border-[#f0e6dd] hover:border-[#e8959d]/70 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 active:scale-95 text-center overflow-hidden"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-rose-50 mb-3 group-hover:scale-105 transition-transform duration-500 ring-2 ring-transparent group-hover:ring-[#e8959d]/50 shadow-xs">
                <Image
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 group-hover:text-[#dc7e87] transition-colors leading-tight">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR ON CAMPUS (FEATURED ITEMS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#881337] uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              Campus Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Popular on Campus
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Top-voted cravings ordered by students daily.
            </p>
          </div>
          <Link
            href="/menu"
            className="text-xs sm:text-sm font-extrabold text-[#18181b] hover:text-[#881337] flex items-center gap-1"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* PHYSICAL MENU BOARD BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#18181b] text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-zinc-800">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#f4c2c2] bg-zinc-800 px-3 py-1 rounded-full">
              Official Cafe Board
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Transparent Prices. Exact Same Menu as the Counter.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Every dish and price on this platform is matched 100% to the official OTT Cafe board hanging at the counter in Amity University Jaipur.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="/menu/ott_menu.jpeg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#e8959d] hover:bg-[#dc7e87] text-[#18181b] font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>View Menu Board Image</span>
              </a>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors border border-zinc-700"
              >
                <span>Browse Online Menu</span>
              </Link>
            </div>
          </div>
          {/* Subtle background graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
            <Image
              src="/menu/ott_menu.jpeg"
              alt="OTT Menu Board"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHY OTT CAFE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Why Order Online from OTT Cafe?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Built for everyday campus life between classes and study sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-7 bg-white rounded-3xl border border-[#f0e6dd] hover:border-[#e8959d]/50 shadow-soft hover:shadow-card transition-all duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fce7e9] to-[#f4c2c2] text-[#881337] flex items-center justify-center shadow-xs">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-zinc-950">Skip the Counter Rush</h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Place your order from the lecture hall or hostel. Walk up when your order tracker says &quot;Ready for Pickup&quot;.
            </p>
          </div>

          <div className="p-7 bg-white rounded-3xl border border-[#f0e6dd] hover:border-[#e8959d]/50 shadow-soft hover:shadow-card transition-all duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 text-amber-800 flex items-center justify-center shadow-xs">
              <Flame className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-zinc-950">Prepared Fresh on Order</h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              No pre-cooked cold food. Momos, fries, paranthas, and shakes are whipped up hot and fresh upon acceptance.
            </p>
          </div>

          <div className="p-7 bg-white rounded-3xl border border-[#f0e6dd] hover:border-[#e8959d]/50 shadow-soft hover:shadow-card transition-all duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-zinc-950">Live Order Tracking</h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Keep an eye on real-time kitchen status: Placed → Accepted → Preparing → Ready for Counter Pickup.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
