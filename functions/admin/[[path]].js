export async function onRequest(context) {
  return new Response('Hello from admin', {
    headers: { 'Content-Type': 'text/plain' }
  });
}
