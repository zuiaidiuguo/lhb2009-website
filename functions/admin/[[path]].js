// functions/admin/[[path]].js
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 处理 /admin/announcement 的 GET 请求
  if (path === '/admin/announcement' && request.method === 'GET') {
    const announcement = await env.ANNOUNCEMENT.get('announcement');
    return new Response(JSON.stringify({ announcement: announcement || '' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 处理 /admin/login 的 POST 请求
  if (path === '/admin/login' && request.method === 'POST') {
    const body = await request.json();
    const password = body.password;
    const adminPassword = env.ADMIN_PASSWORD || 'L20091030';
    return new Response(JSON.stringify({ success: password === adminPassword }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 处理 /admin/announcement 的 POST 请求
  if (path === '/admin/announcement' && request.method === 'POST') {
    const adminPassword = env.ADMIN_PASSWORD || 'L20091030';
    const providedPassword = request.headers.get('X-Admin-Password');
    if (providedPassword !== adminPassword) {
      return new Response(JSON.stringify({ error: '未授权' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const body = await request.json();
    await env.ANNOUNCEMENT.put('announcement', body.announcement);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response('Not found', { status: 404, headers: corsHeaders });
}