import { useState, useMemo } from "react";
import { useQueryStates } from 'nuqs';
import { evenementFiltersClient } from '../filters/evenement.filters';
import { IEvenementRechercheParams } from "../types/evenement.type";
import { useEvenementsList } from "../queries/evenement-list.query";
import { createEvenement, updateEvenement, deleteEvenement } from "../actions/evenement.action";
import { EvenementDTO } from "../schemas/evenement.schema";
import { toast } from "sonner";

export const useEvenementListTable = () => {
  // Gestion des paramètres d'URL via Nuqs
  const [filters, setFilters] = useQueryStates(evenementFiltersClient, {
    clearOnDefault: true
  });

  // Construction des paramètres de recherche par défaut pour React Query
  const currentSearchParams: IEvenementRechercheParams = useMemo(() => {
    const params: IEvenementRechercheParams = {
      page: Number(filters.page) || 1,
      limit: Number(filters.limit) || 12,
    };

    // Ajouter seulement les paramètres qui ont des valeurs valides
    if (filters.title && filters.title.trim()) {
      params.title = filters.title.trim();
    }

    if (filters.description && filters.description.trim()) {
      params.description = filters.description.trim();
    }

    if (filters.authorId && filters.authorId.trim()) {
      params.authorId = filters.authorId.trim();
    }

    // Si published est 'all' ou undefined, ne pas l'inclure du tout

    return params;
  }, [filters]);

  const { data, isLoading, error } = useEvenementsList(currentSearchParams);

  console.log('useEvenementListTable - React Query result:', { data, isLoading, error });

  const handleTextFilterChange = (filterName: 'title' | 'description' | 'authorId', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1, // Réinitialise à la première page
    }));
  };

  const handlePublishedFilterChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      published: value as 'true' | 'false' | 'all',
      page: 1, // Réinitialise à la première page
    }));
  };



  const handleCreate = async (formData: EvenementDTO, formDataToSend?: FormData) => {
    try {
      const result = await createEvenement(formData as any);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Erreur lors de la création de l'événement");
      throw error;
    }
  };

  const handleUpdate = async (id: string, formData: EvenementDTO) => {
    try {
      const result = await updateEvenement(id, formData as any);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'événement");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteEvenement(id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'événement");
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

  console.log('useEvenementListTable - paginationData:', paginationData);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setFilters(prev => ({
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
    handlePageChange,
    handleItemsPerPageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

