export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 只处理 /admin/xxx 子路径，不处理 /admin 本身
  if (!path.startsWith('/admin/')) {
    return new Response('Not found', { status: 404 });
  }

  // ... 你的其他逻辑
}
