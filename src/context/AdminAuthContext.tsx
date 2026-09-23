'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AdminAuthContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  login: (password: string, email?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'ott_admin_session';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local session token
    try {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        if (session.isAdmin) {
          setIsAdmin(true);
          setAdminEmail(session.email || 'admin@ottcafe.amity.edu');
        }
      }
    } catch (e) {
      console.error('Failed reading admin session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (password: string, email?: string) => {
    // 1. Try Supabase Auth if credentials provided
    if (isSupabaseConfigured && supabase && email) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (!error && data.user) {
          // Check role in profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profile?.role === 'admin' || profile?.role === 'staff' || email.includes('admin')) {
            setIsAdmin(true);
            setAdminEmail(data.user.email || email);
            localStorage.setItem(
              ADMIN_SESSION_KEY,
              JSON.stringify({ isAdmin: true, email: data.user.email })
            );
            return { success: true };
          }
        }
      } catch (err) {
        console.warn('Supabase auth attempt error:', err);
      }
    }

    // 2. Default Campus Admin Passcode authentication
    // Configured password is 'ishan@123456789'
    const allowedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ishan@123456789';
    const cleanPass = (password || '').trim();
    const cleanAllowed = (allowedPassword || 'ishan@123456789').trim();

    if (
      cleanPass === cleanAllowed ||
      cleanPass === 'ishan@123456789' ||
      cleanPass.toLowerCase() === 'ishan@123456789' ||
      cleanPass.toLowerCase() === cleanAllowed.toLowerCase()
    ) {
      setIsAdmin(true);
      const emailToUse = (email || 'admin@ottcafe.amity.edu').trim();
      setAdminEmail(emailToUse);
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ isAdmin: true, email: emailToUse }));
      return { success: true };
    }

    return { success: false, message: 'Invalid admin credentials or password' };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setIsAdmin(false);
    setAdminEmail(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, adminEmail, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
