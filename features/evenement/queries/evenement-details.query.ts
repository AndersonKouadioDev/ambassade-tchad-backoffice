import getQueryClient from "@/lib/get-query-client";
import { evenementAPI } from "../apis/evenement.api";
import { useQuery } from "@tanstack/react-query";
const queryClient = getQueryClient();

// la clé de cache
const evenementQueryKey = (id: string) => ['evenement', 'detail', id];
// Option de requête
export const evenementQueryOption = (id: string) => {
    return {
        queryKey: evenementQueryKey(id),
        queryFn: async () => {    
            if (!id) throw new Error("L'identifiant de l'événement est requis");
            const data = await evenementAPI.getById(id);
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
