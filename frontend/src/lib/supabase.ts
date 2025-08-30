// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types'; // 👈 Import the auto-generated types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing from .env file");
}

// Initialize Supabase client using the imported types
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);