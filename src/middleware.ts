import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminRoute) {
    const authCookie = request.cookies.get('ytdl_admin_session');
    // Using simple mock password logic since we are in frontend mock mode
    if (!authCookie || authCookie.value !== 'authenticated') {
       return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
