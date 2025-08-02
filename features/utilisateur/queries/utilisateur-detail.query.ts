import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirUnUtilisateurAction } from '../actions/utilisateur.action';
import { utilisateurKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();


//1- Option de requête
export const utilisateurQueryOption = (id: string) => {
    return {
        queryKey: utilisateurKeyQuery("detail", id),
        queryFn: async () => {
            if (!id) throw new Error("L'identifiant utilisateur est requis");
            return obtenirUnUtilisateurAction(id);
        },
        enabled: !!id,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération de l'utilisateur:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer un utilisateur
export const useUtilisateurQuery = (id: string) => {
    return useQuery(utilisateurQueryOption(id));
};

//3- Fonction pour précharger un utilisateur
export const prefetchUtilisateurQuery = (
    id: string
) => {
    return queryClient.prefetchQuery(utilisateurQueryOption(id));
}
