import { api as apiClient } from '@/lib/api-http';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types pour les rendez-vous
export interface Appointment {
  id: string;
  userId: string;
  visaRequestId?: string;
  type: 'VISA_SUBMISSION' | 'VISA_INTERVIEW' | 'DOCUMENT_PICKUP' | 'CONSULTATION' | 'OTHER';
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  date: string;
  time: string;
  duration: number; // en minutes
  location: string;
  purpose: string;
  notes?: string;
  reminderSent: boolean;
  attendeeInfo: AttendeeInfo;
  assignedTo?: string; // ID du personnel assigné
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendeeInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationality?: string;
  passportNumber?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

export interface CreateAppointmentData {
  userId: string;
  visaRequestId?: string;
  type: Appointment['type'];
  date: string;
  time: string;
  duration?: number;
  location: string;
  purpose: string;
  notes?: string;
  attendeeInfo: AttendeeInfo;
  assignedTo?: string;
}

export interface UpdateAppointmentData {
  type?: Appointment['type'];
  status?: Appointment['status'];
  date?: string;
  time?: string;
  duration?: number;
  location?: string;
  purpose?: string;
  notes?: string;
  attendeeInfo?: Partial<AttendeeInfo>;
  assignedTo?: string;
}

export interface AppointmentFilters {
  userId?: string;
  visaRequestId?: string;
  type?: Appointment['type'];
  status?: Appointment['status'];
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'time' | 'status' | 'type' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  byType: Record<Appointment['type'], number>;
  byLocation: Record<string, number>;
  todayAppointments: number;
  upcomingAppointments: number;
  averageDuration: number;
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  duration: number;
  location: string;
}

export interface AvailableSlots {
  date: string;
  slots: TimeSlot[];
}

export interface PaginatedAppointmentsResponse {
  data: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Service pour les rendez-vous
export class AppointmentsService {
  // Obtenir tous les rendez-vous avec filtres
  static async getAll(filters?: AppointmentFilters): Promise<PaginatedAppointmentsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/appointments?${params.toString()}`);
    return data;
  }

  // Obtenir les rendez-vous d'un utilisateur
  static async getByUser(userId: string, filters?: Omit<AppointmentFilters, 'userId'>): Promise<PaginatedAppointmentsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/appointments/user/${userId}?${params.toString()}`);
    return data;
  }

