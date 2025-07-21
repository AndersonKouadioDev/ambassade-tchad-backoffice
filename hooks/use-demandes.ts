import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  demandesService,
  type Demande,
  type DemandeFilters,
  type CreateDemandeData,
  type UpdateDemandeData,
  type PaginatedResponse,
  type DemandeStats
} from '@/lib/api/demandes.service';

// Query keys
export const demandeKeys = {
  all: ['demandes'] as const,
  lists: () => [...demandeKeys.all, 'list'] as const,
  list: (filters?: DemandeFilters) => [...demandeKeys.lists(), filters] as const,
  details: () => [...demandeKeys.all, 'detail'] as const,
  detail: (id: string) => [...demandeKeys.details(), id] as const,
  stats: () => [...demandeKeys.all, 'stats'] as const,
};

// Hook pour obtenir les demandes avec filtres et pagination
export function useDemandes(filters?: DemandeFilters) {
  return useQuery({
    queryKey: demandeKeys.list(filters),
    queryFn: async () => {
      const data = await demandesService.getDemandes(filters);
      console.log('📋 Données des demandes récupérées:', data);
      console.log('📊 Nombre total de demandes:', data.total);
      console.log('📄 Demandes sur cette page:', data.data.length);
      console.log('🔍 Filtres appliqués:', filters);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour obtenir les statistiques des demandes
export function useDemandeStats() {
  return useQuery({
    queryKey: demandeKeys.stats(),
    queryFn: () => demandesService.getDemandeStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour obtenir une demande par ID
export function useDemande(id: string) {
  return useQuery({
    queryKey: demandeKeys.detail(id),
    queryFn: () => demandesService.getDemandeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour créer une demande
export function useCreateDemande() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDemandeData) => demandesService.createDemande(data),
    onSuccess: (newDemande) => {
      // Invalider et refetch les listes de demandes
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      
      // Ajouter la nouvelle demande au cache
      queryClient.setQueryData(demandeKeys.detail(newDemande.id), newDemande);
      
      toast.success('Demande créée avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de la création de la demande';
      toast.error(message);
    },
  });
}

// Hook pour mettre à jour le statut d'une demande (seule modification autorisée)
export function useUpdateDemandeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, observation }: { id: string; status: string; observation?: string }) => {
      console.log('🔧 Updating demande status:', { id, status, observation });
      return demandesService.updateDemandeStatus(id, status, observation);
    },
    onSuccess: (updatedDemande) => {
      // Mettre à jour le cache de la demande spécifique
      queryClient.setQueryData(demandeKeys.detail(updatedDemande.id), updatedDemande);
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      
      toast.success('Statut de la demande mis à jour avec succès');
    },
    onError: (error: any) => {
      console.error('❌ Status update error:', error);
      const message = error?.response?.data?.message || 'Erreur lors de la mise à jour du statut';
      toast.error(message);
    },
  });
}

// Hook pour compatibilité (utilise updateStatus)
export function useUpdateDemande() {
  return useUpdateDemandeStatus();
}

// Hook pour supprimer une demande
export function useDeleteDemande() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => demandesService.deleteDemande(id),
    onSuccess: (_, deletedId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: demandeKeys.detail(deletedId) });
      
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      
      toast.success('Demande supprimée avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de la suppression de la demande';
      toast.error(message);
    },
  });
}

// Hook pour assigner une demande
export function useAssignDemande() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) => 
      demandesService.assignDemande(id, assignedTo),
    onSuccess: (updatedDemande) => {
      queryClient.setQueryData(demandeKeys.detail(updatedDemande.id), updatedDemande);
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      
      toast.success('Demande assignée avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de l\'assignation de la demande';
      toast.error(message);
    },
  });
}

// Hook pour approuver une demande
export function useApproveDemande() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      demandesService.approveDemande(id, notes),
    onSuccess: (updatedDemande) => {
      queryClient.setQueryData(demandeKeys.detail(updatedDemande.id), updatedDemande);
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      
      toast.success('Demande approuvée avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de l\'approbation de la demande';
      toast.error(message);
    },
  });
}

// Hook pour rejeter une demande
export function useRejectDemande() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => 
      demandesService.rejectDemande(id, rejectionReason),
    onSuccess: (updatedDemande) => {
      queryClient.setQueryData(demandeKeys.detail(updatedDemande.id), updatedDemande);
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      
      toast.success('Demande rejetée');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors du rejet de la demande';
      toast.error(message);
    },
  });
}

// Hook pour marquer comme prêt pour retrait
export function useMarkReadyForPickup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => demandesService.markReadyForPickup(id),
    onSuccess: (updatedDemande) => {
      queryClient.setQueryData(demandeKeys.detail(updatedDemande.id), updatedDemande);
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      
      toast.success('Demande marquée comme prête pour retrait');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de la mise à jour du statut';
      toast.error(message);
    },
  });
}

// Hook pour marquer comme complétée
export function useCompleteDemande() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => demandesService.completeDemande(id),
    onSuccess: (updatedDemande) => {
      queryClient.setQueryData(demandeKeys.detail(updatedDemande.id), updatedDemande);
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      
      toast.success('Demande marquée comme complétée');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erreur lors de la finalisation de la demande';
      toast.error(message);
    },
  });
}