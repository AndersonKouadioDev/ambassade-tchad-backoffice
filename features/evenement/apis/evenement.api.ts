import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { SearchParams } from "ak-api-http";
import { IEvenement, IEvenementRechercheParams, IEvenementStats } from "../types/evenement.type";
export interface IEvenementAPI {
    getAll: (params: IEvenementRechercheParams) => Promise<PaginatedResponse<IEvenement>>;
    getById: (id: string) => Promise<IEvenement>;
    getStats: () => Promise<IEvenementStats>;
    create: (data: FormData) => Promise<IEvenement>;
    update: (id: string, formData: FormData) => Promise<IEvenement>;
    delete: (id: string) => Promise<void>;
}

export const evenementAPI: IEvenementAPI = {
    getAll(params: IEvenementRechercheParams): Promise<PaginatedResponse<IEvenement>> {
        return api.request<PaginatedResponse<IEvenement>>({
            endpoint: `/events`,
            method: "GET",
            searchParams: {
                ...params as unknown as SearchParams,
                include: "author" // Inclure les données de l'auteur
            },
        });
    },

    getById(id: string): Promise<IEvenement> {
        return api.request<IEvenement>({
            endpoint: `/events/${id}`,
            method: "GET",
            searchParams: {
                include: "author" // Inclure les données de l'auteur
            },
        });
    },

    getStats(): Promise<IEvenementStats> {
        return api.request<IEvenementStats>({
            endpoint: `/events/stats`,
            method: "GET",
        });
    },

    create(formData: FormData): Promise<IEvenement> {
        console.log('actualiteAPI.create - FormData reçu:', formData);

        return api.request<IEvenement>({
            endpoint: `/events`,
            method: "POST",
            config: {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            },
            data: formData,
        });

    },

    update(id: string, formData: FormData): Promise<IEvenement> {
        console.log('actualiteAPI.update - Données reçues:', formData);
        console.log('actualiteAPI.update - FormData reçu:', formData);

        return api.request<IEvenement>({
            endpoint: `/events/${id}`,
            method: "PUT",
            config: {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            },
            data: formData,
        })
    },

    delete(id: string): Promise<void> {
        return api.request<void>({
            endpoint: `/events/${id}`,
            method: "DELETE",
        });
    },

};