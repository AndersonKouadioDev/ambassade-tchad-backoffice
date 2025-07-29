import createIntlMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { routing } from "@/i18n/routing";

// Pages publiques (accessibles sans authentification)
const publicPages = ["/", "/auth/login", "/auth/register"];

// Routes d'authentification (login, register, etc.)
const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

// Préfixe pour les routes API d'authentification
const apiAuthPrefix = "/api/auth";

// Page de redirection par défaut après connexion
const DEFAULT_LOGIN_REDIRECT = "/dashboard";

// Middleware d'internationalisation
const intlMiddleware = createIntlMiddleware(routing);

// Middleware d'authentification Auth.js v5
export const authMiddleware = auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    
    const isPublicRoute = publicPages.some(route => {
        if (route === "/") {
            return nextUrl.pathname === "/" || routing.locales.some(locale =>
                nextUrl.pathname === `/${locale}` || nextUrl.pathname === `/${locale}/`
            );
        }
        return nextUrl.pathname.includes(route);
    });
    const isAuthRoute = authRoutes.some(route => nextUrl.pathname.includes(route));

    // Ne pas modifier les routes API d'authentification
    if (isApiAuthRoute) {
        return;
    }

    // Rediriger les utilisateurs connectés depuis les pages d'authentification
    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return intlMiddleware(req);
    }

    // Rediriger les utilisateurs non connectés vers la page de connexion
    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
    }

    // Appliquer l'internationalisation pour tous les autres cas
    return intlMiddleware(req);
});
