import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api as apiClient } from '@/lib/api-http';

// Types pour les événements selon l'API backend
export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  published: boolean;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  eventDate?: string;
  location?: string;
  published?: boolean;
}

export interface EventFilters {
  title?: string;
  published?: boolean;
  fromDate?: string;
  toDate?: string;
  authorId?: string;
}

export interface EventStats {
  total: number;
  published: number;
  unpublished: number;
  thisMonth: number;
}

export interface PaginatedEventsResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Services API selon les endpoints du guide
class EventsService {
  // Obtenir tous les événements (publique)
  async getEvents(): Promise<Event[]> {
    const response = await apiClient.get('/events');
    return response.data;
  }

  // Obtenir les événements avec pagination
  async getEventsPaginated(filters: EventFilters & { page?: number; limit?: number } = {}): Promise<PaginatedEventsResponse> {
    const params = new URLSearchParams();
    
    // Paramètres de pagination
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    // Paramètres de filtrage
    if (filters.title) params.append('title', filters.title);
    if (filters.published !== undefined) params.append('published', filters.published.toString());
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    if (filters.authorId) params.append('authorId', filters.authorId);

    const response = await apiClient.get(`/events?${params.toString()}`);
    return response.data;
  }

  // Filtrer les événements
  async filterEvents(filters: EventFilters = {}): Promise<Event[]> {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.published !== undefined) params.append('published', filters.published.toString());
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    if (filters.authorId) params.append('authorId', filters.authorId);

    const response = await apiClient.get(`/events/filter?${params.toString()}`);
    return response.data;
  }

  // Statistiques des événements
  async getEventStats(): Promise<EventStats> {
    const response = await apiClient.get('/events/stats');
    return response.data;
  }

  // Obtenir un événement par ID
  async getEventById(id: string): Promise<Event> {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  }

  // Créer un événement
  async createEvent(eventData: CreateEventData): Promise<Event> {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  }

  // Mettre à jour un événement
  async updateEvent(id: string, eventData: UpdateEventData): Promise<Event> {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  }

  // Supprimer un événement
  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  }
}

export const eventsService = new EventsService();

// Hooks TanStack Query
export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => eventsService.getEvents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFilteredEvents = (filters: EventFilters) => {
  return useQuery({
    queryKey: ['events', 'filtered', filters],
    queryFn: () => eventsService.filterEvents(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useEventStats = () => {
  return useQuery({
    queryKey: ['events', 'stats'],
    queryFn: () => eventsService.getEventStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsService.getEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventsService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, eventData }: { id: string; eventData: UpdateEventData }) => 
      eventsService.updateEvent(id, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventsService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};