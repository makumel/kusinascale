import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eeetozfjqqrozwysjsgk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9-rdqmNHZSqyOERyYSs2xg_-Sd0L1-I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface KusinaSuggestionRecord {
  id?: string;
  recipe_name: string;
  category: string;
  notes?: string;
  created_at?: string;
}

export interface KusinaCostingRecord {
  id?: string;
  recipe_id: string;
  recipe_name: string;
  servings: number;
  target_margin: number;
  cost_per_serving: number;
  suggested_srp: number;
  profit_per_serving: number;
  total_batch_profit: number;
  price_overrides: Record<string, number>;
  created_at?: string;
}
