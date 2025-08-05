import { api } from "@/lib/api";
import { IUtilisateur } from "../types/utilisateur.type";
import { IUtilisateurStatsResponse, IUtilisateurAddUpdateResponse, IUtilisateurActiveDesactiveDeleteResponse } from "../types/utilisateur.type";
import { PaginatedResponse } from "@/types";
import { SearchParams } from "ak-api-http";
import { UtilisateurAddDTO, UtilisateurUpdateDTO, UtilisateurRoleDTO } from "../schema/utilisateur.schema";
import { IUtilisateursParams } from "../types/utilisateur.type";

export interface IUtilisateurAPI {
    obtenirTousUtilisateurs(params: IUtilisateursParams): Promise<PaginatedResponse<IUtilisateur>>;
    obtenirUtilisateur(id: string): Promise<IUtilisateur>;
    obtenirStatsUtilisateurs(type: "personnel" | "demandeur"): Promise<IUtilisateurStatsResponse>;
    ajouterUtilisateur(data: UtilisateurAddDTO): Promise<IUtilisateurAddUpdateResponse>;
    modifierProfil(data: UtilisateurUpdateDTO): Promise<IUtilisateurAddUpdateResponse>;
    modifierRole(id: string, data: UtilisateurRoleDTO): Promise<IUtilisateurAddUpdateResponse>;
    activerUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse>;
    desactiverUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse>;
    supprimerUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse>;
}

export const utilisateurAPI: IUtilisateurAPI = {
    obtenirTousUtilisateurs(params: IUtilisateursParams): Promise<PaginatedResponse<IUtilisateur>> {
        return api.request<PaginatedResponse<IUtilisateur>>({
            endpoint: `/users`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },

    obtenirUtilisateur(id: string): Promise<IUtilisateur> {
        return api.request<IUtilisateur>({
            endpoint: `/users/${id}/profile`,
            method: "GET",
        });
    },

    obtenirStatsUtilisateurs(type: "personnel" | "demandeur"): Promise<IUtilisateurStatsResponse> {
        return api.request<IUtilisateurStatsResponse>({
            endpoint: `/users/stats/${type}`,
            method: "GET",
        });
    },
    ajouterUtilisateur(data: UtilisateurAddDTO): Promise<IUtilisateurAddUpdateResponse> {
        return api.request<IUtilisateurAddUpdateResponse>({
            endpoint: `/users`,
            method: "POST",
            data,
        });
    },
    modifierProfil(data: UtilisateurUpdateDTO): Promise<IUtilisateurAddUpdateResponse> {
        return api.request<IUtilisateurAddUpdateResponse>({
            endpoint: `/users/me`,
            method: "PATCH",
            data,
        });
    },
    modifierRole(id: string, data: UtilisateurRoleDTO): Promise<IUtilisateurAddUpdateResponse> {
        return api.request<IUtilisateurAddUpdateResponse>({
            endpoint: `/users/update/${id}/role`,
            method: "PATCH",
            data,
        });
    },
    activerUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse> {
        return api.request<IUtilisateurActiveDesactiveDeleteResponse>({
            endpoint: `/users/activate/${id}`,
            method: "PATCH",
        });
    },
    desactiverUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse> {
        return api.request<IUtilisateurActiveDesactiveDeleteResponse>({
            endpoint: `/users/deactivate/${id}`,
            method: "PATCH",
        });
    },
    supprimerUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse> {
        return api.request<IUtilisateurActiveDesactiveDeleteResponse>({
            endpoint: `/users/${id}`,
            method: "DELETE",
        });
    },
};
