import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api as apiClient } from '@/lib/api-http';

// Types pour les notifications selon l'API backend
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  userId: string;
}

export interface UpdateNotificationData {
  title?: string;
  message?: string;
  type?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  isRead?: boolean;
}

export interface NotificationFilters {
  type?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  isRead?: boolean;
  userId?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: {
    INFO: number;
    WARNING: number;
    ERROR: number;
    SUCCESS: number;
  };
}

export interface PaginatedNotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Services API selon les endpoints du guide
class NotificationsService {
  // Obtenir toutes les notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get('/notifications');
    return response.data;
  }

  // Obtenir les notifications d'un utilisateur
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const response = await apiClient.get(`/notifications/user/${userId}`);
    return response.data;
  }

  // Statistiques des notifications
  async getNotificationStats(): Promise<NotificationStats> {
    const response = await apiClient.get('/notifications/stats');
    return response.data;
  }

  // Obtenir une notification par ID
  async getNotificationById(id: string): Promise<Notification> {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  }

  // Créer une notification
  async createNotification(notificationData: CreateNotificationData): Promise<Notification> {
    const response = await apiClient.post('/notifications', notificationData);
    return response.data;
  }

  // Mettre à jour une notification
  async updateNotification(id: string, notificationData: UpdateNotificationData): Promise<Notification> {
    const response = await apiClient.put(`/notifications/${id}`, notificationData);
    return response.data;
  }

  // Marquer une notification comme lue
  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  }

  // Marquer une notification comme non lue
  async markAsUnread(id: string): Promise<Notification> {
    const response = await apiClient.patch(`/notifications/${id}/unread`);
    return response.data;
  }

  // Supprimer une notification
  async deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  }
}

export const notificationsService = new NotificationsService();

// Hooks TanStack Query
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.getNotifications(),
    staleTime: 1 * 60 * 1000, // 1 minute pour les notifications
  });
};

export const useUserNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', 'user', userId],
    queryFn: () => notificationsService.getUserNotifications(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useNotificationStats = () => {
  return useQuery({
    queryKey: ['notifications', 'stats'],
    queryFn: () => notificationsService.getNotificationStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationsService.getNotificationById(id),
    enabled: !!id,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsService.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notificationData }: { id: string; notificationData: UpdateNotificationData }) => 
      notificationsService.updateNotification(id, notificationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAsUnread = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsService.markAsUnread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};