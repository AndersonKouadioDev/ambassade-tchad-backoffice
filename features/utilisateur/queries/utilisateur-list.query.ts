import {
    useQuery,
} from '@tanstack/react-query';
import { utilisateurAPI } from '../apis/utilisateur.api';
import { IUtilisateursRechercheParams } from '../types/utilisateur.type';
import getQueryClient from '@/lib/get-query-client';

const queryClient = getQueryClient();

// Clé de cache 
export const utilisateurQueryKey = ['utilisateur'] as const;

// Option de requête
export const utilisateursListQueryOption = (utilisateursSearchParams: IUtilisateursRechercheParams) => {
    return {
        queryKey: [...utilisateurQueryKey, 'list', utilisateursSearchParams],
        queryFn: async () => {
            const data = await utilisateurAPI.getAll(utilisateursSearchParams);
            return data;
        },

        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
};

// Hook pour récupérer les utilisateurs
export const useUtilisateursList = (
    utilisateursSearchParams: IUtilisateursRechercheParams
) => {
    return useQuery(utilisateursListQueryOption(utilisateursSearchParams));
};

// Hook pour précharger les utilisateurs
export const prefetchUtilisateurs = (
    utilisateursSearchParams: IUtilisateursRechercheParams
) => {
    return queryClient.prefetchQuery(utilisateursListQueryOption(utilisateursSearchParams));
}

// Fonction pour invalider le cache
export const invalidateUtilisateurs = (utilisateursSearchParams: IUtilisateursRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...utilisateurQueryKey, 'list', utilisateursSearchParams],
    });
}
