import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getEvenementStatsAction } from "../actions/evenement.action";
import { evenementKeyQuery } from "./index.query";

const queryClient = getQueryClient();
// Option de requête
export const evenementStatsQueryOption = () => {
    return {
        queryKey: evenementKeyQuery(),
        queryFn: async () => {
           const data = await getEvenementStatsAction();
           return data;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1, // Réessayer seulement 1 fois
        retryDelay: 1000, // Attendre 1 seconde avant de réessayer
    };
}
// Hook pour récupérer les stats des événements
export const useEvenementStats = () => {
    return useQuery(evenementStatsQueryOption());
};

// Hook pour précharger les stats des événements
export const prefetchEvenementStats = () => {
    return queryClient.prefetchQuery(evenementStatsQueryOption());
}

