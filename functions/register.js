export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    if (users.find(u => u.username === username)) {
      return new Response(JSON.stringify({ code: 400, msg: '用户名已存在' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const newUser = {
      id: Date.now(),
      username,
      password,
      created: new Date().toLocaleString('zh-CN'),
    };
    users.push(newUser);
    await env.ANNOUNCEMENT.put('users', JSON.stringify(users));

    return new Response(JSON.stringify({ code: 0, data: newUser }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ code: 500, msg: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
