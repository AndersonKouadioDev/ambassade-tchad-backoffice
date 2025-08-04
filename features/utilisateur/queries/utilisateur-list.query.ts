import React from 'react';

import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirTousUtilisateursAction } from '../actions/utilisateur.action';
import { IUtilisateursParams } from '../types/utilisateur.type';
import { utilisateurKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête optimisée
export const utilisateursListQueryOption = (utilisateursParamsDTO: IUtilisateursParams) => {
    return {
        queryKey: utilisateurKeyQuery("list", utilisateursParamsDTO),
        queryFn: async () => {
            const result = await obtenirTousUtilisateursAction(utilisateursParamsDTO);
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des utilisateurs");
            }
            return result.data!;
        },
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
    const query = useQuery(utilisateursListQueryOption(utilisateursParamsDTO));

    // Gestion des erreurs dans le hook
    React.useEffect(() => {
        if (query.isError && query.error) {
            toast.error("Erreur lors de la récupération des utilisateurs:", {
                description: query.error instanceof Error ? query.error.message : "Erreur inconnue",
            });
        }
    }, [query]);

    return query;
};

//3- Fonction pour précharger les utilisateurs
export const prefetchUtilisateursListQuery = (
    utilisateursParamsDTO: IUtilisateursParams
) => {
    return queryClient.prefetchQuery(utilisateursListQueryOption(utilisateursParamsDTO));
}