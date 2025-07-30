"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { triggerSessionExpired } from "@/components/session-manager";
import {
  getStats,
  getRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
} from "@/services/demande-service";
import type {
  CreateRequestData,
  RequestStats,
  RequestStatus,
  Demande,
} from "@/types/demande.types";
import type { PaginatedResponse } from "@/types";
import { ServiceType } from "@/types/service.types";

// Query Keys
export const demandeKeys = {
  all: ["demandes"] as const,
  lists: () => [...demandeKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...demandeKeys.lists(), { filters }] as const,
  details: () => [...demandeKeys.all, "detail"] as const,
  detail: (id: string) => [...demandeKeys.details(), id] as const,
  stats: () => [...demandeKeys.all, "stats"] as const,
  track: (trackingNumber: string) =>
    [...demandeKeys.all, "track", trackingNumber] as const,
};

// Stats Query
export function useDemandeStats() {
  return useQuery({
    queryKey: demandeKeys.stats(),
    queryFn: () => getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// List Query
export function useDemandesList(
  params: {
    page?: number;
    limit?: number;
    status?: RequestStatus;
    serviceType?: ServiceType;
    search?: string;
  } = {}
) {
  return useQuery({
    queryKey: demandeKeys.list(params),
    queryFn: () => getRequests(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.message?.includes("SESSION_EXPIRED")) {
        triggerSessionExpired();
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Detail Query
export function useDemande(id: string) {
  return useQuery({
    queryKey: demandeKeys.detail(id),
    queryFn: () => getRequestById(id),
    enabled: !!id,
  });
}

// Update Status Mutation
export function useUpdateDemandeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      comment,
    }: {
      id: string;
      status: RequestStatus;
      comment?: string;
    }) => updateRequestStatus(id, status, comment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: demandeKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      toast.success("Statut mis à jour avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la mise à jour du statut");
    },
  });
}

// Delete Mutation
export function useDeleteDemande() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      toast.success("Demande supprimée avec succès");
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Erreur lors de la suppression de la demande"
      );
    },
  });
}

// Bulk Operations
export function useBulkUpdateDemandeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ids,
      status,
      comment,
    }: {
      ids: string[];
      status: RequestStatus;
      comment?: string;
    }) => {
      const promises = ids.map((id) =>
        updateRequestStatus(id, status, comment)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: demandeKeys.stats() });
      toast.success("Statuts mis à jour avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la mise à jour des statuts");
    },
  });
}
