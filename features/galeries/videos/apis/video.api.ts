import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { SearchParams } from "ak-api-http";
import { IVideo, IVideoRechercheParams, IVideoStats } from "../types/video.type";
import { VideoDTO } from "../schemas/video.schema";
export interface IVideoAPI {
    getAll: (params: IVideoRechercheParams) => Promise<PaginatedResponse<IVideo>>;
    getById: (id: string) => Promise<IVideo>;
    getStats: () => Promise<IVideoStats>;
    create: (data: VideoDTO) => Promise<IVideo>;
    update: (id: string, data: VideoDTO) => Promise<IVideo>;
    delete: (id: string) => Promise<void>;
}

export const videoAPI: IVideoAPI = {
    getAll(params: IVideoRechercheParams): Promise<PaginatedResponse<IVideo>> {
        return api.request<PaginatedResponse<IVideo>>({
            endpoint: `/videos`,
            method: "GET",
            searchParams: {
                ...params as unknown as SearchParams,
            },
        });
    },

    getById(id: string): Promise<IVideo> {
        return api.request<IVideo>({
            endpoint: `/videos/${id}`,
            method: "GET",
            config: {
                headers: {
                    "Content-Type": "application/json"
                }
            },  
            
        });
    },

    getStats(): Promise<IVideoStats> {
        return api.request<IVideoStats>({
            endpoint: `/videos/stats`,
            method: "GET",
        });
    },

    create(data: VideoDTO): Promise<IVideo> {

        return api.request<IVideo>({
            endpoint: `/videos`,
            method: "POST",
            config: {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            },
            data: data,
        });

    },

    update(id: string, data: VideoDTO): Promise<IVideo> {

        return api.request<IVideo>({
            endpoint: `/videos/${id}`,
            method: "PUT",
            config: {
                headers: {
                    "Content-Type": "application/json"
                }
            },
            data: data,
        })
    },

    delete(id: string): Promise<void> {
        return api.request<void>({
            endpoint: `/videos/${id}`,
            method: "DELETE",
        });
    },

};