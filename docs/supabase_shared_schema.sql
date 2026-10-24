-- ==============================================================
-- KUSINASCALE BACKEND SCHEMA (Shared Supabase Database)
-- Connected to: https://eeetozfjqqrozwysjsgk.supabase.co
-- Zero conflict with Manna Hardware tables (orders, products, etc.)
-- ==============================================================

-- 1. Table: kusina_suggestions (Community Recipe & Suggestion Submissions)
CREATE TABLE IF NOT EXISTS public.kusina_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_name TEXT NOT NULL,
    category TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: kusina_saved_costings (Carinderia / Kitchen Saved Calculations)
CREATE TABLE IF NOT EXISTS public.kusina_saved_costings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id TEXT NOT NULL,
    recipe_name TEXT NOT NULL,
    servings INTEGER NOT NULL,
    target_margin NUMERIC NOT NULL,
    cost_per_serving NUMERIC NOT NULL,
    suggested_srp NUMERIC NOT NULL,
    profit_per_serving NUMERIC NOT NULL,
    total_batch_profit NUMERIC NOT NULL,
    price_overrides JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: kusina_community_recipes (User Submitted Custom Recipes)
CREATE TABLE IF NOT EXISTS public.kusina_community_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    prep_minutes INTEGER DEFAULT 15,
    cook_minutes INTEGER DEFAULT 30,
    default_servings INTEGER DEFAULT 4,
    ingredients JSONB NOT NULL,
    steps JSONB NOT NULL,
    chef_tips JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.kusina_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kusina_saved_costings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kusina_community_recipes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous / authenticated read and insert
CREATE POLICY "Allow public insert to kusina_suggestions" 
ON public.kusina_suggestions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read of kusina_suggestions" 
ON public.kusina_suggestions FOR SELECT USING (true);

CREATE POLICY "Allow public insert to kusina_saved_costings" 
ON public.kusina_saved_costings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read of kusina_saved_costings" 
ON public.kusina_saved_costings FOR SELECT USING (true);

CREATE POLICY "Allow public insert to kusina_community_recipes" 
ON public.kusina_community_recipes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read of kusina_community_recipes" 
ON public.kusina_community_recipes FOR SELECT USING (true);
