"use server";

import { ActionResponse } from "@/types";
import { categorieDepenseAPI } from "../apis/categorie-depense.api";
import { ICategorieDepense, ICategorieDepenseParams } from "../types/categorie-depense.type";
import { handleServerActionError } from "@/utils/handleServerActionError";

export const obtenirCategoriesDepensesAction = async (params: ICategorieDepenseParams): Promise<ActionResponse<ICategorieDepense[]>> => {
    try {
        const response = await categorieDepenseAPI.obtenirToutesCategoriesDepenses(params);
        return {
            success: true,
            data: response,
            message: "Categories dépenses obtenues avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des categories dépenses");
    }
}
export const obtenirCategoriesDepensesActiveAction = async (params: ICategorieDepenseParams): Promise<ActionResponse<ICategorieDepense[]>> => {
    try {
        const response = await categorieDepenseAPI.obtenirCategoriesActives(params);
        return {
            success: true,
            data: response,
            message: "Categories dépenses obtenues avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des categories dépenses");
    }
}
