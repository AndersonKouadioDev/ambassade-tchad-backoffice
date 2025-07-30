import { useState, useMemo } from "react";
import { useQueryStates } from 'nuqs';
import { toast } from "sonner";
import { ActualiteStatus, IActualiteRechercheParams } from "../types/actualites.type";

import { ActualiteDTO } from "../schemas/actualites.schema";
import { createActualite, deleteActualite } from "../actions/actualites.action";

import { invalidateAllActualites } from "../queries/actualite-details.query";

import { updateActualite } from "../actions/actualites.action";
import { useActualitesList } from "../queries/actualite-list.query";
import { actualiteFiltersClient } from "../filters/actualite.filters";

export const useActualiteCard = () => {
  // Gestion des paramètres d'URL via Nuqs
  const [filters, setFilters] = useQueryStates(actualiteFiltersClient, {
    clearOnDefault: true
  });

  // Construction des paramètres de recherche par défaut pour React Query
  const currentSearchParams: IActualiteRechercheParams = useMemo(() => {
    const params: IActualiteRechercheParams = {
        page: Number(filters.page) || 1,
        limit: Number(filters.limit) || 12,
        status: undefined
    };

    // Ajouter seulement les paramètres qui ont des valeurs valides
    if (filters.title && filters.title.trim()) {
      params.title = filters.title.trim();
    }
    
    if (filters.content && filters.content.trim()) {
      params.content = filters.content.trim();
    }
    
    if (filters.authorId && filters.authorId.trim()) {
      params.authorId = filters.authorId.trim();
    }
    
    // Gérer published (boolean)
    if (filters.published !== null && filters.published !== undefined) {
      params.published = filters.published;
    }
    
    // Gérer status (enum)
    if (filters.status && filters.status !== null) {
      params.status = filters.status;
    }
    
    console.log('useActualiteCard - currentSearchParams:', params);
    return params;
  }, [filters]);

  const { data, isLoading, error } = useActualitesList(currentSearchParams);

  console.log('useActualiteCard - React Query result:', { data, isLoading, error });

  const handleTextFilterChange = (filterName: 'title' | 'description' | 'authorId', value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterName]: value,
      page: 1, // Réinitialise à la première page
    }));
  };

  const handlePublishedFilterChange = (value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      published: value === "all" ? undefined : value === "true",
      page: 1, // Réinitialise à la première page
    }));
  };

  const handleStatusFilterChange = (value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      status: value === "_all_" ? undefined : (value as ActualiteStatus),
      page: 1, // Réinitialise à la première page
    }));
  };

  const handleCreate = async (formData: ActualiteDTO, formDataToSend?: FormData) => {
    try {
      const result = await createActualite(formData, formDataToSend);
      
      if (result.success) {
        toast.success(result.message);
        await invalidateAllActualites();
      } else {
        toast.error(result.message);
      }
      
      return result;
    } catch (error) {
        toast.error("Erreur lors de la création de l'actualite");
      throw error;
    }
  };

  const handleUpdate = async (id: string, formData: ActualiteDTO) => {
    try {
      const result = await updateActualite(id, formData);
      
      if (result.success) {
        toast.success(result.message);
        await invalidateAllActualites();
      } else {
        toast.error(result.message);
      }
      
      return result;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'actualite");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteActualite(id);
      
      if (result.success) {
        toast.success(result.message);
        await invalidateAllActualites();
      } else {
        toast.error(result.message);
      }
      
      return result;
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'actualite");
      throw error;
    }
  };

  // Extraction des données de pagination
  const paginationData = {
    data: Array.isArray((data as any)?.data) ? (data as any).data : [],
    meta: (data as any)?.meta || {
      page: 1,
      limit: 12,
      totalItems: 0,
      totalPages: 1,
    },
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: any) => ({
      ...prev,
      page,
    }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setFilters((prev: any) => ({
      ...prev,
      limit,
      page: 1, // Retour à la première page lors du changement de limite
    }));
  };

  return {
    data: paginationData.data,
    isLoading,
    error,
    filters,
    pagination: {
      currentPage: paginationData.meta.page,
      totalPages: paginationData.meta.totalPages,
      totalItems: paginationData.meta.totalItems,
      itemsPerPage: paginationData.meta.limit,
    },
    handleTextFilterChange,
    handlePublishedFilterChange,
    handleStatusFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

