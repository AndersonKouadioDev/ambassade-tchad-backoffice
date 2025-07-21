import { baseURL } from '@/config';
import axios from 'axios';
import { getSession } from 'next-auth/react';

export const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour les requêtes (ajout du token d'authentification)
api.interceptors.request.use(
    async (config) => {
        console.log('🚀 Requête API:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`
        });
        
        if (typeof window !== 'undefined') {
            try {
                const session = await getSession();
                console.log('🔐 Session récupérée:', {
                    hasSession: !!session,
                    hasUser: !!session?.user,
                    hasAccessToken: !!session?.user?.accessToken,
                    userType: session?.user?.userType
                });
                
                if (session?.user?.accessToken) {
                    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
                    console.log('✅ Bearer token ajouté à la requête');
                } else {
                    console.warn('⚠️ Aucun token d\'accès trouvé dans la session');
                }
            } catch (error) {
                console.error('❌ Erreur lors de la récupération de la session:', error);
            }
        } else {
            console.log('🖥️ Côté serveur - pas d\'ajout de token');
        }
        
        console.log('📤 Headers de la requête:', config.headers);
        return config;
    },
    (error) => {
        console.error('❌ Erreur dans l\'intercepteur de requête:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses (gestion des erreurs globales)
api.interceptors.response.use(
    (response) => {
        console.log('✅ Réponse API réussie:', {
            status: response.status,
            url: response.config.url,
            method: response.config.method?.toUpperCase()
        });
        return response;
    },
    async (error) => {
        console.error('❌ Erreur de réponse API:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            code: error.code
        });
        
        const originalRequest = error.config;

        // Si l'erreur est 401 et qu'on n'a pas déjà essayé de rafraîchir
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (typeof window !== 'undefined') {
                    const session = await getSession();
                    const refreshToken = session?.user?.refreshToken;
                    const userType = session?.user?.userType;
                    
                    if (refreshToken) {
                        // Choisir l'endpoint de refresh selon le type d'utilisateur
                        const refreshEndpoint = userType === 'DEMANDEUR' 
                            ? '/auth/demandeur/refresh' 
                            : '/auth/refresh';
                        
                        const response = await axios.get(`${baseURL}${refreshEndpoint}`, {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`
                            }
                        });

                        const { accessToken, refreshToken: newRefreshToken } = response.data;
                        
                        // Note: Avec NextAuth, nous ne pouvons pas mettre à jour les tokens directement
                        // Il faudrait implémenter une logique de refresh dans NextAuth ou
                        // rediriger vers la page de connexion
                        
                        // Pour l'instant, on redirige vers la page de connexion
                        const { signOut } = await import('next-auth/react');
                        await signOut({ redirect: false });
                        window.location.href = '/';
                        return Promise.reject(new Error('Session expirée'));
                    }
                }
            } catch (refreshError) {
                // Le refresh a échoué, rediriger vers login
                if (typeof window !== 'undefined') {
                    const { signOut } = await import('next-auth/react');
                    await signOut({ redirect: false });
                    window.location.href = '/';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);