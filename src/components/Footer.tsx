import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#18181b] text-white border-t border-zinc-800 pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#e8959d] flex flex-col items-center justify-center text-[#18181b]">
                <span className="text-[7px] font-black tracking-widest text-[#dc7e87]">OUT OF</span>
                <span className="text-xs font-black tracking-wider leading-none">OTT</span>
                <span className="text-[6px] font-bold text-zinc-500">THE TOWN</span>
              </div>
              <span className="text-xl font-black tracking-tight">
                OTT <span className="text-[#f4c2c2]">Cafe</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              &quot;Good Food. Good Vibes. Campus Life.&quot;
            </p>
            <p className="text-xs text-zinc-400">
              A campus cafe made for students, friends, and everyday cravings right inside Amity University Jaipur.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#f4c2c2] mb-4">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">
                  Full Cafe Menu
                </Link>
              </li>
              <li>
                <Link href="/menu?category=shakes" className="hover:text-white transition-colors">
                  Signature Shakes
                </Link>
              </li>
              <li>
                <Link href="/menu?category=chinese" className="hover:text-white transition-colors">
                  Wok-tossed Chinese
                </Link>
              </li>
              <li>
                <Link href="/menu?category=momos" className="hover:text-white transition-colors">
                  Kurkure & Steam Momos
                </Link>
              </li>
              <li>
                <Link href="/menu?category=sandwich-burger" className="hover:text-white transition-colors">
                  Burgers & Sandwiches
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#f4c2c2] mb-4">
              Campus Services
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Live Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About OTT Cafe
                </Link>
              </li>
              <li>
                <a
                  href="/menu/ott_menu.jpeg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f4c2c2] flex items-center gap-1 transition-colors"
                >
                  View Physical Menu Board <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Timings */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#f4c2c2] mb-4">
              Visit Us
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e8959d] shrink-0 mt-0.5" />
                <span>
                  OTT Cafe, Food Court Area,
                  <br />
                  Amity University Jaipur Campus,
                  <br />
                  Kant Kalwar, NH-11C, Jaipur (303002)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#e8959d] shrink-0" />
                <span>Open Daily: 9:00 AM – 10:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#e8959d] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>@ottcafe.amity</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Ishan Panwar. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-400">
              OTT Cafe Amity University Jaipur • Designed & Developed by Ishan Panwar
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
