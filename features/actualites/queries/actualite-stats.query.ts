import getQueryClient from "@/lib/get-query-client";
import { actualiteAPI } from "../api/actualites.api";
import { useQuery } from "@tanstack/react-query";

const queryClient = getQueryClient();

export const actualiteQueryKey = ['actualite', 'stats'] as const;

// Option de requête
export const actualiteStatsQueryOption = () => {
    return {        
        queryKey: actualiteQueryKey,
        queryFn: async () => {
            const data = await actualiteAPI.getStats();
            return data;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    };
}
// Hook pour récupérer les stats des actualites
export const useActualiteStats = () => {
    return useQuery(actualiteStatsQueryOption());
};

// Hook pour précharger les stats des actualites
export const prefetchActualiteStats = () => {
    return queryClient.prefetchQuery(actualiteStatsQueryOption());
}

// Fonction pour invalider le cache
    export const invalidateActualiteStats = () => {
    return queryClient.invalidateQueries({
        queryKey: actualiteQueryKey,
    });
}   
