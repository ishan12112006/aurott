'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ShieldCheck, Globe, MapPin, Clock3, Camera, AtSign, Phone, Mail, Image as ImageIcon } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import AdminNavbar from '@/components/AdminNavbar';
import { DEFAULT_CAFE_SETTINGS } from '@/data/menuData';
import { getCafeSettings, updateCafeSettings } from '@/lib/db';
import { CafeSettings } from '@/types';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminAuth();
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_CAFE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
      return;
    }

    if (isAdmin) {
      getCafeSettings().then((data) => setSettings({ ...DEFAULT_CAFE_SETTINGS, ...data }));
    }
  }, [isAdmin, isLoading, router]);

  const updateField = (field: keyof CafeSettings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await updateCafeSettings(settings);
      setStatus('Website details saved successfully.');
    } catch (error) {
      setStatus('Unable to save website details right now.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-700">
        <span className="text-sm font-medium">Verifying admin access...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#881337]" />
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950">Website Settings</h1>
            </div>
            <p className="text-xs text-zinc-500">Edit storefront branding, footer details, and opening hours from here.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#18181b] disabled:bg-zinc-400 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {status && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
            {status}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5 bg-white rounded-3xl border border-zinc-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-black text-zinc-900">
              <Globe className="w-4 h-4 text-[#881337]" />
              Brand & Identity
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-zinc-700">
                Cafe Name
                <input value={settings.cafeName} onChange={(e) => updateField('cafeName', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>

              <label className="block text-xs font-bold text-zinc-700">
                Tagline
                <input value={settings.tagline} onChange={(e) => updateField('tagline', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>

              <label className="block text-xs font-bold text-zinc-700">
                Logo URL
                <div className="mt-1 relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input value={settings.logoUrl ?? ''} onChange={(e) => updateField('logoUrl', e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-5 bg-white rounded-3xl border border-zinc-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-black text-zinc-900">
              <Clock3 className="w-4 h-4 text-[#881337]" />
              Shop Details
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-zinc-700">
                Campus / Location Name
                <input value={settings.campus} onChange={(e) => updateField('campus', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>

              <label className="block text-xs font-bold text-zinc-700">
                Opening Hours
                <input value={settings.openingHours} onChange={(e) => updateField('openingHours', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>

              <label className="block text-xs font-bold text-zinc-700">
                Full Address
                <textarea value={settings.locationAddress} rows={3} onChange={(e) => updateField('locationAddress', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                <input id="accepting-orders" type="checkbox" checked={settings.isAcceptingOrders} onChange={(e) => updateField('isAcceptingOrders', e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-[#881337] focus:ring-[#e8959d]" />
                <label htmlFor="accepting-orders" className="text-xs font-bold text-zinc-700">Accept incoming orders right now</label>
              </div>
            </div>
          </div>

          <div className="space-y-5 bg-white rounded-3xl border border-zinc-200 p-5 shadow-xs lg:col-span-2">
            <div className="flex items-center gap-2 text-sm font-black text-zinc-900">
              <AtSign className="w-4 h-4 text-[#881337]" />
              Contact & Footer Details
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-zinc-500" /> Phone</span>
                <input value={settings.phone} onChange={(e) => updateField('phone', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>

              <label className="block text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-zinc-500" /> Email</span>
                <input value={settings.email} onChange={(e) => updateField('email', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>

              <label className="block text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-2"><Camera className="w-3.5 h-3.5 text-zinc-500" /> Instagram</span>
                  <input value={settings.instagram} onChange={(e) => updateField('instagram', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>

              <label className="block text-xs font-bold text-zinc-700">
                UPI ID
                <input value={settings.upiId} onChange={(e) => updateField('upiId', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>

              <label className="block text-xs font-bold text-zinc-700">
                Copyright Text
                <input value={settings.copyrightText} onChange={(e) => updateField('copyrightText', e.target.value)} placeholder="Ishan Panwar. All rights reserved." className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
              </label>
            </div>

            <label className="block text-xs font-bold text-zinc-700">
              Pickup Instructions
              <textarea rows={3} value={settings.pickupInstructions} onChange={(e) => updateField('pickupInstructions', e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#e8959d]" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
