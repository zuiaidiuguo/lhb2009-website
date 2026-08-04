export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminPassword = '20091030';
    const providedAdmin = request.headers.get('X-Admin-Password');

    // 管理员登录
    if (providedAdmin) {
      if (providedAdmin === adminPassword) {
        return new Response(JSON.stringify({
          code: 0,
          data: { username: 'admin', role: 'admin' }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ code: 401, msg: '管理员密码错误' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // 普通用户登录
    const body = await request.json();
    const username = body.username?.trim();
    const password = body.password?.trim();

    if (!username || !password) {
      return new Response(JSON.stringify({ code: 400, msg: '用户名和密码不能为空' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const usersData = await env.ANNOUNCEMENT.get('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const found = users.find(u => u.username === username && u.password === password);

    if (!found) {
      return new Response(JSON.stringify({ code: 401, msg: '用户名或密码错误' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      code: 0,
      data: { username: found.username, id: found.id, role: 'user' }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ code: 500, msg: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
