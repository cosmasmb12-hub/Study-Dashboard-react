import { createClient } from '@supabase/supabase-js';

// 1. Paste your real credentials here as fallbacks
const FALLBACK_URL = 'https://YOUR_PROJECT_ID.supabase.co'; // <-- PASTE YOUR SUPABASE URL HERE
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // <-- PASTE YOUR ANON KEY HERE

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('YOUR_PROJECT_ID');
const isValidKey = supabaseAnonKey && supabaseAnonKey.startsWith('ey') && !supabaseAnonKey.includes('...');

if (!isValidUrl || !isValidKey) {
  console.warn('⚠️ Supabase credentials invalid. Check src/lib/supabase.js');
}

export const supabase = (isValidUrl && isValidKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;