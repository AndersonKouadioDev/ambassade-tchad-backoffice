import getQueryClient from "@/lib/get-query-client";
import { IActualite, PaginatedResponse } from "@/types";
import { actualiteAPI } from "../api/actualites.api";
import { IActualiteRechercheParams } from "../types/actualites.type";
import { useInfiniteQuery } from "@tanstack/react-query";

const queryClient = getQueryClient();

// la clé de cache
export const actualiteQueryKey = ['actualite'] as const;
// Option de requête
export const actualiteInfintyQueryOption = (actualiteSearchParams: IActualiteRechercheParams) => {
    return {
        queryKey: [...actualiteQueryKey, 'list', actualiteSearchParams],
        queryFn: async ({ pageParam = 1 }) => {
            const data = await actualiteAPI.getAll({
                ...actualiteSearchParams,
                page: pageParam,
                limit: 6,
            });
            return data;
        }
        ,
        initialPageParam: 1,
        getNextPageParam: (lastPage: PaginatedResponse<IActualite>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        }
    };
}

// Hook pour récupérer les actualites
export const useActualitesInfinity = (actualiteSearchParams: IActualiteRechercheParams) => {
    return useInfiniteQuery(actualiteInfintyQueryOption(actualiteSearchParams));
}


// Hook pour précharger les actualites
export const prefetchActualitesInfinity = (actualiteSearchParams: IActualiteRechercheParams) => {
    return queryClient.prefetchInfiniteQuery(actualiteInfintyQueryOption(actualiteSearchParams));
}


// Fonction pour invalider le cache
export const invalidateActualitesInfinity = (actualiteSearchParams: IActualiteRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...actualiteQueryKey, 'list', actualiteSearchParams],
    });
}