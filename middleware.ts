import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  // Only protect /cmsuser routes
  if (request.nextUrl.pathname.startsWith('/cmsuser')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/cmsuser/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('auth_token');

    if (!token) {
      return NextResponse.redirect(new URL('/cmsuser/login', request.url));
    }

    try {
      // Verify JWT token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your_jwt_secret_key_here'
      );
      await jwtVerify(token.value, secret);
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL('/cmsuser/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/cmsuser/:path*',
}; 