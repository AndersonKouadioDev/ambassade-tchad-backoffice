import { api } from "@/lib/api";
import { IDemande } from "../types/demande.type";
import { IDemandeStatsResponse, IDemandeAddUpdateResponse, IDemandeActiveDesactiveDeleteResponse } from "../types/demande.type";
import { PaginatedResponse } from "@/types";
import { SearchParams } from "ak-api-http";
import { DemandeAddDTO, DemandeUpdateDTO, DemandeRoleDTO } from "../schema/demande.schema";
import { IDemandesParams } from "../types/demande.type";

export interface IDemandeAPI {
    obtenirTousDemandes(params: IDemandesParams): Promise<PaginatedResponse<IDemande>>;
    obtenirDemande(id: string): Promise<IDemande>;
    obtenirStatsDemandes(type: "personnel" | "demandeur"): Promise<IDemandeStatsResponse>;
    ajouterDemande(data: DemandeAddDTO): Promise<IDemandeAddUpdateResponse>;
    modifierProfil(data: DemandeUpdateDTO): Promise<IDemandeAddUpdateResponse>;
    modifierRole(id: string, data: DemandeRoleDTO): Promise<IDemandeAddUpdateResponse>;
    activerDemande(id: string): Promise<IDemandeActiveDesactiveDeleteResponse>;
    desactiverDemande(id: string): Promise<IDemandeActiveDesactiveDeleteResponse>;
    supprimerDemande(id: string): Promise<IDemandeActiveDesactiveDeleteResponse>;
}

export const demandeAPI: IDemandeAPI = {
    obtenirTousDemandes(params: IDemandesParams): Promise<PaginatedResponse<IDemande>> {
        return api.request<PaginatedResponse<IDemande>>({
            endpoint: `/demandes`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },
    obtenirDemande(id: string): Promise<IDemande> {
        return api.request<IDemande>({
            endpoint: `/demandes/${id}/profile`,
            method: "GET",
        });
    },
    obtenirStatsDemandes(type: "personnel" | "demandeur"): Promise<IDemandeStatsResponse> {
        return api.request<IDemandeStatsResponse>({
            endpoint: `/demandes/stats/${type}`,
            method: "GET",
        });
    },
    ajouterDemande(data: DemandeAddDTO): Promise<IDemandeAddUpdateResponse> {
        return api.request<IDemandeAddUpdateResponse>({
            endpoint: `/demandes`,
            method: "POST",
            data,
        });
    },
    modifierProfil(data: DemandeUpdateDTO): Promise<IDemandeAddUpdateResponse> {
        return api.request<IDemandeAddUpdateResponse>({
            endpoint: `/demandes/me`,
            method: "PATCH",
            data,
        });
    },
    modifierRole(id: string, data: DemandeRoleDTO): Promise<IDemandeAddUpdateResponse> {
        return api.request<IDemandeAddUpdateResponse>({
            endpoint: `/demandes/update/${id}/role`,
            method: "PATCH",
            data,
        });
    },
    activerDemande(id: string): Promise<IDemandeActiveDesactiveDeleteResponse> {
        return api.request<IDemandeActiveDesactiveDeleteResponse>({
            endpoint: `/demandes/activate/${id}`,
            method: "PATCH",
        });
    },
    desactiverDemande(id: string): Promise<IDemandeActiveDesactiveDeleteResponse> {
        return api.request<IDemandeActiveDesactiveDeleteResponse>({
            endpoint: `/demandes/deactivate/${id}`,
            method: "PATCH",
        });
    },
    supprimerDemande(id: string): Promise<IDemandeActiveDesactiveDeleteResponse> {
        return api.request<IDemandeActiveDesactiveDeleteResponse>({
            endpoint: `/users/${id}`,
            method: "DELETE",
        });
    },
};
