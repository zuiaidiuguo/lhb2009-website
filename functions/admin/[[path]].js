export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 匹配 /admin 和 /admin/*
  if (path === '/admin' || path.startsWith('/admin/')) {
    // ... 你的处理逻辑
  }
}
