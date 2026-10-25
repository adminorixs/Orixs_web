import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { jwtVerify } from 'jose';
import { routing, isAppLocale } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

/**
 * 1. next-intl resolves and prefixes the locale (/en, /es, /ar) and redirects unprefixed entry URLs.
 * 2. CMS routes (/<locale>/cmsuser/...) keep their cookie/JWT gate; redirects stay inside the visitor's locale.
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  const locale = isAppLocale(maybeLocale) ? maybeLocale : null;
  const pathWithoutLocale = locale ? '/' + segments.slice(2).join('/') : pathname;

  if (locale && pathWithoutLocale.startsWith('/cmsuser')) {
    const loginPath = `/${locale}/cmsuser/login`;

    // Allow access to login page
    if (pathWithoutLocale === '/cmsuser/login') {
      return intlMiddleware(request);
    }

    const token = request.cookies.get('auth_token');

    if (!token) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    try {
      // Verify JWT token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your_jwt_secret_key_here'
      );
      await jwtVerify(token.value, secret);
      return intlMiddleware(request);
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension (images, fonts, favicon...).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
