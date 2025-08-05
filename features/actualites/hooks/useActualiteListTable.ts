import { useMemo, useState } from "react";
import { useQueryStates } from 'nuqs';
import { useActualitesList } from "../queries/actualite-list.query";
import { actualiteFiltersClient } from "../filters/actualite.filters";
import { IActualite, IActualiteRechercheParams } from "../types/actualites.type";

export const useActualiteListTable = () => {
  // Gestion des paramètres d'URL via Nuqs
  const [filters, setFilters] = useQueryStates(actualiteFiltersClient.filter, actualiteFiltersClient.option);

  // Construction des paramètres de recherche par défaut pour React Query
  const currentSearchParams: IActualiteRechercheParams = useMemo(() => {
    return {
      page: Number(filters.page) || 1,
      limit: Number(filters.limit) || 10,
      title: filters.title.trim(),
      content: filters.content,
      published: filters.published === 'true' ? true : filters.published === 'false' ? false : undefined,
      authorId: filters.authorId,
    }
  }, [filters]);

  // Recherche des actualités
  const { data, isLoading, error } = useActualitesList(currentSearchParams);

  const [currentActualite, setCurrentActualite] = useState<IActualite | null>(null);

  const handleView = (actualite: IActualite) => {
    setCurrentActualite(actualite);
  }

  const handleDelete = (actualite: IActualite) => {
    setCurrentActualite(actualite);
  }

  const handleTextFilterChange = (filterName: 'title' | 'description' | 'authorId', value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterName]: value,
      page: 1,
    }));
  };

  const handlePublishedFilterChange = (value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      published: value as 'true' | 'false' | 'all',
      page: 1,
    }));
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
      page: 1,
    }));
  };

  return {
    data: data?.data,
    isLoading,
    error,
    filters,
    pagination: {
      currentPage: data?.meta.page,
      totalPages: data?.meta.totalPages,
      totalItems: data?.meta.total,
      itemsPerPage: data?.meta.limit,
    },
    handleTextFilterChange,
    handlePublishedFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleView,
    handleDelete,
    currentActualite,
  };
};

