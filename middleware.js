import { NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

export async function middleware(request) {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users from protected routes
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}