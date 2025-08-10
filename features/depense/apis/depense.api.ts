import { IDepense } from "../types/depense.type";
import { DepenseCreateDTO, DepenseUpdateDTO } from "../schemas/depense.schema";
import { PaginatedResponse } from "@/types";
import { SearchParams } from "ak-api-http";
import { IDepensesParams } from "../types/depense.type";
import { api } from "@/lib/api";
import { IDepenseStatsResponse } from "../types/depense.type";

export interface IDepenseAPI {
    obtenirTousDepenses(params: IDepensesParams): Promise<PaginatedResponse<IDepense>>;
    obtenirDepense(id: string): Promise<IDepense>;
    ajouterDepense(data: DepenseCreateDTO): Promise<IDepense>;
    modifierDepense(id: string, data: DepenseUpdateDTO): Promise<IDepense>;
    supprimerDepense(id: string): Promise<IDepense>;
    obtenirStatsDepenses(): Promise<IDepenseStatsResponse>;
}

export const depenseAPI: IDepenseAPI = {
    async obtenirTousDepenses(params: IDepensesParams): Promise<PaginatedResponse<IDepense>> {
        return await api.request<PaginatedResponse<IDepense>>({
            endpoint: `/expenses`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },

    async obtenirDepense(id: string): Promise<IDepense> {
        return await api.request<IDepense>({
            endpoint: `/expenses/${id}`,
            method: "GET",
        });
    },

    ajouterDepense(data: DepenseCreateDTO): Promise<IDepense> {
        return api.request<IDepense>({
            endpoint: `/expenses`,
            method: "POST",
            data,
        });
    },

    modifierDepense(id: string, data: DepenseUpdateDTO): Promise<IDepense> {
        return api.request<IDepense>({
            endpoint: `/expenses/${id}`,
            method: "PATCH",
            data,
        });
    },

    supprimerDepense(id: string): Promise<IDepense> {
        return api.request<IDepense>({
            endpoint: `/expenses/${id}`,
            method: "DELETE",
        });

    },

    obtenirStatsDepenses(): Promise<IDepenseStatsResponse> {
        return api.request<IDepenseStatsResponse>({
            endpoint: `/expenses/stats`,
            method: "GET",
        });
    },

}
