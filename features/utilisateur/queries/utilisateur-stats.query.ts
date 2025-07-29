import {
    useQuery,
} from '@tanstack/react-query';
import { utilisateurAPI } from '../apis/utilisateur.api';
import getQueryClient from '@/lib/get-query-client';

const queryClient = getQueryClient();

// Clé de cache 
export const utilisateurQueryKey = ['utilisateur', 'stats'] as const;

// Option de requête
export const utilisateurStatsQueryOption = () => {
    return {
        queryKey: utilisateurQueryKey,
        queryFn: async () => {
            const data = await utilisateurAPI.getStats();
            return data;
        },

        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
};

// Hook pour récupérer les stats utilisateurs
export const useUtilisateurStats = () => {
    return useQuery(utilisateurStatsQueryOption());
};

// Hook pour précharger les stats utilisateurs
export const prefetchUtilisateurStats = () => {
    return queryClient.prefetchQuery(utilisateurStatsQueryOption());
}

// Fonction pour invalider le cache
export const invalidateUtilisateurStats = () => {
    return queryClient.invalidateQueries({
        queryKey: utilisateurQueryKey,
    });
}
