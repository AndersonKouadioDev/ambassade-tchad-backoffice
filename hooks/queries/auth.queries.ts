import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-http';
import { toast } from 'sonner';

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Clés de requête
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  users: () => [...authKeys.all, 'users'] as const,
  user: (id: string) => [...authKeys.users(), id] as const,
};

// Hook pour la connexion
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const response = await api.post('/auth/signin', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Stocker les tokens (optionnel selon votre stratégie d'auth)
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Mettre en cache les données utilisateur
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      toast.success('Connexion réussie!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur de connexion';
      toast.error(message);
    },
  });
};

// Hook pour la déconnexion
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Appel API pour la déconnexion si nécessaire
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      // Nettoyer le cache
      queryClient.clear();
      
      // Supprimer les tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      toast.success('Déconnexion réussie!');
    },
    onError: () => {
      // Même en cas d'erreur, on nettoie localement
      queryClient.clear();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  });
};

// Hook pour récupérer le profil utilisateur
export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async (): Promise<User> => {
      const response = await api.get('/auth/profile');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

// Hook pour mettre à jour le profil
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<User>): Promise<User> => {
      const response = await api.put('/auth/profile', data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Mettre à jour le cache
      queryClient.setQueryData(authKeys.profile(), updatedUser);
      
      toast.success('Profil mis à jour avec succès!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    },
  });
};

// Hook pour changer le mot de passe
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await api.put('/auth/change-password', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Mot de passe modifié avec succès!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
      toast.error(message);
    },
  });
};