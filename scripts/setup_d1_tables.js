const ACCOUNT_ID = '0c21f8b6e38195d7c29e57ca8998cf48';
const API_TOKEN = process.env.CF_API_TOKEN || '';
const DB_ID = 'a450128e-ad2a-4e76-a7c1-efa9225ea66d';

async function createTables() {
  const sql = `
    CREATE TABLE IF NOT EXISTS kusina_suggestions (
      id TEXT PRIMARY KEY,
      recipe_name TEXT NOT NULL,
      category TEXT NOT NULL,
      notes TEXT,
      author_name TEXT,
      contact_info TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS kusina_saved_costings (
      id TEXT PRIMARY KEY,
      recipe_id TEXT NOT NULL,
      recipe_name TEXT NOT NULL,
      servings INTEGER NOT NULL,
      target_margin REAL NOT NULL,
      cost_per_serving REAL NOT NULL,
      suggested_srp REAL NOT NULL,
      profit_per_serving REAL NOT NULL,
      total_batch_profit REAL NOT NULL,
      price_overrides TEXT,
      overhead_breakdown TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS kusina_security_honeypot_logs (
      id TEXT PRIMARY KEY,
      ip TEXT,
      user_agent TEXT,
      trap_field TEXT,
      payload TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql })
  });

  const data = await res.json();
  console.log('Result:', JSON.stringify(data, null, 2));
}

createTables().catch(console.error);
