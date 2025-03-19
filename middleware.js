import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/dashboard/:path*']
};

export async function middleware(req) {
  const sessionCookie = req.cookies.get('__session')?.value;
  const url = req.nextUrl.clone();

  if (!sessionCookie) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const verifyResponse = await fetch(new URL('/api/session', req.url), {
      headers: { cookie: `__session=${sessionCookie}` }
    });
    
    if (verifyResponse.ok) {
      return NextResponse.next();
    }
  } catch (error) {
    console.error('Middleware verification failed:', error);
  }

  url.pathname = '/login';
  const response = NextResponse.redirect(url);
  response.cookies.delete('__session');
  return response;
}