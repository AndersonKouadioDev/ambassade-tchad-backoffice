import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getEvenementStatsAction } from "../actions/evenement.action";
import { evenementKeyQuery } from "./index.query";
import React from "react";
import { toast } from "sonner";

const queryClient = getQueryClient();

export const evenementStatsQueryOption = () => {
    return {
        queryKey: evenementKeyQuery(),
        queryFn: async () => {
            const result = await getEvenementStatsAction();

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data!;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1, // Réessayer seulement 1 fois
        retryDelay: 1000, // Attendre 1 seconde avant de réessayer
    };
}
// Hook pour récupérer les stats des événements
export const useEvenementStats = () => {
    const query = useQuery(evenementStatsQueryOption());
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error("Erreur de récupération des stats des événements:", {
                description: query.error?.message,
            });
        }
    }, [query]);
    return query;
};

// Hook pour précharger les stats des événements
export const prefetchEvenementStats = () => {
    return queryClient.prefetchQuery(evenementStatsQueryOption());
}

