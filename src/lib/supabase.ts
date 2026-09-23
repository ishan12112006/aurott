import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^["']|["']$/g, '');
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/^["']|["']$/g, '');

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawAnonKey &&
  rawUrl.startsWith('http') &&
  !rawUrl.includes('your-project') &&
  rawAnonKey.length > 20
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured && rawUrl && rawAnonKey) {
  try {
    client = createClient(rawUrl, rawAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    client = null;
  }
}

export const supabase = client;
