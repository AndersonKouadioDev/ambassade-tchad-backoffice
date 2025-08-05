import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { IActualiteRechercheParams, IActualite, IActualiteStatsResponse } from "../types/actualites.type";
import { SearchParams } from "ak-api-http";

export interface IActualiteAPI {
    getAll: (params: IActualiteRechercheParams) => Promise<PaginatedResponse<IActualite>>;
    getById: (id: string) => Promise<IActualite>;
    getStats: () => Promise<IActualiteStatsResponse>;
    create: (data: FormData) => Promise<IActualite>;
    update: (id: string, formData: FormData) => Promise<IActualite>;
    delete: (id: string) => Promise<void>;
}

export const actualiteAPI: IActualiteAPI = {
    getAll(params: IActualiteRechercheParams): Promise<PaginatedResponse<IActualite>> {
        return api.request<PaginatedResponse<IActualite>>({
            endpoint: `/news`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },

    getById(id: string): Promise<IActualite> {
        return api.request<IActualite>({
            endpoint: `/news/${id}`,
            method: "GET",
        });
    },

    getStats(): Promise<IActualiteStatsResponse> {
        return api.request<IActualiteStatsResponse>({
            endpoint: `/news/stats`,
            method: "GET",
        });
    },

    create(formData: FormData): Promise<IActualite> {

        return api.request<IActualite>({
            endpoint: `/news`,
            method: "POST",
            config: {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            },
            data: formData,
        });

    },

    update(id: string, formData: FormData): Promise<IActualite> {
        return api.request<IActualite>({
            endpoint: `/news/${id}`,
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
            endpoint: `/news/${id}`,
            method: "DELETE",
        });
    },

};