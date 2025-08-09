import { IDepense, IDepenseAddUpdateResponse } from "../types/depense.type";
import { IDepenseCreateDTO, IDepenseUpdateDTO, depenseResponseSchema } from "../schemas/depense.schema";
import { PaginatedResponse } from "@/types";
import { SearchParams } from "ak-api-http";
import { IDepensesParams } from "../types/depense.type";
import { api } from "@/lib/api";
import { IDepenseStatsResponse } from "../types/depense.type";

export interface IDepenseAPI {
    obtenirTousDepenses(params: IDepensesParams): Promise<PaginatedResponse<IDepense>>;
    obtenirDepense(id: string): Promise<IDepense>;
    ajouterDepense(data: IDepenseCreateDTO): Promise<IDepense>;
    modifierDepense(id: string, data: IDepenseUpdateDTO): Promise<IDepenseAddUpdateResponse>;
    supprimerDepense(id: string): Promise<IDepense>;
    obtenirStatsDepenses(): Promise<IDepenseStatsResponse>;
}

export const depenseAPI: IDepenseAPI = {
    async obtenirTousDepenses(params: IDepensesParams): Promise<PaginatedResponse<IDepense>> {
        const response = await api.request<PaginatedResponse<any>>({
            endpoint: `/expenses`,
            method: "GET",
            searchParams: params as SearchParams,
        });
        
        // Valider et transformer les données avec Zod
        const validatedData = {
            ...response,
            data: response.data.map((item: any) => depenseResponseSchema.parse(item))
        };
        
        return validatedData as PaginatedResponse<IDepense>;
    },
    async obtenirDepense(id: string): Promise<IDepense> {
        const response = await api.request<any>({
            endpoint: `/expenses/${id}`,
            method: "GET",
        });
        
        // Valider et transformer les données avec Zod
        return depenseResponseSchema.parse(response) as IDepense;
    },
    ajouterDepense(data: IDepenseCreateDTO): Promise<IDepense> {
        return api.request<IDepense>({
            endpoint: `/expenses`,
            method: "POST",
            data,
        });
    },
    modifierDepense(id: string, data: IDepenseUpdateDTO): Promise<IDepenseAddUpdateResponse> {
        return api.request<IDepenseAddUpdateResponse>({
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
