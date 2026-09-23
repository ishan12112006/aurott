'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Loader2, Eye, EyeOff, KeyRound, Check } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdmin, isLoading } = useAdminAuth();

  const [email, setEmail] = useState('admin@ottcafe.amity.edu');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // If already logged in, redirect to admin safely in useEffect
  useEffect(() => {
    if (!isLoading && isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await login(password.trim(), email.trim());
      if (res.success) {
        router.push('/admin');
      } else {
        setErrorMsg(res.message || 'Incorrect password or unauthorized access.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillDefault = () => {
    setPassword('ishan@123456789');
    setEmail('admin@ottcafe.amity.edu');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (isLoading || isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#881337]" />
        <span className="text-xs text-zinc-500 font-medium">
          {isAdmin ? 'Redirecting to Admin Portal...' : 'Verifying session...'}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#f0e6dd] p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#18181b] text-[#f4c2c2] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-zinc-950">OTT Staff & Admin</h1>
          <p className="text-xs text-zinc-500">
            Sign in to manage live orders, kitchen display system, and menu.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#f0e6dd] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#e8959d] focus:ring-2 focus:ring-[#fce7e9]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-zinc-700">
                Admin Passcode / Key
              </label>
              <button
                type="button"
                onClick={handleAutofillDefault}
                className="text-[11px] font-bold text-[#881337] hover:underline flex items-center gap-1"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Autofilled!</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3 h-3" />
                    <span>Autofill Passcode</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter admin passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#f0e6dd] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#e8959d] focus:ring-2 focus:ring-[#fce7e9]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-2 p-2 bg-amber-50/80 border border-amber-200/60 rounded-xl flex items-center justify-between gap-2">
              <span className="text-[11px] text-amber-900">
                Default Passcode: <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold">ishan@123456789</code>
              </span>
              <button
                type="button"
                onClick={handleAutofillDefault}
                className="text-[10px] font-bold bg-white text-zinc-800 px-2 py-1 rounded-lg border border-amber-200 hover:bg-amber-100/50 shadow-xs"
              >
                Use this
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#18181b] hover:bg-zinc-800 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#f4c2c2]" />
            ) : (
              <>
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4 text-[#f4c2c2]" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-900 font-semibold">
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
