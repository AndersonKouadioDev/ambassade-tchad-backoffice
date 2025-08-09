import React from 'react';
import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { getGlobalStatsAction, getUserStatsAction } from '../actions/demande.action'; // Import relevant actions
import { demandeKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête pour les statistiques globales des demandes
export const globalDemandeStatsQueryOption = () => {
    return {
        queryKey: demandeKeyQuery("global-stats"),
        queryFn: async () => {
            const result = await getGlobalStatsAction();
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data!;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
};

//2- Hook pour récupérer les statistiques globales des demandes
export const useGlobalDemandeStatsQuery = () => {
    const query = useQuery(globalDemandeStatsQueryOption());

    React.useEffect(() => {
        if (query.error, query.isError) {
            toast.error("Erreur:", {
                description: query.error?.message,
            });
        }
    }, [query.error, query.isError]);
    return query;
};

//3- Fonction pour précharger les statistiques globales des demandes
export const prefetchGlobalDemandeStatsQuery = () => {
    return queryClient.prefetchQuery(globalDemandeStatsQueryOption());
};

// ============================================================== 

//1- Option de requête pour les statistiques des demandes de l'utilisateur
export const userDemandeStatsQueryOption = () => {
    return {
        queryKey: demandeKeyQuery("user-stats"),
        queryFn: async () => {
            const result = await getUserStatsAction();
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data!;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
};

//2- Hook pour récupérer les statistiques des demandes de l'utilisateur
export const useUserDemandeStatsQuery = () => {
    const query = useQuery(userDemandeStatsQueryOption());

    React.useEffect(() => {
        if (query.error, query.isError) {
            toast.error("Erreur:", {
                description: query.error?.message,
            });
        }
    }, [query.error, query.isError]);
    return query;
};

//3- Fonction pour précharger les statistiques des demandes de l'utilisateur
export const prefetchUserDemandeStatsQuery = () => {
    return queryClient.prefetchQuery(userDemandeStatsQueryOption());
};