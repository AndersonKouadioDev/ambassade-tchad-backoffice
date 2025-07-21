import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  eventsService,
  type Event,
  type EventFilters,
  type CreateEventData,
  type UpdateEventData,
  type EventStats
} from '@/lib/api/events.service';

// Interface pour la réponse paginée des événements
export interface PaginatedEventsResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface pour les filtres avec pagination
export interface EventFiltersWithPagination extends EventFilters {
  page?: number;
  limit?: number;
}

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters?: EventFiltersWithPagination) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  stats: () => [...eventKeys.all, 'stats'] as const,
};

// Hook pour récupérer les événements avec pagination
export function useEvents(filters?: EventFiltersWithPagination) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: async () => {
      const data = await eventsService.getEventsPaginated(filters);
      console.log('📅 Données des événements récupérées:', data);
      console.log('📊 Nombre total d\'événements:', data.total);
      console.log('📄 Événements sur cette page:', data.data.length);
      console.log('🔍 Filtres appliqués:', filters);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour récupérer les statistiques des événements
export function useEventStats() {
  return useQuery({
    queryKey: eventKeys.stats(),
    queryFn: () => eventsService.getEventStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook pour récupérer un événement par ID
export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsService.getEventById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour créer un événement
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventData) => eventsService.createEvent(data),
    onSuccess: (newEvent) => {
      // Invalider et refetch les listes d'événements
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      
      // Ajouter le nouvel événement au cache
      queryClient.setQueryData(eventKeys.detail(newEvent.id), newEvent);
      
      toast.success('Événement créé avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de la création de l\'événement';
      toast.error(message);
    },
  });
}

// Hook pour mettre à jour un événement
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, eventData }: { id: string; eventData: UpdateEventData }) => 
      eventsService.updateEvent(id, eventData),
    onSuccess: (updatedEvent) => {
      // Mettre à jour le cache de l'événement spécifique
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      
      toast.success('Événement mis à jour avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de la mise à jour de l\'événement';
      toast.error(message);
    },
  });
}

// Hook pour supprimer un événement
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsService.deleteEvent,
    onSuccess: (_, deletedId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedId) });
      
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      
      toast.success('Événement supprimé avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de la suppression de l\'événement';
      toast.error(message);
    },
  });
}

// Hook pour publier/dépublier un événement
export function useToggleEventPublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => 
      eventsService.updateEvent(id, { published }),
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      
      const action = updatedEvent.published ? 'publié' : 'dépublié';
      toast.success(`Événement ${action} avec succès`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de la mise à jour du statut de publication';
      toast.error(message);
    },
  });
}