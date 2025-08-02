import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { getServicesPricesAction } from '../actions/demande.action';
import { demandeKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête pour les prix des services
export const servicesPricesQueryOption = () => {
    return {
        queryKey: demandeKeyQuery("services-prices"),
        queryFn: async () => {
            return await getServicesPricesAction();
        },
        staleTime: Infinity,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération des prix des services:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer les prix des services
export const useServicesPricesQuery = () => {
    return useQuery(servicesPricesQueryOption());
};

//3- Fonction pour précharger les prix des services
export const prefetchServicesPricesQuery = () => {
    return queryClient.prefetchQuery(servicesPricesQueryOption());
};