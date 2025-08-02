import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { SearchParams } from "ak-api-http";
import {
    IDemande,
    IDemandeStatsResponse,
    IDemandeRechercheParams,
} from "../types/demande.type";
import { IService } from "@/features/service/types/service.type";
import { DemandUpdateDTO } from "../schema/demande.schema";
export interface IDemandRequestAPI {
    createDemandRequest(data: FormData): Promise<IDemande>;
    createDemandAdminRequest(userId: string, data: FormData): Promise<IDemande>;
    getAllFilteredDemandRequests(params: IDemandeRechercheParams): Promise<PaginatedResponse<IDemande>>;
    getGlobalStats(): Promise<IDemandeStatsResponse>;
    getMyRequests(params: Omit<IDemandeRechercheParams, 'userId'>): Promise<PaginatedResponse<IDemande>>;
    getUserStats(): Promise<IDemandeStatsResponse>;
    trackDemandByTicket(ticket: string): Promise<IDemande>;
    getDemandByTicketAdmin(ticket: string): Promise<IDemande>;
    getDemandByTicket(ticket: string): Promise<IDemande>;
    getServicesPrices(): Promise<IService[]>;
    updateDemandStatus(id: string, data: DemandUpdateDTO): Promise<IDemande>;
}

export const demandeAPI: IDemandRequestAPI = {
    async createDemandRequest(data: FormData): Promise<IDemande> {

        return api.request<IDemande>({
            endpoint: `/demandes`,
            method: "POST",
            data,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        });
    },

    createDemandAdminRequest(userId: string, data: FormData): Promise<IDemande> {
        return api.request<IDemande>({
            endpoint: `/demandes/admin/${userId}`,
            method: "POST",
            data,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        });
    },

    getAllFilteredDemandRequests(params: IDemandeRechercheParams): Promise<PaginatedResponse<IDemande>> {
        return api.request<PaginatedResponse<IDemande>>({
            endpoint: `/demandes`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },

    getGlobalStats(): Promise<IDemandeStatsResponse> {
        return api.request<IDemandeStatsResponse>({
            endpoint: `/demandes/stats`,
            method: "GET",
        });
    },

    getMyRequests(params: Omit<IDemandeRechercheParams, 'userId'>): Promise<PaginatedResponse<IDemande>> {
        return api.request<PaginatedResponse<IDemande>>({
            endpoint: `/demandes/me`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },

    getUserStats(): Promise<IDemandeStatsResponse> {
        return api.request<IDemandeStatsResponse>({
            endpoint: `/demandes/stats/demandeur`,
            method: "GET",
        });
    },

    trackDemandByTicket(ticket: string): Promise<IDemande> {
        return api.request<IDemande>({
            endpoint: `/demandes/track/${ticket}`,
            method: "GET",
        });
    },

    getDemandByTicketAdmin(ticket: string): Promise<IDemande> {
        return api.request<IDemande>({
            endpoint: `/demandes/admin/${ticket}`,
            method: "GET",
        });
    },

    getDemandByTicket(ticket: string): Promise<IDemande> {
        return api.request<IDemande>({
            endpoint: `/demandes/demande/${ticket}`,
            method: "GET",
        });
    },

    getServicesPrices(): Promise<IService[]> {
        return api.request<IService[]>({
            endpoint: `/demandes/services`,
            method: "GET",
        });
    },

    updateDemandStatus(id: string, data: DemandUpdateDTO): Promise<IDemande> {
        return api.request<IDemande>({
            endpoint: `/demandes/${id}/status`,
            method: "PATCH",
            data,
        });
    },
};