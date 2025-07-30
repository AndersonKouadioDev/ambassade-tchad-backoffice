import { PaginatedResponse } from "@/types";
import {api } from "@/lib/api";
import { PhotoDTO } from "../schemas/photo.schema";
import { SearchParams } from "ak-api-http";
import { IPhoto, IPhotoRechercheParams, IPhotoStats } from "../types/photo.type";
export interface IPhotoAPI {
  getAll: (params: IPhotoRechercheParams) => Promise<PaginatedResponse<IPhoto>>;
  getById: (id: string) => Promise<IPhoto>;
  getStats: () => Promise<IPhotoStats>;
  create: (data: PhotoDTO, formData?: FormData) => Promise<IPhoto>;
  update: (id: string, data: PhotoDTO) => Promise<IPhoto>;
  delete: (id: string) => Promise<void>;
}

export const photoAPI: IPhotoAPI = {
    getAll(params: IPhotoRechercheParams): Promise<PaginatedResponse<IPhoto>> {
        return api.request<PaginatedResponse<IPhoto>>({
            endpoint: `/photos`,
            method: "GET",
            searchParams:params as SearchParams,
        });
    },

    getById(id: string): Promise<IPhoto> {
        return api.request<IPhoto>({
            endpoint: `/photos/${id}`,
            method: "GET",
        });
    },

    getStats(): Promise<IPhotoStats> {
        return api.request<IPhotoStats>({
            endpoint: `/photos/stats`,
            method: "GET",
        });
    },

    create(data: PhotoDTO, formData?: FormData): Promise<IPhoto> {
        console.log('photoAPI.create - Données reçues:', data);
        console.log('photoAPI.create - FormData reçu:', formData);
        
        // Si on a FormData, l'utiliser, sinon utiliser les données JSON
        const requestData = formData || data;
        
        return api.request<IPhoto>({
            endpoint: `/photos`,
            method: "POST",
            data: requestData,
        }).then(response => {
            console.log('photoAPI.create - Réponse API:', response);
            return response;
        }).catch(error => {
            console.error('photoAPI.create - Erreur API:', error);
            console.error('photoAPI.create - Détails erreur:', {
                message: error.message,
                status: error.status,
                data: error.data,
            });
            throw error;
        });
    },

    update(id: string, data: PhotoDTO): Promise<IPhoto> {
        return api.request<IPhoto>({
            endpoint: `/photos/${id}`,
            method: "PUT",
            data,
        });
    },

    delete(id: string): Promise<void> {
        return api.request<void>({
            endpoint: `/photos/${id}`,
            method: "DELETE",
        });
    },
 
};