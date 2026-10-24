export interface RecipeSuggestionInput {
  recipe_name: string;
  category: string;
  notes?: string;
  author_name?: string;
  contact_info?: string;
  bot_field?: string;
}

export interface SavedCostingPayload {
  recipe_id: string;
  recipe_name: string;
  servings: number;
  target_margin: number;
  cost_per_serving: number;
  suggested_srp: number;
  profit_per_serving: number;
  total_batch_profit: number;
  price_overrides: Record<string, number>;
  overhead_breakdown?: any;
  bot_trap?: string;
}

export async function submitRecipeSuggestion(input: RecipeSuggestionInput) {
  const res = await fetch('/api/suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return res.json();
}

export async function fetchRecentSuggestions() {
  const res = await fetch('/api/suggestions');
  return res.json();
}

export async function saveRecipeCosting(payload: SavedCostingPayload) {
  const res = await fetch('/api/costings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchSavedCostingById(id: string) {
  const res = await fetch(`/api/costings?id=${encodeURIComponent(id)}`);
  return res.json();
}
