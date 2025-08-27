import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
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
            searchParams: params,
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

    create(formData: FormData): Promise<IEvenement> {

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

        return api.request<IEvenement>({
            endpoint: `/events/${id}`,
            method: "PATCH",
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