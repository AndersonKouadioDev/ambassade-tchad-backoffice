import React from 'react';

import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirStatsUtilisateursAction } from '../actions/utilisateur.action';
import { utilisateurKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête
export const utilisateurStatsQueryOption = ({ type }: { type: "personnel" | "demandeur" }) => {
    return {
        queryKey: utilisateurKeyQuery("stats", type),
        queryFn: async () => {
            const result = await obtenirStatsUtilisateursAction(type);
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des stats utilisateurs");
            }
            return result.data!;
        },

        placeholderData: (previousData: any) => previousData,
        staleTime: 5 * 60 * 1000,//5 minutes
    };
};

//2- Hook pour récupérer les stats utilisateurs
export const useUtilisateurStatsQuery = ({ type }: { type: "personnel" | "demandeur" }) => {
    const query = useQuery(utilisateurStatsQueryOption({ type }));

    // Gestion des erreurs dans le hook
    React.useEffect(() => {
        if (query.isError && query.error) {
            toast.error("Erreur lors de la récupération des stats utilisateurs:", {
                description: query.error instanceof Error ? query.error.message : "Erreur inconnue",
            });
        }
    }, [query]);

    return query;
};

//3- Fonction pour précharger les stats utilisateurs
export const prefetchUtilisateurStatsQuery = ({ type }: { type: "personnel" | "demandeur" }) => {
    return queryClient.prefetchQuery(utilisateurStatsQueryOption({ type }));
}