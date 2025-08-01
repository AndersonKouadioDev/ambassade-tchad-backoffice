import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IActualiteRechercheParams } from "../types/actualites.type";
import { actualiteAPI } from "../api/actualites.api";



const queryClient = getQueryClient();

// la clé de cache
const actualiteQueryKey = ['actualite'] as const;

// Option de requête
export const actualiteListQueryOption = (actualiteSearchParams: IActualiteRechercheParams) => {
    return {
        queryKey: [...actualiteQueryKey, 'list', actualiteSearchParams],    
        queryFn: async () => {
            const data = await actualiteAPI.getAll(actualiteSearchParams);
            return data;
        }
        ,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
}

// Hook pour récupérer les actualites
export const useActualitesList = (actualiteSearchParams: IActualiteRechercheParams) => {
    return useQuery(actualiteListQueryOption(actualiteSearchParams));
};

// Hook pour précharger les actualites
export const prefetchActualitesList = (actualiteSearchParams: IActualiteRechercheParams) => {
    return queryClient.prefetchQuery(actualiteListQueryOption(actualiteSearchParams));
}

// Fonction pour invalider le cache
export const invalidateActualitesList = (actualiteSearchParams: IActualiteRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...actualiteQueryKey, 'list', actualiteSearchParams],
    });
}

// Fonction pour invalider tous les actualites
export const invalidateAllActualites = () => {
    return queryClient.invalidateQueries({  
        queryKey: actualiteQueryKey,
    });
}   
