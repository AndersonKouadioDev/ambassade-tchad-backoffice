import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirUnUtilisateur } from '../actions/utilisateur.action';

const queryClient = getQueryClient();

//1- la clé de cache
const utilisateurQueryKey = (id: string) => ['utilisateur', 'detail', id];


//2- Option de requête
export const utilisateurQueryOption = (id: string) => {
    return {
        queryKey: utilisateurQueryKey(id),
        queryFn: async () => {
            return obtenirUnUtilisateur(id);
        },
        enabled: !!id,
    };
};

//3- Hook pour récupérer un utilisateur
export const useUtilisateurQuery = (id: string) => {
    return useQuery(utilisateurQueryOption(id));
};

//4- Fonction pour précharger un utilisateur
export const prefetchUtilisateurQuery = (
    id: string
) => {
    return queryClient.prefetchQuery(utilisateurQueryOption(id));
}

//5- Fonction pour invalider le cache
export const invalidateUtilisateurQuery = (id: string) => {
    return queryClient.invalidateQueries({
        queryKey: utilisateurQueryKey(id),
    });
}