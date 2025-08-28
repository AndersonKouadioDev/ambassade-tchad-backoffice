import React from "react";
import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getActualiteDetailAction } from "../actions/actualites.action";
import { actualiteKeyQuery } from "./index.query";
import { toast } from "sonner";
const queryClient = getQueryClient();

// Option de requête
export const actualiteQueryOption = (id: string) => {
    return {
        queryKey: actualiteKeyQuery("detail", id),
        queryFn: async () => {

            const result = await getActualiteDetailAction(id);

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data!;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer un actualite
export const useActualiteDetailQuery = (id: string) => {
    const query = useQuery(actualiteQueryOption(id));

    React.useEffect(() => {
        if (query.isError || query.error) {
            toast.error(query.error?.message);
        }
    }, [query]);

    return query;
};

// Hook pour précharger un actualite
export const prefetchActualiteDetailQuery = (id: string) => {
    return queryClient.prefetchQuery(actualiteQueryOption(id));
}