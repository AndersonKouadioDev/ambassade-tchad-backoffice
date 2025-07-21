import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from '@/config';
import { auth } from '@/lib/auth';

// Helper pour vérifier si l'utilisateur est authentifié côté client
function isClientAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get('next-auth.session-token');
  const authHeader = request.headers.get('authorization');
  return !!(authCookie || authHeader);
}

export default async function middleware(request: NextRequest) {
  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/images',
    '/videos'
  ];

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.includes(route)
  );

  // Routes protégées nécessitant une authentification
  const protectedRoutePatterns = [
    '/dashboard',
    '/app',
    '/users',
    '/demande',
    '/contenu',
    '/finance',
    '/protected'
  ];

  const isProtectedRoute = protectedRoutePatterns.some(pattern => 
    request.nextUrl.pathname.includes(pattern)
  );

  // Vérifier si c'est la page racine (page de connexion)
  const isRootLoginPage = request.nextUrl.pathname === '/' || 
    locales.some(locale => request.nextUrl.pathname === `/${locale}`);

  // Si c'est la page racine, vérifier l'authentification pour rediriger si nécessaire
  if (isRootLoginPage) {
    try {
      const session = await auth();
      const isServerAuthenticated = !!session?.user;
      const isClientAuth = isClientAuthenticated(request);

      // Si l'utilisateur est authentifié, le rediriger vers le dashboard
      if (isServerAuthenticated || isClientAuth) {
        const locale = request.nextUrl.pathname.split('/')[1] || 'fr';
        const dashboardUrl = new URL(`/${locale}/dashboard/analytics`, request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    } catch (error) {
      console.error('Auth check error on root page:', error);
    }
    
    // Si pas authentifié, continuer vers la page de connexion
    const defaultLocale = request.headers.get('dashcode-locale') || 'fr';
    const handleI18nRouting = createMiddleware({
      locales,
      defaultLocale
    });
    const response = handleI18nRouting(request);
    response.headers.set('dashcode-locale', defaultLocale);
    return response;
  }

  // Si c'est une route publique, continuer sans vérification d'auth
  if (isPublicRoute) {
    const defaultLocale = request.headers.get('dashcode-locale') || 'fr';
    const handleI18nRouting = createMiddleware({
      locales,
      defaultLocale
    });
    const response = handleI18nRouting(request);
    response.headers.set('dashcode-locale', defaultLocale);
    return response;
  }

  // Pour les routes protégées, vérifier l'authentification
  if (isProtectedRoute) {
    try {
      // Vérifier la session NextAuth côté serveur
      const session = await auth();
      const isServerAuthenticated = !!session?.user;
      
      // Vérifier l'authentification côté client (cookies NextAuth)
      const isClientAuth = isClientAuthenticated(request);

      // Si pas d'authentification valide, rediriger vers la page racine (page de connexion)
      // Note: On privilégie la session NextAuth car elle est synchronisée avec TanStack Query
      if (!isServerAuthenticated && !isClientAuth) {
        const locale = request.nextUrl.pathname.split('/')[1] || 'fr';
        const loginUrl = new URL(`/${locale}`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // En cas d'erreur d'authentification, rediriger vers la page racine (page de connexion)
      console.error('Auth middleware error:', error);
      const locale = request.nextUrl.pathname.split('/')[1] || 'fr';
      const loginUrl = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Gestion de l'internationalisation
  const defaultLocale = request.headers.get('dashcode-locale') || 'fr';
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale
  });
  const response = handleI18nRouting(request);
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