import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IActualiteRechercheParams } from "../types/actualites.type";
import { getActualiteTousAction } from "../actions/actualites.action";
import { en } from "@faker-js/faker";



const queryClient = getQueryClient();

// la clé de cache
const actualiteQueryKey = ['actualite'] as const;

// Option de requête
export const actualiteListQueryOption = (actualiteSearchParams: IActualiteRechercheParams) => {
    return {
        queryKey: [...actualiteQueryKey, 'list', actualiteSearchParams],
        queryFn: async () => {
            const data = await getActualiteTousAction(actualiteSearchParams);
            return data;
        }
        ,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
        enable: true,
    };
}

// Hook pour récupérer les actualites
export const useActualitesList = (actualiteSearchParams: IActualiteRechercheParams) => {
    return useQuery(actualiteListQueryOption(actualiteSearchParams));
};

// Fonction pour précharger les actualites
export const prefetchActualitesList = (actualiteSearchParams: IActualiteRechercheParams) => {
    return queryClient.prefetchQuery(actualiteListQueryOption(actualiteSearchParams));
}

// Fonction pour invalider le cache
export const invalidateActualitesList = () => {
    return queryClient.invalidateQueries({
        queryKey: [...actualiteQueryKey],
    })
}

// Fonction pour invalider tous les actualites
export const invalidateAllActualites = async () => {
    queryClient.clear();
    return queryClient.invalidateQueries({
        queryKey: actualiteQueryKey,
    });
}   
