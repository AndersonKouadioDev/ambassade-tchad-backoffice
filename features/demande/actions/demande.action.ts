"use server";

import { demandeAPI } from "../apis/demande.api";
import { IDemandeRechercheParams } from "../types/demande.type";
import { ActionResponse } from "@/types/index";
import { IDemande } from "../types/demande.type";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { IDemandeStatsResponse } from "../types/demande.type";
import { PaginatedResponse } from "@/types/index";
import { IService } from "@/features/service/types/service.type";
import { DemandUpdateDTO } from "../schema/demande.schema";

export const createDemandRequestAction = async (data: FormData): Promise<ActionResponse<IDemande>> => {
    try {
        const createdDemande = await demandeAPI.createDemandRequest(data);
        return {
            success: true,
            data: createdDemande,
            message: "Demande créée avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la creation de la demande");
    }
}

export const createDemandAdminRequestAction = async (userId: string, data: FormData) => {
    try {
        const createdDemande = await demandeAPI.createDemandAdminRequest(userId, data);
        return {
            success: true,
            data: createdDemande,
            message: "Demande créée avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la creation de la demande");
    }
}

export const getAllFilteredDemandRequestsAction = async (params: IDemandeRechercheParams): Promise<ActionResponse<PaginatedResponse<IDemande>>> => {
    try {
        const data = await demandeAPI.getAllFilteredDemandRequests(params);
        return {
            success: true,
            data: data,
            message: "Demandes obtenues avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des demandes");
    }
}

export const getGlobalStatsAction = async (): Promise<ActionResponse<IDemandeStatsResponse>> => {
    try {
        const data = await demandeAPI.getGlobalStats();
        return {
            success: true,
            data: data,
            message: "Stats globales obtenues avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des stats globales");
    }
}

export const getMyRequestsAction = async (params: Omit<IDemandeRechercheParams, 'userId'>): Promise<ActionResponse<PaginatedResponse<IDemande>>> => {
    try {
        const data = await demandeAPI.getMyRequests(params);
        return {
            success: true,
            data: data,
            message: "Demandes obtenues avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des demandes");
    }
}

export const getUserStatsAction = async (): Promise<ActionResponse<IDemandeStatsResponse>> => {
    try {
        const data = await demandeAPI.getUserStats();
        return {
            success: true,
            data: data,
            message: "Stats utilisateur obtenues avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des stats utilisateur");
    }
}

export const trackDemandByTicketAction = async (ticket: string): Promise<ActionResponse<IDemande>> => {
    try {
        const data = await demandeAPI.trackDemandByTicket(ticket);
        return {
            success: true,
            data: data,
            message: "Demande suivie avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors du suivi de la demande");
    }
}

export const getDemandByTicketAdminAction = async (ticket: string): Promise<ActionResponse<IDemande>> => {
    try {
        const data = await demandeAPI.getDemandByTicketAdmin(ticket);
        return {
            success: true,
            data: data,
            message: "Demande obtenue avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la demande (Admin)");
    }
}

export const getDemandByTicketAction = async (ticket: string): Promise<ActionResponse<IDemande>> => {
    try {
        const data = await demandeAPI.getDemandByTicket(ticket);
        return {
            success: true,
            data: data,
            message: "Demande obtenue avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la demande");
    }
}

export const getServicesPricesAction = async (): Promise<ActionResponse<IService[]>> => {
    try {
        const data = await demandeAPI.getServicesPrices();
        return {
            success: true,
            data: data,
            message: "Prix des services obtenus avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des prix des services");
    }
}

export const updateDemandStatusAction = async (id: string, data: DemandUpdateDTO): Promise<ActionResponse<IDemande>> => {
    try {
        const result = await demandeAPI.updateDemandStatus(id, data);
        return {
            success: true,
            data: result,
            message: "Statut de la demande mis à jour avec succès",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la mise à jour du statut de la demande");
    }
}