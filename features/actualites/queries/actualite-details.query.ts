import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { actualiteAPI } from "../api/actualites.api";
const queryClient = getQueryClient();

// la clé de cache
const actualiteQueryKey = (id: string) => ['actualite', 'detail', id];
// Option de requête
export const actualiteQueryOption = (id: string) => {
    return {
        queryKey: actualiteQueryKey(id),
        queryFn: async () => {    
            if (!id) throw new Error("L'identifiant de l'actualite est requis");
            const data = await actualiteAPI.getById(id);
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
