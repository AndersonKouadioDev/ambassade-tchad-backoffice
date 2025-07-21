import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationsService, type Notification, type CreateNotificationData, type UpdateNotificationData, type NotificationsListParams } from '@/lib/api';
import { toast } from 'sonner';

// Clés de requête pour les notifications
export const notificationsKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationsKeys.all, 'list'] as const,
  list: (params: NotificationsListParams) => [...notificationsKeys.lists(), params] as const,
  details: () => [...notificationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationsKeys.details(), id] as const,
  user: () => [...notificationsKeys.all, 'user'] as const,
  userList: (params: NotificationsListParams) => [...notificationsKeys.user(), params] as const,
  unreadCount: () => [...notificationsKeys.all, 'unread-count'] as const,
};

// Hook pour obtenir la liste des notifications (admin)
export function useNotifications(params?: NotificationsListParams) {
  return useQuery({
    queryKey: notificationsKeys.list(params || {}),
    queryFn: () => NotificationsService.getNotifications(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook pour obtenir les notifications de l'utilisateur connecté
export function useUserNotifications(params?: NotificationsListParams) {
  return useQuery({
    queryKey: notificationsKeys.userList(params || {}),
    queryFn: () => NotificationsService.getUserNotifications(params),
    staleTime: 1000 * 30, // 30 secondes
    refetchInterval: 1000 * 60, // Refetch toutes les minutes
  });
}

// Hook pour obtenir une notification par ID
export function useNotification(id: string, enabled = true) {
  return useQuery({
    queryKey: notificationsKeys.detail(id),
    queryFn: () => NotificationsService.getNotificationById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook pour obtenir le nombre de notifications non lues
export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: notificationsKeys.unreadCount(),
    queryFn: () => NotificationsService.getUnreadCount(),
    staleTime: 1000 * 30, // 30 secondes
    refetchInterval: 1000 * 60, // Refetch toutes les minutes
  });
}

// Hook pour créer une notification
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationData: CreateNotificationData) => 
      NotificationsService.createNotification(notificationData),
    onSuccess: (newNotification) => {
      // Invalider les listes de notifications
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.user() });
      
      // Ajouter la nouvelle notification au cache
      queryClient.setQueryData(notificationsKeys.detail(newNotification.id), newNotification);
      
      toast.success('Notification créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de la notification');
    },
  });
}

// Hook pour mettre à jour une notification
export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notificationData }: { id: string; notificationData: UpdateNotificationData }) =>
      NotificationsService.updateNotification(id, notificationData),
    onSuccess: (updatedNotification) => {
      // Invalider les listes de notifications
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.user() });
      
      // Mettre à jour la notification dans le cache
      queryClient.setQueryData(notificationsKeys.detail(updatedNotification.id), updatedNotification);
      
      toast.success('Notification mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de la notification');
    },
  });
}

// Hook pour supprimer une notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NotificationsService.deleteNotification(id),
    onSuccess: (_, deletedId) => {
      // Invalider les listes de notifications
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.user() });
      
      // Supprimer la notification du cache
      queryClient.removeQueries({ queryKey: notificationsKeys.detail(deletedId) });
      
      // Invalider le compteur de notifications non lues
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() });
      
      toast.success('Notification supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de la notification');
    },
  });
}

// Hook pour marquer une notification comme lue
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NotificationsService.markAsRead(id),
    onSuccess: (updatedNotification) => {
      // Invalider les listes de notifications
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.user() });
      
      // Mettre à jour la notification dans le cache
      queryClient.setQueryData(notificationsKeys.detail(updatedNotification.id), updatedNotification);
      
      // Invalider le compteur de notifications non lues
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du marquage de la notification');
    },
  });
}

// Hook pour marquer toutes les notifications comme lues
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationsService.markAllAsRead(),
    onSuccess: (result) => {
      // Invalider toutes les listes de notifications
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.user() });
      
      // Invalider le compteur de notifications non lues
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() });
      
      toast.success(`${result.count} notification(s) marquée(s) comme lue(s)`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du marquage des notifications');
    },
  });
}