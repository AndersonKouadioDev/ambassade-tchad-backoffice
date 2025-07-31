import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getActualiteStatsAction } from "../actions/actualites.action";

const queryClient = getQueryClient();

export const actualiteQueryKey = ['actualite', 'stats'] as const;

// Option de requête
export const actualiteStatsQueryOption = () => {
    return {        
        queryKey: actualiteQueryKey,
        queryFn: async () => {
            const data = await getActualiteStatsAction();
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

// Foncion pour précharger les stats des actualites
export const prefetchActualiteStats = () => {
    return queryClient.prefetchQuery(actualiteStatsQueryOption());
}

// Fonction pour invalider le cache
    export const invalidateActualiteStats = () => {
    return queryClient.invalidateQueries({
        queryKey: actualiteQueryKey,
    });
}   
