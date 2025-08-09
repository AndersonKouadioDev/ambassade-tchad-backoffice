import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { getDemandByTicketAction, getDemandByTicketAdminAction, trackDemandByTicketAction } from '../actions/demande.action';
import { demandeKeyQuery } from './index.query';
import { toast } from 'sonner';
import React from 'react';

const queryClient = getQueryClient();

//1- Option de requête pour suivre une demande par ticket
export const trackDemandeByTicketQueryOption = (ticket: string) => {
    return {
        queryKey: demandeKeyQuery("track", ticket),
        queryFn: async () => {
            if (!ticket) throw new Error("Le numéro de ticket est requis");
            const result = await trackDemandByTicketAction(ticket);

            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data!;
        },
        enabled: !!ticket,
    };
};

//2- Hook pour suivre une demande par ticket
export const useTrackDemandeByTicketQuery = (ticket: string) => {
    const query = useQuery(trackDemandeByTicketQueryOption(ticket));

    React.useEffect(() => {
        if (query.error, query.isError) {
            toast.error("Erreur:", {
                description: query.error?.message,
            });
        }
    }, [query.error, query.isError]);
    return query;
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
            const result = await getDemandByTicketAdminAction(ticket);

            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data!;
        },
        enabled: !!ticket,
    };
};

//2- Hook pour obtenir une demande par ticket (Admin)
export const useGetDemandeByTicketAdminQuery = (ticket: string) => {
    const query = useQuery(getDemandeByTicketAdminQueryOption(ticket));

    React.useEffect(() => {
        if (query.error, query.isError) {
            toast.error("Erreur:", {
                description: query.error?.message,
            });
        }
    }, [query.error, query.isError]);
    return query;
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
            const result = await getDemandByTicketAction(ticket);

            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data!;
        },
        enabled: !!ticket,
    };
};

//2- Hook pour obtenir une demande par ticket
export const useGetDemandeByTicketQuery = (ticket: string) => {
    const query = useQuery(getDemandeByTicketQueryOption(ticket));

    React.useEffect(() => {
        if (query.error, query.isError) {
            toast.error("Erreur:", {
                description: query.error?.message,
            });
        }
    }, [query.error, query.isError]);
    return query;
};

//3- Fonction pour précharger une demande par ticket
export const prefetchGetDemandeByTicketQuery = (
    ticket: string
) => {
    return queryClient.prefetchQuery(getDemandeByTicketQueryOption(ticket));
};