// lib/auth-utils.js
export async function clearSessionCookie() {
  const response = new NextResponse();
  response.cookies.delete('__session');
  return response;
}