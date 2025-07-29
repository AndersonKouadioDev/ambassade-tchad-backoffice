import { api } from "@/lib/api";
import { IUtilisateur } from "../types/utilisateur.type";
import { IUtilisateursRechercheParams, IUtilisateurStats } from "../types/utilisateur.type";
import { PaginatedResponse } from "@/types";
import { SearchParams } from "ak-api-http";

export interface IUtilisateurAPI {
    getAll: (params: IUtilisateursRechercheParams) => Promise<PaginatedResponse<IUtilisateur>>;
    getOne: (id: string) => Promise<IUtilisateur>;
    getStats: () => Promise<IUtilisateurStats>;
}

export const utilisateurAPI: IUtilisateurAPI = {
    getAll(params: IUtilisateursRechercheParams): Promise<PaginatedResponse<IUtilisateur>> {
        return api.request<PaginatedResponse<IUtilisateur>>({
            endpoint: `/users`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },
    getOne(id: string): Promise<IUtilisateur> {
        return api.request<IUtilisateur>({
            endpoint: `/users/${id}`,
            method: "GET",
        });
    },
    getStats(): Promise<IUtilisateurStats> {
        return api.request<IUtilisateurStats>({
            endpoint: `/users/stats`,
            method: "GET",
        });
    },
};
