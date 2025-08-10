import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { ICategorieDepense } from "../types/categorie-depense.type";

export interface ICategorieDepenseAPI {
    obtenirToutesCategoriesDepenses(): Promise<PaginatedResponse<ICategorieDepense>>;
    obtenirCategoriesActives(): Promise<PaginatedResponse<ICategorieDepense>>;
}

export const categorieDepenseAPI: ICategorieDepenseAPI = {
    async obtenirToutesCategoriesDepenses(): Promise<PaginatedResponse<ICategorieDepense>> {
        return await api.request<PaginatedResponse<ICategorieDepense>>({
            endpoint: `/expense-categories`,
            method: "GET",
        });
    },

    async obtenirCategoriesActives(): Promise<PaginatedResponse<ICategorieDepense>> {
        return await api.request<PaginatedResponse<ICategorieDepense>>({
            endpoint: `/expense-categories/active`,
            method: "GET",
        });
    },
}
