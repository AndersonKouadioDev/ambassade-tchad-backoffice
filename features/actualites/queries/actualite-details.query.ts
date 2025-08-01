import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { actualiteAPI } from "../api/actualites.api";
import { getActualiteDetailAction } from "../actions/actualites.action";
const queryClient = getQueryClient();

// la clé de cache
const actualiteQueryKey = (id: string) => ['actualite', 'detail', id];
// Option de requête
export const actualiteQueryOption = (id: string) => {
    return {
        queryKey: actualiteQueryKey(id),
        queryFn: async () => {    
           
            const data = await getActualiteDetailAction(id);
            return data;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer un actualite
export const useActualite = (id: string) => {
    return useQuery(actualiteQueryOption(id));
};
// Hook pour précharger un actualite
export const prefetchActualite = (id: string) => {
    return queryClient.prefetchQuery(actualiteQueryOption(id));
}
// Fonction pour invalider le cache
export const invalidateActualite = (id: string) => {
    return queryClient.invalidateQueries({
        queryKey: actualiteQueryKey(id),
    });
}
// Fonction pour invalider tous les actualites
export const invalidateAllActualites = () => {
    return queryClient.invalidateQueries({  
        queryKey: ['actualite'],
    });
}
