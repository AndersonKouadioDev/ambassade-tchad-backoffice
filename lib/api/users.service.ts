import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api as apiClient } from '@/lib/api-http';

// Types pour les utilisateurs selon l'API backend
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'ADMIN' | 'CONSUL' | 'CHEF_SERVICE' | 'AGENT';
  userType: 'PERSONNEL' | 'DEMANDEUR';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'AGENT' | 'CHEF_SERVICE' | 'CONSUL' | 'ADMIN';
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Services API selon les endpoints du guide
export class UsersService {
  // Obtenir tous les utilisateurs avec pagination et filtres
  async getUsers(filters: UserFilters = {}): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  }

  // Obtenir un utilisateur par ID
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  // Créer un utilisateur (Admin uniquement)
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post('/users', userData);
    return response.data;
  }

  // Mettre à jour son profil
  async updateProfile(userData: UpdateUserData): Promise<User> {
    const response = await apiClient.patch('/users/me', userData);
    return response.data;
  }

  // Mettre à jour profil client (demandeur)
  async updateUserProfile(id: string, userData: UpdateUserData): Promise<User> {
    const response = await apiClient.patch(`/users/update/${id}`, userData);
    return response.data;
  }

  // Désactiver un utilisateur (Admin uniquement)
  async deactivateUser(id: string): Promise<void> {
    await apiClient.patch(`/users/deactivate/${id}`);
  }

  // Activer un utilisateur (Admin uniquement)
  async activateUser(id: string): Promise<void> {
    await apiClient.patch(`/users/activate/${id}`);
  }

  // Supprimer un utilisateur (Admin uniquement)
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }
}

export const usersService = new UsersService();

// Hooks TanStack Query
export const useUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserData }) => 
      usersService.updateUserProfile(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};