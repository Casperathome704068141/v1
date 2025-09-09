import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware CANNOT use the Firebase Admin SDK as it runs on the Edge.
// It can only perform simple checks like the presence of a cookie.
// Deeper verification must happen in a Server Component, page, or API route.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password');
  const isAdminAuthPage = pathname === '/admin/login';
  
  // If trying to access a protected route without a session, redirect to the appropriate login page.
  if (!sessionCookie) {
    if (pathname.startsWith('/admin') && !isAdminAuthPage) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/application')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to public or auth pages if there's no session
    return NextResponse.next();
  }

  // If the user HAS a session cookie and tries to access a login/signup page,
  // redirect them away to their likely dashboard.
  if (isAuthPage) {
    // We can't know their role here, so we redirect to the general student dashboard.
    // The dashboard page itself can then handle redirecting admins to the admin dashboard if needed.
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If all checks pass, continue to the requested page.
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all admin, app, and auth routes.
  matcher: ['/admin/:path*', '/dashboard/:path*', '/application/:path*', '/login', '/signup', '/forgot-password'],
};
