import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirStatsUtilisateursAction } from '../actions/utilisateur.action';

const queryClient = getQueryClient();

//1- Clé de cache 
export const utilisateurQueryKey = () => ['utilisateur', 'stats'];

//2- Option de requête
export const utilisateurStatsQueryOption = () => {
    return {
        queryKey: utilisateurQueryKey(),
        queryFn: async () => {
            return await obtenirStatsUtilisateursAction();
        },

        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
};

//3- Hook pour récupérer les stats utilisateurs
export const useUtilisateurStatsQuery = () => {
    return useQuery(utilisateurStatsQueryOption());
};

//4- Fonction pour précharger les stats utilisateurs
export const prefetchUtilisateurStatsQuery = () => {
    return queryClient.prefetchQuery(utilisateurStatsQueryOption());
}

//5- Fonction pour invalider le cache
export const invalidateUtilisateurStatsQuery = () => {
    return queryClient.invalidateQueries({
        queryKey: utilisateurQueryKey(),
    });
}
