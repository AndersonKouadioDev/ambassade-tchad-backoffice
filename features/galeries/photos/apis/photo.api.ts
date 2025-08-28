import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { IPhoto, IPhotoRechercheParams, IPhotoStats } from "../types/photo.type";
export interface IPhotoAPI {
    getAll: (params: IPhotoRechercheParams) => Promise<PaginatedResponse<IPhoto>>;
    getById: (id: string) => Promise<IPhoto>;
    getStats: () => Promise<IPhotoStats>;
    create: (data: FormData) => Promise<IPhoto>;
    update: (id: string, formData: FormData) => Promise<IPhoto>;
    delete: (id: string) => Promise<void>;
}

export const photoAPI: IPhotoAPI = {
    getAll(params: IPhotoRechercheParams): Promise<PaginatedResponse<IPhoto>> {
        return api.request<PaginatedResponse<IPhoto>>({
            endpoint: `/photos`,
            method: "GET",
            searchParams: params,
            service: "public"
        });
    },

    getById(id: string): Promise<IPhoto> {
        return api.request<IPhoto>({
            endpoint: `/photos/${id}`,
            method: "GET",
            service: "public"
        });
    },

    getStats(): Promise<IPhotoStats> {
        return api.request<IPhotoStats>({
            endpoint: `/photos/stats`,
            method: "GET",
        });
    },

    create(formData: FormData): Promise<IPhoto> {

        return api.request<IPhoto>({
            endpoint: `/photos`,
            method: "POST",
            config: {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            },
            data: formData,
        });

    },

    update(id: string, formData: FormData): Promise<IPhoto> {

        return api.request<IPhoto>({
            endpoint: `/photos/${id}`,
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
            endpoint: `/photos/${id}`,
            method: "DELETE",
        });
    },

};