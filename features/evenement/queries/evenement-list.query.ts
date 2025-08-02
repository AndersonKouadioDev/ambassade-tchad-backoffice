import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IEvenementRechercheParams } from "../types/evenement.type";
import {getEvenementTousAction } from "../actions/evenement.action";
import { evenementKeyQuery } from "./index.query";



const queryClient = getQueryClient();


// Option de requête
export const evenementListQueryOption = (evenementSearchParams: IEvenementRechercheParams) => {
    return {
           queryKey: evenementKeyQuery('list',evenementSearchParams),
           queryFn: async () => {
               const data = await getEvenementTousAction(evenementSearchParams);
               return data;
           }
           ,
           keepPreviousData: true,
           staleTime: 5 * 60 * 1000,
           enable: true,
       };
}

// Hook pour récupérer les événements
export const useEvenementsList = (evenementSearchParams: IEvenementRechercheParams) => {
    return useQuery(evenementListQueryOption(evenementSearchParams));
};

// Hook pour précharger les événements
export const prefetchEvenementsList = (evenementSearchParams: IEvenementRechercheParams) => {
    return queryClient.prefetchQuery(evenementListQueryOption(evenementSearchParams));
}

