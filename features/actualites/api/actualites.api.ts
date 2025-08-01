import { IActualite, IActualiteStats, PaginatedResponse } from "@/types";
import {api } from "@/lib/api";
import { IActualiteRechercheParams } from "../types/actualites.type";
import { SearchParams } from "ak-api-http";
export interface IActualiteAPI {
  getAll: (params: IActualiteRechercheParams) => Promise<PaginatedResponse<IActualite>>;
  getById: (id: string) => Promise<IActualite>;
  getStats: () => Promise<IActualiteStats>;
  create: (data: IActualite, formData?: FormData) => Promise<IActualite>;
  update: (id: string, data: IActualite) => Promise<IActualite>;
  delete: (id: string) => Promise<void>;
}

export const actualiteAPI: IActualiteAPI = {
    getAll(params: IActualiteRechercheParams): Promise<PaginatedResponse<IActualite>> {
        return api.request<PaginatedResponse<IActualite>>({
            endpoint: `/actualites`,
            method: "GET",
            searchParams:params as SearchParams,

        });
    },

    getById(id: string): Promise<IActualite> {
        return api.request<IActualite>({
            endpoint: `/actualites/${id}`,
            method: "GET",
        });
    },

    getStats(): Promise<IActualiteStats> {
        return api.request<IActualiteStats>({
            endpoint: `/actualites/stats`,
            method: "GET",
        });
    },

    create(data: IActualite, formData?: FormData): Promise<IActualite> {
        console.log('actualiteAPI.create - Données reçues:', data);
        console.log('actualiteAPI.create - FormData reçu:', formData);
        
        // Si on a FormData, l'utiliser, sinon utiliser les données JSON
        const requestData = formData || data;
        
        return api.request<IActualite>({
            endpoint: `/actualites`,
            method: "POST",
            data: requestData,
        }).then(response => {
            console.log('actualiteAPI.create - Réponse API:', response);
            return response;
        }).catch(error => {
            console.error('actualiteAPI.create - Erreur API:', error);
            console.error('evenementAPI.create - Détails erreur:', {
                message: error.message,
                status: error.status,
                data: error.data,
            });
            throw error;
        });
    },

    update(id: string, data: IActualite): Promise<IActualite> {
        return api.request<IActualite>({
            endpoint: `/actualites/${id}`,
            method: "PUT",
            data,
        });
    },

    delete(id: string): Promise<void> {
        return api.request<void>({
            endpoint: `/actualites/${id}`,
            method: "DELETE",
        });
    },
 
};