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
            return await obtenirStatsUtilisateursAction(type);
        },

        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération des stats utilisateurs:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer les stats utilisateurs
export const useUtilisateurStatsQuery = ({ type }: { type: "personnel" | "demandeur" }) => {
    return useQuery(utilisateurStatsQueryOption({ type }));
};

//3- Fonction pour précharger les stats utilisateurs
export const prefetchUtilisateurStatsQuery = ({ type }: { type: "personnel" | "demandeur" }) => {
    return queryClient.prefetchQuery(utilisateurStatsQueryOption({ type }));
}