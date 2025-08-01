import { IEvenement, IEvenementStats, PaginatedResponse } from "@/types";
import {api } from "@/lib/api";
import { EvenementDTO } from "../schemas/evenement.schema";
import { IEvenementRechercheParams } from "../types/evenement.type";
import { SearchParams } from "ak-api-http";
export interface IEvenementAPI {
  getAll: (params: IEvenementRechercheParams) => Promise<PaginatedResponse<IEvenement>>;
  getById: (id: string) => Promise<IEvenement>;
  getStats: () => Promise<IEvenementStats>;
  create: (data: EvenementDTO, formData?: FormData) => Promise<IEvenement>;
  update: (id: string, data: EvenementDTO) => Promise<IEvenement>;
  delete: (id: string) => Promise<void>;
}

export const evenementAPI: IEvenementAPI = {
    getAll(params: IEvenementRechercheParams): Promise<PaginatedResponse<IEvenement>> {
        return api.request<PaginatedResponse<IEvenement>>({
            endpoint: `/events`,
            method: "GET",
            searchParams:params as SearchParams,
        });
    },

    getById(id: string): Promise<IEvenement> {
        return api.request<IEvenement>({
            endpoint: `/events/${id}`,
            method: "GET",
        });
    },

    getStats(): Promise<IEvenementStats> {
        return api.request<IEvenementStats>({
            endpoint: `/events/stats`,
            method: "GET",
        });
    },

    create(data: EvenementDTO, formData?: FormData): Promise<IEvenement> {
        console.log('evenementAPI.create - Données reçues:', data);
        console.log('evenementAPI.create - FormData reçu:', formData);
        
        // Si on a FormData, l'utiliser, sinon utiliser les données JSON
        const requestData = formData || data;
        
        return api.request<IEvenement>({
            endpoint: `/events`,
            method: "POST",
            data: requestData,
        }).then(response => {
            console.log('evenementAPI.create - Réponse API:', response);
            return response;
        }).catch(error => {
            console.error('evenementAPI.create - Erreur API:', error);
            console.error('evenementAPI.create - Détails erreur:', {
                message: error.message,
                status: error.status,
                data: error.data,
            });
            throw error;
        });
    },

    update(id: string, data: EvenementDTO): Promise<IEvenement> {
        return api.request<IEvenement>({
            endpoint: `/events/${id}`,
            method: "PUT",
            data,
        });
    },

    delete(id: string): Promise<void> {
        return api.request<void>({
            endpoint: `/events/${id}`,
            method: "DELETE",
        });
    },
 
};