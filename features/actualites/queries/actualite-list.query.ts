import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IActualiteRechercheParams } from "../types/actualites.type";
import { getActualiteTousAction } from "../actions/actualites.action";
import { actualiteKeyQuery, useInvalidateActualiteQuery } from "./index.query";
import { toast } from "sonner";
import React from "react";



const queryClient = getQueryClient();

// Option de requête
export const actualiteListQueryOption = (actualiteSearchParams: IActualiteRechercheParams) => {
    return {
        queryKey: actualiteKeyQuery("list", actualiteSearchParams),
        queryFn: async () => {
            const result = await getActualiteTousAction(actualiteSearchParams);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        }
        ,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,// le délai de rafraîchissement
        enable: true,
    };
}

// Hook pour récupérer les actualites
export const useActualitesList = (actualiteSearchParams: IActualiteRechercheParams) => {
    const query = useQuery(actualiteListQueryOption(actualiteSearchParams));

    React.useEffect(() => {
        if (query.isError || query.error) {
            toast.error(query.error?.message);
        }

    }, [query]);

    return query;
};

// Fonction pour précharger les actualites
export const prefetchActualitesList = (actualiteSearchParams: IActualiteRechercheParams) => {
    return queryClient.prefetchQuery(actualiteListQueryOption(actualiteSearchParams));
}