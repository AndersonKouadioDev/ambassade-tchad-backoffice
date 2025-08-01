import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getEvenementDetailAction } from "../actions/evenement.action";

const queryClient = getQueryClient();

// la clé de cache
const evenementQueryKey = (id: string) => ['evenement', 'detail', id];
// Option de requête
export const evenementQueryOption = (id: string) => {
    return {
        queryKey: evenementQueryKey(id),
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
// Fonction pour invalider le cache
export const invalidateEvenement = (id: string) => {
    return queryClient.invalidateQueries({
        queryKey: evenementQueryKey(id),
    });
}
// Fonction pour invalider tous les événements
export const invalidateAllEvenements = () => {
    return queryClient.invalidateQueries({  
        queryKey: ['evenement'],
    });
}
