'use client'

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Composant pour gérer les erreurs de session globalement
export function SessionManager() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Vérifier s'il y a une erreur de refresh dans la session
    if (session && (session as any).error === 'RefreshAccessTokenError') {
      console.log('🚪 Erreur de refresh détectée dans la session');
      toast.error('Session expirée. Redirection vers la page de connexion...');
      
      // Déconnexion automatique
      signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
      return;
    }

    // Écouter les erreurs globales pour détecter les sessions expirées
    const handleGlobalError = (event: any) => {
      const error = event.reason || event.error || event.detail;
      
      if (error?.message?.includes('SESSION_EXPIRED') || 
          error?.message?.includes('RefreshAccessTokenError') ||
          error?.includes('SESSION_EXPIRED') ||
          error?.includes('RefreshAccessTokenError') ||
          (typeof error === 'string' && (error.includes('SESSION_EXPIRED') || error.includes('RefreshAccessTokenError')))) {
        
        console.log('🚪 Session expirée détectée globalement');
        toast.error('Session expirée. Redirection vers la page de connexion...');
        
        // Déconnexion automatique
        signOut({ 
          callbackUrl: '/',
          redirect: true 
        });
      }
    };

    // Écouter les erreurs non gérées
    window.addEventListener('unhandledrejection', handleGlobalError);
    window.addEventListener('error', handleGlobalError);

    // Écouter les erreurs personnalisées de session
    window.addEventListener('session-expired', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleGlobalError);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('session-expired', handleGlobalError);
    };
  }, [session, router]);

  return null; // Ce composant n'affiche rien
}

// Fonction utilitaire pour déclencher manuellement une expiration de session
export function triggerSessionExpired() {
  console.log('🚪 Déclenchement manuel de l\'expiration de session');
  window.dispatchEvent(new CustomEvent('session-expired', { 
    detail: 'SESSION_EXPIRED' 
  }));
}