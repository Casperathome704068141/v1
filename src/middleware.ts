
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/application')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const isAdmin = decodedToken.admin === true;

    if (pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if ((pathname.startsWith('/dashboard') || pathname.startsWith('/application')) && isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/application')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/application/:path*'],
};
