import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { getDemandByTicketAction, getDemandByTicketAdminAction, trackDemandByTicketAction } from '../actions/demande.action';
import { demandeKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête pour suivre une demande par ticket
export const trackDemandeByTicketQueryOption = (ticket: string) => {
    return {
        queryKey: demandeKeyQuery("track", ticket),
        queryFn: async () => {
            if (!ticket) throw new Error("Le numéro de ticket est requis");
            return trackDemandByTicketAction(ticket);
        },
        enabled: !!ticket,
        onError: (error: Error) => {
            toast.error("Erreur lors du suivi de la demande:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour suivre une demande par ticket
export const useTrackDemandeByTicketQuery = (ticket: string) => {
    return useQuery(trackDemandeByTicketQueryOption(ticket));
};

//3- Fonction pour précharger une demande par ticket
export const prefetchTrackDemandeByTicketQuery = (
    ticket: string
) => {
    return queryClient.prefetchQuery(trackDemandeByTicketQueryOption(ticket));
};

// ==============================================================

//1- Option de requête pour obtenir une demande par ticket (Admin)
export const getDemandeByTicketAdminQueryOption = (ticket: string) => {
    return {
        queryKey: demandeKeyQuery("detail-admin", ticket),
        queryFn: async () => {
            if (!ticket) throw new Error("Le numéro de ticket est requis");
            return getDemandByTicketAdminAction(ticket);
        },
        enabled: !!ticket,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération de la demande (Admin):", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour obtenir une demande par ticket (Admin)
export const useGetDemandeByTicketAdminQuery = (ticket: string) => {
    return useQuery(getDemandeByTicketAdminQueryOption(ticket));
};

//3- Fonction pour précharger une demande par ticket (Admin)
export const prefetchGetDemandeByTicketAdminQuery = (
    ticket: string
) => {
    return queryClient.prefetchQuery(getDemandeByTicketAdminQueryOption(ticket));
};

// ==============================================================

//1- Option de requête pour obtenir une demande par ticket
export const getDemandeByTicketQueryOption = (ticket: string) => {
    return {
        queryKey: demandeKeyQuery("detail", ticket),
        queryFn: async () => {
            if (!ticket) throw new Error("Le numéro de ticket est requis");
            return getDemandByTicketAction(ticket);
        },
        enabled: !!ticket,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération de la demande:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour obtenir une demande par ticket
export const useGetDemandeByTicketQuery = (ticket: string) => {
    return useQuery(getDemandeByTicketQueryOption(ticket));
};

//3- Fonction pour précharger une demande par ticket
export const prefetchGetDemandeByTicketQuery = (
    ticket: string
) => {
    return queryClient.prefetchQuery(getDemandeByTicketQueryOption(ticket));
};