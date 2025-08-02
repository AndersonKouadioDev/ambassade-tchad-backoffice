"use server";


import { demandeAPI } from "../apis/demande.api";
import { DemandUpdateDTO } from "../schema/demande.schema";
import { IDemandeRechercheParams } from "../types/demande.type";

export const createDemandRequestAction = async (data: FormData) => {
    return await demandeAPI.createDemandRequest(data);
}

export const createDemandAdminRequestAction = async (userId: string, data: FormData) => {
    return await demandeAPI.createDemandAdminRequest(userId, data);
}

export const getAllFilteredDemandRequestsAction = (params: IDemandeRechercheParams) => {
    return demandeAPI.getAllFilteredDemandRequests(params);
}

export const getGlobalStatsAction = () => {
    return demandeAPI.getGlobalStats();
}

export const getMyRequestsAction = (params: Omit<IDemandeRechercheParams, 'userId'>) => {
    return demandeAPI.getMyRequests(params);
}

export const getUserStatsAction = () => {
    return demandeAPI.getUserStats();
}

export const trackDemandByTicketAction = (ticket: string) => {
    return demandeAPI.trackDemandByTicket(ticket);
}

export const getDemandByTicketAdminAction = (ticket: string) => {
    return demandeAPI.getDemandByTicketAdmin(ticket);
}

export const getDemandByTicketAction = (ticket: string) => {
    return demandeAPI.getDemandByTicket(ticket);
}

export const getServicesPricesAction = () => {
    return demandeAPI.getServicesPrices();
}

export const updateDemandStatusAction = async (id: string, data: DemandUpdateDTO) => {
    return await demandeAPI.updateDemandStatus(id, data);
}