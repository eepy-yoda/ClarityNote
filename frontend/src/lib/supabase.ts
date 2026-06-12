import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tosrecqiakdfkszzbbqb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc3JlY3FpYWtkZmtzenpiYnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTAyOTAsImV4cCI6MjA5MTA2NjI5MH0.3rGT16yc675OMbRLvXBHjjMHdjV4uLHkxXSpWDJFTnM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
