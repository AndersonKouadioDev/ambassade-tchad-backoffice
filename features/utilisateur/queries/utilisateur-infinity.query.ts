import {
    useInfiniteQuery,
} from '@tanstack/react-query';
import { IUtilisateur } from '../types/utilisateur.type';
import { PaginatedResponse } from '@/types';
import getQueryClient from '@/lib/get-query-client';
import { obtenirTousUtilisateursAction } from '../actions/utilisateur.action';
import { IUtilisateursParams } from '../types/utilisateur.type';
import { utilisateurKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête
export const utilisateursInfinityQueryOption = (utilisateursParamsDTO: IUtilisateursParams) => {
    return {
        queryKey: utilisateurKeyQuery("list", utilisateursParamsDTO),
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
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération des utilisateurs:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer les utilisateurs
export const useUtilisateursInfinityQuery = (
    utilisateursParamsDTO: IUtilisateursParams
) => {
    return useInfiniteQuery(utilisateursInfinityQueryOption(utilisateursParamsDTO));
};

//3- Fonction pour précharger les utilisateurs
export const prefetchUtilisateursInfinityQuery = (
    utilisateursParamsDTO: IUtilisateursParams
) => {
    return queryClient.prefetchInfiniteQuery(utilisateursInfinityQueryOption(utilisateursParamsDTO));
}
