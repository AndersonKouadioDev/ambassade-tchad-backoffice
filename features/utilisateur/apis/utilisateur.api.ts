import { api } from "@/lib/api";
import { IUtilisateur } from "../types/utilisateur.type";
import { IUtilisateurStatsResponse, IUtilisateurAddUpdateResponse, IUtilisateurActiveDesactiveDeleteResponse } from "../types/utilisateur.type";
import { PaginatedResponse } from "@/types";
import { SearchParams } from "ak-api-http";
import { UtilisateurAddUpdateDTO } from "../schema/utilisateur.schema";
import { UtilisateursParamsDTO } from "../schema/utilisateur-params.schema";

export interface IUtilisateurAPI {
    obtenirTousUtilisateurs(params: UtilisateursParamsDTO): Promise<PaginatedResponse<IUtilisateur>>;
    obtenirUtilisateur(id: string): Promise<IUtilisateur>;
    obtenirStatsUtilisateurs(): Promise<IUtilisateurStatsResponse>;
    ajouterUtilisateur(data: UtilisateurAddUpdateDTO): Promise<IUtilisateurAddUpdateResponse>;
    modifierUtilisateur(data: UtilisateurAddUpdateDTO): Promise<IUtilisateurAddUpdateResponse>;
    activerUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse>;
    desactiverUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse>;
    supprimerUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse>;
}

export const utilisateurAPI: IUtilisateurAPI = {
    obtenirTousUtilisateurs(params: UtilisateursParamsDTO): Promise<PaginatedResponse<IUtilisateur>> {
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
    obtenirStatsUtilisateurs(): Promise<IUtilisateurStatsResponse> {
        return api.request<IUtilisateurStatsResponse>({
            endpoint: `/users/stats`,
            method: "GET",
        });
    },
    ajouterUtilisateur(data: UtilisateurAddUpdateDTO): Promise<IUtilisateurAddUpdateResponse> {
        return api.request<IUtilisateurAddUpdateResponse>({
            endpoint: `/users`,
            method: "POST",
            data,
        });
    },
    modifierUtilisateur(data: UtilisateurAddUpdateDTO): Promise<IUtilisateurAddUpdateResponse> {
        return api.request<IUtilisateurAddUpdateResponse>({
            endpoint: `/users/me`,
            method: "PATCH",
            data,
        });
    },
    activerUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse> {
        return api.request<IUtilisateurActiveDesactiveDeleteResponse>({
            endpoint: `/users/${id}/activate`,
            method: "POST",
        });
    },
    desactiverUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse> {
        return api.request<IUtilisateurActiveDesactiveDeleteResponse>({
            endpoint: `/users/${id}/deactivate`,
            method: "POST",
        });
    },
    supprimerUtilisateur(id: string): Promise<IUtilisateurActiveDesactiveDeleteResponse> {
        return api.request<IUtilisateurActiveDesactiveDeleteResponse>({
            endpoint: `/users/${id}/delete`,
            method: "POST",
        });
    },
};
