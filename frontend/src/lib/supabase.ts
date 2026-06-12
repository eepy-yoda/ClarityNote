import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tosrecqiakdfkszzbbqb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tnHJCDdJAIrX1o4_3x5lmg_cd4h3v4i';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
