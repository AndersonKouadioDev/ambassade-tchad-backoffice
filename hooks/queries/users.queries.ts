import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-http';
import { toast } from 'sonner';

// Types pour les utilisateurs
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role: string;
  phone?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  role?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Clés de requête
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: UsersFilters) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

// Hook pour récupérer la liste des utilisateurs
export const useUsers = (filters: UsersFilters = {}) => {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: async (): Promise<UsersResponse> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/users?${params.toString()}`);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook pour récupérer un utilisateur par ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: async (): Promise<User> => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour créer un utilisateur
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserData): Promise<User> => {
      const response = await api.post('/users', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalider les listes d'utilisateurs
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      
      toast.success('Utilisateur créé avec succès!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

// Hook pour mettre à jour un utilisateur
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }): Promise<User> => {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Mettre à jour le cache pour cet utilisateur spécifique
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      
      // Invalider les listes d'utilisateurs
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      
      toast.success('Utilisateur mis à jour avec succès!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    },
  });
};

// Hook pour supprimer un utilisateur
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: (_, deletedId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: usersKeys.detail(deletedId) });
      
      // Invalider les listes d'utilisateurs
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      
      toast.success('Utilisateur supprimé avec succès!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};

// Hook pour changer le statut d'un utilisateur
export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: User['status'] }): Promise<User> => {
      const response = await api.patch(`/users/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Mettre à jour le cache
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      
      // Invalider les listes d'utilisateurs
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      
      toast.success('Statut utilisateur modifié avec succès!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors du changement de statut';
      toast.error(message);
    },
  });
};

// Hook pour réinitialiser le mot de passe d'un utilisateur
export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: async (id: string): Promise<{ temporaryPassword: string }> => {
      const response = await api.post(`/users/${id}/reset-password`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Mot de passe réinitialisé avec succès!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la réinitialisation';
      toast.error(message);
    },
  });
};