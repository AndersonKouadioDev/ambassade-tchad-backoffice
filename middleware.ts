import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from '@/config';
import { auth } from '@/lib/auth';

export default async function middleware(request: NextRequest) {
  // Étape 1: Gestion de l'authentification
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isOnLoginPage = request.nextUrl.pathname.includes('/auth/login');
  const isOnProtectedRoute = request.nextUrl.pathname.includes('/dashboard') || 
                            request.nextUrl.pathname.includes('/app') ||
                            request.nextUrl.pathname.includes('/protected');

  // Redirection vers login si pas connecté et sur une route protégée
  if (isOnProtectedRoute && !isLoggedIn) {
    const locale = request.nextUrl.pathname.split('/')[1];
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirection vers dashboard si connecté et sur la page de login
  if (isOnLoginPage && isLoggedIn) {
    const locale = request.nextUrl.pathname.split('/')[1];
    const dashboardUrl = new URL(`/${locale}/dashboard/analytics`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Étape 2: Utilisez la requête entrante pour la locale
  const defaultLocale = request.headers.get('dashcode-locale') || 'fr';

  // Étape 3: Appel du middleware de next-intl
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale
  });
  const response = handleI18nRouting(request);

  // Étape 4: Alterez la réponse
  response.headers.set('dashcode-locale', defaultLocale);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/(ar|en|fr)/:path*'
  ]
};