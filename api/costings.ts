const accountId = process.env.CF_ACCOUNT_ID || '0c21f8b6e38195d7c29e57ca8998cf48';
const apiToken = process.env.CF_API_TOKEN || '';
const dbId = process.env.CF_D1_DATABASE_ID || 'a450128e-ad2a-4e76-a7c1-efa9225ea66d';

async function executeD1(sql: string, params: any[] = []) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  return response.json();
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const recipe_id = url.searchParams.get('recipe_id');

    if (id) {
      const data = await executeD1('SELECT * FROM kusina_saved_costings WHERE id = ? LIMIT 1;', [id]);
      const row = data.result?.[0]?.results?.[0];
      if (!row) {
        return new Response(JSON.stringify({ success: false, error: 'Costing not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ success: true, costing: row }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (recipe_id) {
      const data = await executeD1('SELECT * FROM kusina_saved_costings WHERE recipe_id = ? ORDER BY updated_at DESC LIMIT 5;', [recipe_id]);
      const rows = data.result?.[0]?.results || [];
      return new Response(JSON.stringify({ success: true, costings: rows }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await executeD1('SELECT id, recipe_id, recipe_name, servings, target_margin, cost_per_serving, suggested_srp, total_batch_profit, created_at FROM kusina_saved_costings ORDER BY created_at DESC LIMIT 15;');
    const rows = data.result?.[0]?.results || [];
    return new Response(JSON.stringify({ success: true, costings: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      recipe_id,
      recipe_name,
      servings,
      target_margin,
      cost_per_serving,
      suggested_srp,
      profit_per_serving,
      total_batch_profit,
      price_overrides,
      overhead_breakdown,
      bot_trap
    } = body;

    // Honeypot Protection
    if (bot_trap && String(bot_trap).trim() !== '') {
      const trapId = 'trap_' + Math.random().toString(36).substring(2, 11);
      await executeD1(
        'INSERT INTO kusina_security_honeypot_logs (id, ip, user_agent, trap_field, payload) VALUES (?, ?, ?, ?, ?);',
        [trapId, 'bot_ip', 'bot_agent', 'bot_trap', JSON.stringify(body)]
      );

      return new Response(JSON.stringify({
        success: true,
        id: 'KUS-DEC-' + Math.floor(1000 + Math.random() * 9000),
        message: 'Na-save ang iyong costing record!'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!recipe_id || !recipe_name) {
      return new Response(JSON.stringify({ success: false, error: 'Kailangan ang recipe ID at pangalan.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const id = 'KUS-' + Math.floor(1000 + Math.random() * 9000);

    await executeD1(
      `INSERT INTO kusina_saved_costings (
        id, recipe_id, recipe_name, servings, target_margin,
        cost_per_serving, suggested_srp, profit_per_serving,
        total_batch_profit, price_overrides, overhead_breakdown, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);`,
      [
        id,
        recipe_id,
        recipe_name,
        Number(servings) || 10,
        Number(target_margin) || 40,
        Number(cost_per_serving) || 0,
        Number(suggested_srp) || 0,
        Number(profit_per_serving) || 0,
        Number(total_batch_profit) || 0,
        typeof price_overrides === 'object' ? JSON.stringify(price_overrides) : (price_overrides || '{}'),
        typeof overhead_breakdown === 'object' ? JSON.stringify(overhead_breakdown) : (overhead_breakdown || '{}')
      ]
    );

    return new Response(JSON.stringify({
      success: true,
      id,
      message: `Na-save ang iyong costing sa Cloud (ID: ${id})!`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fallback Node.js handler
export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const url = `http://localhost/api/costings${req.url && req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    const r = await GET(new Request(url));
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  if (req.method === 'POST') {
    const mockRequest = new Request('http://localhost/api/costings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const r = await POST(mockRequest);
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
