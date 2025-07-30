import {
    useInfiniteQuery,
} from '@tanstack/react-query';
import { IUtilisateur } from '../types/utilisateur.type';
import { PaginatedResponse } from '@/types';
import getQueryClient from '@/lib/get-query-client';
import { obtenirTousUtilisateursAction } from '../actions/utilisateur.action';
import { UtilisateursParamsDTO } from '../schema/utilisateur-params.schema';

const queryClient = getQueryClient();

//1- Clé de cache 
export const utilisateurQueryKey = (utilisateursParamsDTO: UtilisateursParamsDTO) => ['utilisateur', 'list', utilisateursParamsDTO] as const;

//2- Option de requête
export const utilisateursInfinityQueryOption = (utilisateursParamsDTO: UtilisateursParamsDTO) => {
    return {
        queryKey: utilisateurQueryKey(utilisateursParamsDTO),
        queryFn: async ({ pageParam = 1 }) => {
            const data = await obtenirTousUtilisateursAction({
                ...utilisateursParamsDTO,
                page: pageParam,
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

//3- Hook pour récupérer les utilisateurs
export const useUtilisateursInfinityQuery = (
    utilisateursParamsDTO: UtilisateursParamsDTO
) => {
    return useInfiniteQuery(utilisateursInfinityQueryOption(utilisateursParamsDTO));
};

//4- Fonction pour précharger les utilisateurs
export const prefetchUtilisateursInfinityQuery = (
    utilisateursParamsDTO: UtilisateursParamsDTO
) => {
    return queryClient.prefetchInfiniteQuery(utilisateursInfinityQueryOption(utilisateursParamsDTO));
}

//5- Fonction pour invalider le cache
export const invalidateUtilisateursInfinityQuery = (utilisateursParamsDTO: UtilisateursParamsDTO) => {
    return queryClient.invalidateQueries({
        queryKey: utilisateurQueryKey(utilisateursParamsDTO),
    });
}
