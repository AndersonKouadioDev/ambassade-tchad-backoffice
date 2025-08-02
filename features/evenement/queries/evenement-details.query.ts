import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getEvenementDetailAction } from "../actions/evenement.action";
import { evenementKeyQuery } from "./index.query";

const queryClient = getQueryClient();

// Option de requête
export const evenementQueryOption = (id: string) => {
    return {
        queryKey: evenementKeyQuery(id),
        queryFn: async () => {    
            const data = await getEvenementDetailAction(id);
            return data;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer un événement
export const useEvenement = (id: string) => {
    return useQuery(evenementQueryOption(id));
};
// Hook pour précharger un événement
export const prefetchEvenement = (id: string) => {
    return queryClient.prefetchQuery(evenementQueryOption(id));
}