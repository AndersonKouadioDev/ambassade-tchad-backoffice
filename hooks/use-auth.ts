'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService, type LoginCredentials, type CompleteLoginData, type RegisterClientData, type ResetPasswordData } from '@/lib/api/auth.service';
import { usersService, type CreateUserData } from '@/lib/api/users.service';
import { toast } from 'sonner';
import { useRouter } from '@/components/navigation';
import { signIn } from 'next-auth/react';

// Hook pour la connexion directe (sans OTP)
export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthService.signIn(credentials),
    onSuccess: async (data) => {
      // Authentifier avec NextAuth.js uniquement (cookies sécurisés)
      try {
        const result = await signIn('credentials', {
          email: data.user.email,
          password: 'authenticated',
          userProfile: JSON.stringify(data.user),
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        // Invalider les queries pour rafraîchir les données
        queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
        
        toast.success('Connexion réussie', {
          description: `Bienvenue ${data.user.firstName || data.user.email}`,
        });

        // Rediriger vers le dashboard
        router.push('/dashboard/analytics');
      } catch (error) {
        console.error('Erreur d\'authentification NextAuth:', error);
        toast.error('Erreur de connexion', {
          description: 'Impossible de créer la session sécurisée.',
        });
      }
    },
    onError: (error: any) => {
      toast.error('Erreur de connexion', {
        description: error.response?.data?.message || 'Veuillez vérifier vos identifiants.',
      });
    },
  });
}

// Hook pour compléter la connexion avec OTP
export function useCompleteLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (loginData: CompleteLoginData) => AuthService.completeLogin(loginData),
    onSuccess: async (data) => {
      // Authentifier avec NextAuth.js uniquement (cookies sécurisés)
      try {
        const result = await signIn('credentials', {
          email: data.user.email,
          password: 'authenticated',
          userProfile: JSON.stringify(data.user),
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        // Invalider les queries pour rafraîchir les données
        queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
        
        toast.success('Connexion réussie', {
          description: `Bienvenue ${data.user.firstName || data.user.email}`,
        });

        // Rediriger vers le dashboard
        router.push('/dashboard/analytics');
      } catch (error) {
        console.error('Erreur d\'authentification NextAuth:', error);
        toast.error('Erreur de connexion', {
          description: 'Impossible de créer la session sécurisée.',
        });
      }
    },
    onError: (error: any) => {
      toast.error('Code OTP invalide', {
        description: error.response?.data?.message || 'Veuillez vérifier le code saisi.',
      });
    },
  });
}

// Hook pour l'inscription des clients
export function useRegisterClient() {
  return useMutation({
    mutationFn: (clientData: RegisterClientData) => AuthService.registerClient(clientData),
    onSuccess: (data) => {
      toast.success('Inscription réussie', {
        description: 'Votre compte a été créé avec succès.',
      });
    },
    onError: (error: any) => {
      toast.error('Erreur d\'inscription', {
        description: error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.',
      });
    },
  });
}

// Hook pour créer un utilisateur du personnel
export function useCreateUser() {
  return useMutation({
    mutationFn: (userData: CreateUserData) => usersService.createUser(userData),
    onSuccess: (data) => {
      toast.success('Utilisateur créé', {
        description: 'Le nouvel utilisateur du personnel a été créé avec succès.',
      });
    },
    onError: (error: any) => {
      toast.error('Erreur de création', {
        description: error.response?.data?.message || 'Une erreur est survenue lors de la création de l\'utilisateur.',
      });
    },
  });
}

// Hook pour demander un reset de mot de passe
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => AuthService.requestPasswordReset(email),
    onSuccess: (data) => {
      toast.success('Code de récupération envoyé', {
        description: 'Vérifiez votre téléphone pour le code de récupération.',
      });
    },
    onError: (error: any) => {
      toast.error('Erreur', {
        description: error.response?.data?.message || 'Impossible d\'envoyer le code de récupération.',
      });
    },
  });
}

// Hook pour reset le mot de passe
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (resetData: ResetPasswordData) => AuthService.resetPassword(resetData),
    onSuccess: (data) => {
      toast.success('Mot de passe modifié', {
        description: 'Votre mot de passe a été modifié avec succès.',
      });
      router.push('/');
    },
    onError: (error: any) => {
      toast.error('Erreur', {
        description: error.response?.data?.message || 'Impossible de modifier le mot de passe.',
      });
    },
  });
}

// Hook pour obtenir le profil utilisateur
export function useUserProfile() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => AuthService.getProfile(),
    enabled: false, // Désactivé car les infos utilisateur sont maintenant dans la session NextAuth
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour la déconnexion
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Déconnexion NextAuth.js (supprime les cookies sécurisés)
      const { signOut } = await import('next-auth/react');
      await signOut({ redirect: false });
    },
    onSuccess: async () => {
      // Vider le cache des queries
      queryClient.clear();
      
      toast.success('Déconnexion réussie', {
        description: 'À bientôt !',
      });

      // Rediriger vers la page de connexion
      router.push('/');
    },
    onError: async (error: any) => {
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      try {
        const { signOut } = await import('next-auth/react');
        await signOut({ redirect: false });
      } catch (error) {
        console.warn('Erreur de déconnexion NextAuth:', error);
      }

      queryClient.clear();
      router.push('/');
    },
  });
}

// Hook pour vérifier si l'utilisateur est connecté
export function useIsAuthenticated() {
  return useQuery({
    queryKey: ['auth', 'isAuthenticated'],
    queryFn: async () => {
      // Vérifier la session NextAuth
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      return !!session?.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}