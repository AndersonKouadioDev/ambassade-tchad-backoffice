import {
    useQuery,
} from '@tanstack/react-query';
import { utilisateurAPI } from '../apis/utilisateur.api';
import getQueryClient from '@/lib/get-query-client';

const queryClient = getQueryClient();

// la clé de cache
const utilisateurQueryKey = (id: string) => ['utilisateur', 'detail', id];


// Option de requête
export const utilisateurQueryOption = (id: string) => {
    return {
        queryKey: utilisateurQueryKey(id),
        queryFn: async () => {
            if (!id) throw new Error("L'identifiant utilisateur est requis");
            const data = await utilisateurAPI.getOne(id);
            return data;
        },
        enabled: !!id,
    };
};

// Hook pour récupérer un utilisateur
export const useUtilisateur = (id: string) => {
    return useQuery(utilisateurQueryOption(id));
};

// Hook pour précharger un utilisateur
export const prefetchUtilisateur = (
    id: string
) => {
    return queryClient.prefetchQuery(utilisateurQueryOption(id));
}

// Fonction pour invalider le cache
export const invalidateUtilisateur = (id: string) => {
    return queryClient.invalidateQueries({
        queryKey: utilisateurQueryKey(id),
    });
}