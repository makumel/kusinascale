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

export async function GET() {
  try {
    const data = await executeD1('SELECT id, recipe_name, category, notes, author_name, created_at FROM kusina_suggestions ORDER BY created_at DESC LIMIT 20;');
    const rows = data.result?.[0]?.results || [];
    return new Response(JSON.stringify({ success: true, suggestions: rows }), {
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
    const { recipe_name, category, notes, author_name, contact_info, bot_field } = body;

    // Honeypot Bot Trap
    if (bot_field && String(bot_field).trim() !== '') {
      const trapId = 'trap_' + Math.random().toString(36).substring(2, 11);
      await executeD1(
        'INSERT INTO kusina_security_honeypot_logs (id, ip, user_agent, trap_field, payload) VALUES (?, ?, ?, ?, ?);',
        [trapId, 'bot_ip', 'bot_agent', 'bot_field', JSON.stringify(body)]
      );

      return new Response(JSON.stringify({
        success: true,
        message: 'Salamat sa iyong mungkahi! Susuriin ito ng aming Kusina Chef Team.'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!recipe_name || String(recipe_name).trim().length < 2) {
      return new Response(JSON.stringify({ success: false, error: 'Pakilagay ang pangalan ng recipe.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const id = 'sug_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    await executeD1(
      'INSERT INTO kusina_suggestions (id, recipe_name, category, notes, author_name, contact_info) VALUES (?, ?, ?, ?, ?, ?);',
      [
        id,
        String(recipe_name).trim(),
        category ? String(category).trim() : 'carinderia',
        notes ? String(notes).trim() : null,
        author_name ? String(author_name).trim() : 'Anonymous Kusinero',
        contact_info ? String(contact_info).trim() : null
      ]
    );

    return new Response(JSON.stringify({
      success: true,
      id,
      message: 'Matagumpay na naitala ang iyong mungkahi! Maraming salamat.'
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
    const r = await GET();
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  if (req.method === 'POST') {
    const mockRequest = new Request('http://localhost/api/suggestions', {
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
