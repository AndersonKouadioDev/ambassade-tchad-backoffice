import { PaginatedResponse } from "@/types";
import {api } from "@/lib/api";
import { SearchParams } from "ak-api-http";
import { IVideo, IVideoRechercheParams, IVideoStats } from "../types/video.type";
import { VideoDTO } from "../schemas/video.schema";
export interface IVideoAPI {
  getAll: (params: IVideoRechercheParams) => Promise<PaginatedResponse<IVideo>>;
  getById: (id: string) => Promise<IVideo>;
  getStats: () => Promise<IVideoStats>;
  create: (data: VideoDTO, formData?: FormData) => Promise<IVideo>;
  update: (id: string, data: VideoDTO) => Promise<IVideo>;
  delete: (id: string) => Promise<void>;
}

export const videoAPI: IVideoAPI = {
    getAll(params: IVideoRechercheParams): Promise<PaginatedResponse<IVideo>> {
        return api.request<PaginatedResponse<IVideo>>({
            endpoint: `/videos`,
            method: "GET",
            searchParams:params as SearchParams,
        });
    },

    getById(id: string): Promise<IVideo> {
        return api.request<IVideo>({
            endpoint: `/videos/${id}`,
            method: "GET",
        });
    },

    getStats(): Promise<IVideoStats> {
        return api.request<IVideoStats>({
            endpoint: `/videos/stats`,
            method: "GET",
        });
    },

    create(data: VideoDTO, formData?: FormData): Promise<IVideo> {
        console.log('videoAPI.create - Données reçues:', data);
        console.log('videoAPI.create - FormData reçu:', formData);
        
        // Si on a FormData, l'utiliser, sinon utiliser les données JSON
        const requestData = formData || data;
        
        return api.request<IVideo>({
            endpoint: `/videos`,
            method: "POST",
            data: requestData,
        }).then(response => {
            console.log('videoAPI.create - Réponse API:', response);
            return response;
        }).catch(error => {
            console.error('videoAPI.create - Erreur API:', error);
            console.error('videoAPI.create - Détails erreur:', {
                message: error.message,
                status: error.status,
                data: error.data,
            });
            throw error;
        });
    },

            update(id: string, data: VideoDTO): Promise<IVideo> {
        return api.request<IVideo>({
            endpoint: `/videos/${id}`,
            method: "PUT",
            data,
        });
    },

    delete(id: string): Promise<void> {
        return api.request<void>({
            endpoint: `/videos/${id}`,
            method: "DELETE",
        });
    },
 
};