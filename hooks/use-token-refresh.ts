'use client'

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Fonction pour décoder un JWT côté client
function decodeJWT(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
}

// Fonction pour vérifier si un token expire bientôt
function isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const timeUntilExpiration = expirationTime - currentTime;
  const thresholdMs = thresholdMinutes * 60 * 1000;
  
  return timeUntilExpiration <= thresholdMs;
}

// Hook pour gérer le refresh automatique du token
export function useTokenRefresh() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const refreshToken = useCallback(async () => {
    if (!session?.user?.refreshToken) {
      console.log('❌ Aucun refresh token disponible');
      return false;
    }

    try {
      console.log('🔄 Refresh du token côté client...');
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          refreshToken: session.user.refreshToken 
        }),
      });

      if (!response.ok) {
        console.error('❌ Erreur lors du refresh côté client:', response.status);
        return false;
      }

      const data = await response.json();
      
      // Mettre à jour la session avec les nouveaux tokens
      await update({
        ...session,
        user: {
          ...session.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }
      });

      console.log('✅ Token refreshé avec succès côté client');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors du refresh côté client:', error);
      return false;
    }
  }, [session, update]);

  const checkAndRefreshToken = useCallback(async () => {
    if (!session?.user?.accessToken) {
      return;
    }

    if (isTokenExpiringSoon(session.user.accessToken)) {
      console.log('⚠️ Token expirant côté client, tentative de refresh...');
      
      const success = await refreshToken();
      if (!success) {
        toast.error('Session expirée. Redirection vers la page de connexion...');
        // Déconnexion automatique et redirection
        await signOut({ 
          callbackUrl: '/',
          redirect: true 
        });
      }
    }
  }, [session?.user?.accessToken, refreshToken]);

  // Vérifier le token toutes les minutes
  useEffect(() => {
    if (!session?.user?.accessToken) return;

    // Vérification immédiate
    checkAndRefreshToken();

    // Vérification périodique toutes les minutes
    const interval = setInterval(checkAndRefreshToken, 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAndRefreshToken, session?.user?.accessToken]);

  return {
    refreshToken,
    checkAndRefreshToken,
    isTokenValid: session?.user?.accessToken ? !isTokenExpiringSoon(session.user.accessToken) : false
  };
}