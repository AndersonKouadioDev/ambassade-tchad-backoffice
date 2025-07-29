import {
    useInfiniteQuery,
} from '@tanstack/react-query';
import { utilisateurAPI } from '../apis/utilisateur.api';
import { IUtilisateur, IUtilisateursRechercheParams } from '../types/utilisateur.type';
import { PaginatedResponse } from '@/types';
import getQueryClient from '@/lib/get-query-client';

const queryClient = getQueryClient();

// Clé de cache 
export const utilisateurQueryKey = ['utilisateur'] as const;

// Option de requête
export const utilisateursInfinityQueryOption = (utilisateursSearchParams: IUtilisateursRechercheParams) => {
    return {
        queryKey: [...utilisateurQueryKey, 'list', utilisateursSearchParams],
        queryFn: async ({ pageParam = 1 }) => {
            const data = await utilisateurAPI.getAll({
                ...utilisateursSearchParams,
                page: pageParam,
                limit: 10,
            });
            return data;
        },

        initialPageParam: 1,

        getNextPageParam: (lastPage: PaginatedResponse<IUtilisateur>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
    };
};

// Hook pour récupérer les utilisateurs
export const useUtilisateursInfinity = (
    utilisateursSearchParams: IUtilisateursRechercheParams
) => {
    return useInfiniteQuery(utilisateursInfinityQueryOption(utilisateursSearchParams));
};

// Hook pour précharger les utilisateurs
export const prefetchUtilisateursInfinity = (
    utilisateursSearchParams: IUtilisateursRechercheParams
) => {
    return queryClient.prefetchInfiniteQuery(utilisateursInfinityQueryOption(utilisateursSearchParams));
}

// Fonction pour invalider le cache
export const invalidateUtilisateursInfinity = (utilisateursSearchParams: IUtilisateursRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...utilisateurQueryKey, 'list', utilisateursSearchParams],
    });
}
