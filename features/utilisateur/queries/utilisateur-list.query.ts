import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirTousUtilisateursAction } from '../actions/utilisateur.action';
import { IUtilisateursParams } from '../types/utilisateur.type';
import { utilisateurKeyQuery } from './index.query';

const queryClient = getQueryClient();

//1- Option de requête optimisée
export const utilisateursListQueryOption = (utilisateursParamsDTO: IUtilisateursParams) => {
    return {
        queryKey: utilisateurKeyQuery("list", utilisateursParamsDTO),
        queryFn: async () => {
            return obtenirTousUtilisateursAction(utilisateursParamsDTO);
        },
        keepPreviousData: true,
        placeholderData: (previousData: any) => previousData,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    };
};

//2- Hook pour récupérer les utilisateurs
export const useUtilisateursListQuery = (
    utilisateursParamsDTO: IUtilisateursParams
) => {
    return useQuery(utilisateursListQueryOption(utilisateursParamsDTO));
};

//3- Fonction pour précharger les utilisateurs
export const prefetchUtilisateursListQuery = (
    utilisateursParamsDTO: IUtilisateursParams
) => {
    return queryClient.prefetchQuery(utilisateursListQueryOption(utilisateursParamsDTO));
}