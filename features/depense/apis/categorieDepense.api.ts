import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { ICategorieDepense } from "../types/categorieDepense.type";

export interface ICategorieDepenseAPI {
    obtenirToutesCategoriesDepenses(): Promise<PaginatedResponse<ICategorieDepense>>;
    obtenirCategoriesActives(): Promise<PaginatedResponse<ICategorieDepense>>;
}

export const categorieDepenseAPI: ICategorieDepenseAPI = {
    async obtenirToutesCategoriesDepenses(): Promise<PaginatedResponse<ICategorieDepense>> {
        const response = await api.request<PaginatedResponse<any>>({
            endpoint: `/expense-categories`,
            method: "GET",
        });
            
        return response;
    },
    async obtenirCategoriesActives(): Promise<PaginatedResponse<ICategorieDepense>> {
        const response = await api.request<PaginatedResponse<ICategorieDepense>>({
            endpoint: `/expense-categories/active`,
            method: "GET",
        });
        
        return response;
    },
}
