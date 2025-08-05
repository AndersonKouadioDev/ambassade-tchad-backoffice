import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getActualiteStatsAction } from "../actions/actualites.action";
import { actualiteKeyQuery } from "./index.query";
import { toast } from "sonner";
import React from "react";

const queryClient = getQueryClient();

//1- Option de requête
export const actualiteStatsQueryOption = () => {
    return {
        queryKey: actualiteKeyQuery("stats"),
        queryFn: async () => {
            const result = await getActualiteStatsAction();
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des stats actualites");
            }
            return result.data;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    };
}

//2- Hook pour récupérer les stats des actualites
export const useActualiteStatsQuery = () => {
    const query = useQuery(actualiteStatsQueryOption());

    React.useEffect(() => {
        if (query.isError || query.error) {
            toast.error("Erreur lors de la récupération des stats actualites");
        }
    }, [query]);

    return query;
};

//3- Foncion pour précharger les stats des actualites
export const prefetchActualiteStats = () => {
    return queryClient.prefetchQuery(actualiteStatsQueryOption());
}