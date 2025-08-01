import getQueryClient from "@/lib/get-query-client";
import { IEvenement, PaginatedResponse } from "@/types";
import { evenementAPI } from "../apis/evenement.api";
import { IEvenementRechercheParams } from "../types/evenement.type";
import { useInfiniteQuery } from "@tanstack/react-query";

const queryClient = getQueryClient();

// la clé de cache
export const evenementQueryKey = ['evenement'] as const;
// Option de requête
export const evenementInfintyQueryOption = (evenementSearchParams: IEvenementRechercheParams) => {
    return {
        queryKey: [...evenementQueryKey, 'list', evenementSearchParams],
        queryFn: async ({ pageParam = 1 }) => {
            const data = await evenementAPI.getAll({
                ...evenementSearchParams,
                page: pageParam,
                limit: 10,
            });
            return data;
        }
        ,
        initialPageParam: 1,
        getNextPageParam: (lastPage: PaginatedResponse<IEvenement>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        }
    };
}

// Hook pour récupérer les événements
export const useEvenementsInfinity = (evenementSearchParams: IEvenementRechercheParams) => {
    return useInfiniteQuery(evenementInfintyQueryOption(evenementSearchParams));
}


// Hook pour précharger les événements
export const prefetchEvenementsInfinity = (evenementSearchParams: IEvenementRechercheParams) => {
    return queryClient.prefetchInfiniteQuery(evenementInfintyQueryOption(evenementSearchParams));
}


// Fonction pour invalider le cache
export const invalidateEvenementsInfinity = (evenementSearchParams: IEvenementRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...evenementQueryKey, 'list', evenementSearchParams],
    });
}