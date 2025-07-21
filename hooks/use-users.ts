import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersService, type User, type CreateUserData, type UpdateUserData, type UsersListParams } from '@/lib/api';
import { toast } from 'sonner';

// Clés de requête pour les utilisateurs
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params: UsersListParams) => [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

// Hook pour obtenir la liste des utilisateurs
export function useUsers(params?: UsersListParams) {
  return useQuery({
    queryKey: usersKeys.list(params || {}),
    queryFn: () => UsersService.getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook pour obtenir un utilisateur par ID
export function useUser(id: string, enabled = true) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => UsersService.getUserById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook pour créer un utilisateur
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserData) => UsersService.createUser(userData),
    onSuccess: (newUser) => {
      // Invalider les listes d'utilisateurs
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      
      // Ajouter le nouvel utilisateur au cache
      queryClient.setQueryData(usersKeys.detail(newUser.id), newUser);
      
      toast.success('Utilisateur créé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
    },
  });
}

// Hook pour mettre à jour un utilisateur
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserData }) =>
      UsersService.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      // Invalider les listes d'utilisateurs
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      
      // Mettre à jour l'utilisateur dans le cache
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      
      toast.success('Utilisateur mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    },
  });
}

// Hook pour supprimer un utilisateur
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UsersService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Invalider les listes d'utilisateurs
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      
      // Supprimer l'utilisateur du cache
      queryClient.removeQueries({ queryKey: usersKeys.detail(deletedId) });
      
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
    },
  });
}

// Hook pour activer/désactiver un utilisateur
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UsersService.toggleUserStatus(id),
    onSuccess: (updatedUser) => {
      // Invalider les listes d'utilisateurs
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      
      // Mettre à jour l'utilisateur dans le cache
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      
      const status = updatedUser.status === 'ACTIVE' ? 'activé' : 'désactivé';
      toast.success(`Utilisateur ${status} avec succès`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de statut');
    },
  });
}

// Hook pour réinitialiser le mot de passe d'un utilisateur
export function useResetUserPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UsersService.resetUserPassword(id),
    onSuccess: (result, userId) => {
      // Invalider l'utilisateur dans le cache
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(userId) });
      
      toast.success(`Mot de passe réinitialisé. Nouveau mot de passe: ${result.temporaryPassword}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
    },
  });
}