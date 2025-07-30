import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirTousUtilisateursAction } from '../actions/utilisateur.action';
import { UtilisateursParamsDTO } from '../schema/utilisateur-params.schema';

const queryClient = getQueryClient();

//1- Clé de cache
export const utilisateurQueryKey = (utilisateursParamsDTO: UtilisateursParamsDTO) => ['utilisateur', 'list', utilisateursParamsDTO] as const;

//2- Option de requête optimisée
export const utilisateursListQueryOption = (utilisateursParamsDTO: UtilisateursParamsDTO) => {
    return {
        queryKey: utilisateurQueryKey(utilisateursParamsDTO),
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

//3- Hook pour récupérer les utilisateurs
export const useUtilisateursListQuery = (
    utilisateursParamsDTO: UtilisateursParamsDTO
) => {
    return useQuery(utilisateursListQueryOption(utilisateursParamsDTO));
};

//4- Fonction pour précharger les utilisateurs
export const prefetchUtilisateursListQuery = (
    utilisateursParamsDTO: UtilisateursParamsDTO
) => {
    return queryClient.prefetchQuery(utilisateursListQueryOption(utilisateursParamsDTO));
}

//5- Fonction pour invalider le cache
export const invalidateUtilisateursListQuery = (utilisateursParamsDTO?: Partial<UtilisateursParamsDTO>) => {
    return queryClient.invalidateQueries({
        queryKey: utilisateursParamsDTO ?
            utilisateurQueryKey(utilisateursParamsDTO as UtilisateursParamsDTO) :
            ['utilisateur', 'list'], // Invalide toutes les requêtes de liste
    });
}