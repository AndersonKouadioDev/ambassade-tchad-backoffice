"use server";


import { handleServerActionError } from "@/utils/handleServerActionError";
import { demandeAPI } from "../apis/demande.api";
import { DemandUpdateDTO } from "../schema/demande.schema";
import { IDemande, IDemandeRechercheParams, IDemandeStatsResponse } from "../types/demande.type";
import { ActionResponse, PaginatedResponse } from "@/types";
import { IService } from "@/features/service/types/service.type";

export const createDemandRequestAction = async (data: FormData): Promise<ActionResponse<IDemande>> => {
    try {
        const result = await demandeAPI.createDemandRequest(data);
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la création de la demande.");
    }
}

export const createDemandAdminRequestAction = async (userId: string, data: FormData): Promise<ActionResponse<IDemande>> => {
    try {
        const result = await demandeAPI.createDemandAdminRequest(userId, data);
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la création de la demande.");
    }
}

export const getAllFilteredDemandRequestsAction = async (params: IDemandeRechercheParams): Promise<ActionResponse<PaginatedResponse<IDemande>>> => {
    try {
        const result = await demandeAPI.getAllFilteredDemandRequests(params);
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des demandes.");
    }
}

export const getGlobalStatsAction = async (): Promise<ActionResponse<IDemandeStatsResponse>> => {
    try {
        const result = await demandeAPI.getGlobalStats();
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des statistiques globales.");
    }
}

export const getMyRequestsAction = async (params: Omit<IDemandeRechercheParams, 'userId'>): Promise<ActionResponse<PaginatedResponse<IDemande>>> => {
    try {
        const result = await demandeAPI.getMyRequests(params);
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des demandes.");
    }
}

export const getUserStatsAction = async (): Promise<ActionResponse<IDemandeStatsResponse>> => {
    try {
        const result = await demandeAPI.getUserStats();
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des statistiques des demandes de l'utilisateur.");
    }
}

export const trackDemandByTicketAction = async (ticket: string): Promise<ActionResponse<IDemande>> => {
    try {
        const result = await demandeAPI.trackDemandByTicket(ticket);
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la suivi de la demande.");
    }
}

export const getDemandByTicketAdminAction = async (ticket: string): Promise<ActionResponse<IDemande>> => {
    try {
        const result = await demandeAPI.getDemandByTicketAdmin(ticket);
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la demande.");
    }
}

export const getDemandByTicketAction = async (ticket: string): Promise<ActionResponse<IDemande>> => {
    try {
        const result = await demandeAPI.getDemandByTicket(ticket);
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la demande.");
    }
}

export const getServicesPricesAction = async (): Promise<ActionResponse<IService[]>> => {
    try {
        const result = await demandeAPI.getServicesPrices();
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des prix des services.");
    }
}

export const updateDemandStatusAction = async (id: string, data: DemandUpdateDTO): Promise<ActionResponse<IDemande>> => {
    try {
        const result = await demandeAPI.updateDemandStatus(id, data);
        return { success: true, data: result };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la mise à jour du statut de la demande.");
    }
}