  // Obtenir les rendez-vous assignés à un personnel
  static async getByAssignee(assigneeId: string, filters?: Omit<AppointmentFilters, 'assignedTo'>): Promise<PaginatedAppointmentsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/appointments/assignee/${assigneeId}?${params.toString()}`);
    return data;
  }

  // Obtenir les statistiques des rendez-vous
  static async getStats(): Promise<AppointmentStats> {
    const { data } = await apiClient.get('/appointments/stats');
    return data;
  }

  // Obtenir un rendez-vous par ID
  static async getById(id: string): Promise<Appointment> {
    const { data } = await apiClient.get(`/appointments/${id}`);
    return data;
  }

  // Obtenir les créneaux disponibles
  static async getAvailableSlots(
    dateFrom: string,
    dateTo: string,
    duration: number = 30,
    location?: string
  ): Promise<AvailableSlots[]> {
    const params = new URLSearchParams({
      dateFrom,
      dateTo,
      duration: duration.toString(),
    });
    if (location) {
      params.append('location', location);
    }
    const { data } = await apiClient.get(`/appointments/available-slots?${params.toString()}`);
    return data;
  }

  // Créer un nouveau rendez-vous
  static async create(appointmentData: CreateAppointmentData): Promise<Appointment> {
    const { data } = await apiClient.post('/appointments', appointmentData);
    return data;
  }

  // Mettre à jour un rendez-vous
  static async update(id: string, appointmentData: UpdateAppointmentData): Promise<Appointment> {
    const { data } = await apiClient.put(`/appointments/${id}`, appointmentData);
    return data;
  }

  // Supprimer un rendez-vous
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  }

  // Confirmer un rendez-vous
  static async confirm(id: string): Promise<Appointment> {
    const { data } = await apiClient.patch(`/appointments/${id}/confirm`);
    return data;
  }

  // Annuler un rendez-vous
  static async cancel(id: string, reason?: string): Promise<Appointment> {
    const { data } = await apiClient.patch(`/appointments/${id}/cancel`, { reason });
    return data;
  }

  // Marquer un rendez-vous comme complété
  static async complete(id: string, notes?: string): Promise<Appointment> {
    const { data } = await apiClient.patch(`/appointments/${id}/complete`, { notes });
    return data;
  }

  // Marquer un rendez-vous comme "no show"
  static async markNoShow(id: string): Promise<Appointment> {
    const { data } = await apiClient.patch(`/appointments/${id}/no-show`);
    return data;
  }

  // Reprogrammer un rendez-vous
  static async reschedule(id: string, newDate: string, newTime: string): Promise<Appointment> {
    const { data } = await apiClient.patch(`/appointments/${id}/reschedule`, {
      date: newDate,
      time: newTime,
    });
    return data;
  }

  // Envoyer un rappel
  static async sendReminder(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.post(`/appointments/${id}/send-reminder`);
    return data;
  }

  // Obtenir les rendez-vous du jour
  static async getTodayAppointments(): Promise<Appointment[]> {
    const { data } = await apiClient.get('/appointments/today');
    return data;
  }

  // Obtenir les prochains rendez-vous
  static async getUpcomingAppointments(days: number = 7): Promise<Appointment[]> {
    const { data } = await apiClient.get(`/appointments/upcoming?days=${days}`);
    return data;
  }
}

// Hooks TanStack Query pour les rendez-vous

// Hook pour obtenir tous les rendez-vous
export const useAppointments = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => AppointmentsService.getAll(filters),
  });
};

// Hook pour obtenir les rendez-vous d'un utilisateur
export const useUserAppointments = (userId: string, filters?: Omit<AppointmentFilters, 'userId'>) => {
  return useQuery({
    queryKey: ['appointments', 'user', userId, filters],
    queryFn: () => AppointmentsService.getByUser(userId, filters),
    enabled: !!userId,
  });
};

// Hook pour obtenir les rendez-vous assignés à un personnel
export const useAssigneeAppointments = (assigneeId: string, filters?: Omit<AppointmentFilters, 'assignedTo'>) => {
  return useQuery({
    queryKey: ['appointments', 'assignee', assigneeId, filters],
    queryFn: () => AppointmentsService.getByAssignee(assigneeId, filters),
    enabled: !!assigneeId,
  });
};

// Hook pour obtenir les statistiques des rendez-vous
export const useAppointmentStats = () => {
  return useQuery({
    queryKey: ['appointments', 'stats'],
    queryFn: () => AppointmentsService.getStats(),
  });
};

// Hook pour obtenir un rendez-vous par ID
export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => AppointmentsService.getById(id),
    enabled: !!id,
  });
};

// Hook pour obtenir les créneaux disponibles
export const useAvailableSlots = (
  dateFrom: string,
  dateTo: string,
  duration: number = 30,
  location?: string
) => {
  return useQuery({
    queryKey: ['appointments', 'available-slots', dateFrom, dateTo, duration, location],
    queryFn: () => AppointmentsService.getAvailableSlots(dateFrom, dateTo, duration, location),
    enabled: !!dateFrom && !!dateTo,
  });
};

// Hook pour obtenir les rendez-vous du jour
export const useTodayAppointments = () => {
  return useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: () => AppointmentsService.getTodayAppointments(),
    refetchInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
  });
};

// Hook pour obtenir les prochains rendez-vous
export const useUpcomingAppointments = (days: number = 7) => {
  return useQuery({
    queryKey: ['appointments', 'upcoming', days],
    queryFn: () => AppointmentsService.getUpcomingAppointments(days),
    refetchInterval: 10 * 60 * 1000, // Rafraîchir toutes les 10 minutes
  });
};

// Hook pour créer un rendez-vous
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentData: CreateAppointmentData) => AppointmentsService.create(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Hook pour mettre à jour un rendez-vous
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentData }) => 
      AppointmentsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
    },
  });
};

// Hook pour supprimer un rendez-vous
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AppointmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Hook pour confirmer un rendez-vous
export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AppointmentsService.confirm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
    },
  });
};

// Hook pour annuler un rendez-vous
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      AppointmentsService.cancel(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
    },
  });
};

// Hook pour marquer un rendez-vous comme complété
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      AppointmentsService.complete(id, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
    },
  });
};

// Hook pour marquer un rendez-vous comme "no show"
export const useMarkNoShowAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AppointmentsService.markNoShow(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
    },
  });
};

// Hook pour reprogrammer un rendez-vous
export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newDate, newTime }: { id: string; newDate: string; newTime: string }) => 
      AppointmentsService.reschedule(id, newDate, newTime),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
      queryClient.invalidateQueries({ queryKey: ['appointments', 'available-slots'] });
    },
  });
};

// Hook pour envoyer un rappel
export const useSendAppointmentReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AppointmentsService.sendReminder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
    },
  });
};