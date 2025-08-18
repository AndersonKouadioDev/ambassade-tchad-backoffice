import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getEvenementDetailAction } from "../actions/evenement.action";
import { evenementKeyQuery } from "./index.query";
import React from "react";
import {toast} from "sonner";
import {actualiteQueryOption} from "@/features/actualites/queries/actualite-details.query";
import {getActualiteDetailAction} from "@/features/actualites/actions/actualites.action";

const queryClient = getQueryClient();

// Option de requête
export const evenementQueryOption = (id: string) => {
    return {
        queryKey: evenementKeyQuery(id),
        queryFn: async () => {

            const result = await getEvenementDetailAction(id);

            if (!result.success) {
                throw new Error(result.error || "Une erreur est survenue lors de la récupération de l'actualité");
            }

            return result.data!;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer un événement
export const useEvenementDetailQuery = (id: string) => {
    const query = useQuery(evenementQueryOption(id));

    React.useEffect(() => {
        if (query.isError || query.error) {
            toast.error(query.error?.message);
        }
    }, [query]);

    return query;
};
// Hook pour précharger un événement
export const prefetchEvenement = (id: string) => {
    return queryClient.prefetchQuery(evenementQueryOption(id));
}