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
            return await getGlobalStatsAction();
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération des statistiques globales des demandes:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer les statistiques globales des demandes
export const useGlobalDemandeStatsQuery = () => {
    return useQuery(globalDemandeStatsQueryOption());
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
            return await getUserStatsAction();
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération des statistiques des demandes de l'utilisateur:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer les statistiques des demandes de l'utilisateur
export const useUserDemandeStatsQuery = () => {
    return useQuery(userDemandeStatsQueryOption());
};

//3- Fonction pour précharger les statistiques des demandes de l'utilisateur
export const prefetchUserDemandeStatsQuery = () => {
    return queryClient.prefetchQuery(userDemandeStatsQueryOption());
};