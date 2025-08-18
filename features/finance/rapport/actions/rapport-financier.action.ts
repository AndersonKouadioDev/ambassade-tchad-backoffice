"use server";

import { ActionResponse } from "@/types";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { financialReportAPI } from "../apis/rapport-financier.api";
import {
    FinancialReportResponse,
    FilterOptions,
} from "../types/rapport-financier.type";

/**
 * Récupère le rapport financier complet en fonction des filtres.
 * @param params Les options de filtre pour la période.
 */
export const getFinancialReportAction = async (
    params: FilterOptions
): Promise<ActionResponse<FinancialReportResponse>> => {
    try {
        const data = await financialReportAPI.getFinancialReport(params);
        return {
            success: true,
            data: data,
            message: "Rapport financier obtenu avec succès.",
        };
    } catch (error) {
        return handleServerActionError(
            error,
            "Erreur lors de la récupération du rapport financier."
        );
    }
};

/**
 * Récupère le total des revenus pour une période donnée.
 * @param params Les options de filtre pour la période.
 */
export const getTotalRevenueAction = async (
    params: FilterOptions
): Promise<ActionResponse<number>> => {
    try {
        const data = await financialReportAPI.getTotalRevenue(params);
        return {
            success: true,
            data: data,
            message: "Total des revenus obtenu avec succès.",
        };
    } catch (error) {
        return handleServerActionError(
            error,
            "Erreur lors de la récupération du total des revenus."
        );
    }
};

/**
 * Récupère le total des dépenses pour une période donnée.
 * @param params Les options de filtre pour la période.
 */
export const getTotalDepensesAction = async (
    params: FilterOptions
): Promise<ActionResponse<number>> => {
    try {
        const data = await financialReportAPI.getTotalDepenses(params);
        return {
            success: true,
            data: data,
            message: "Total des dépenses obtenu avec succès.",
        };
    } catch (error) {
        return handleServerActionError(
            error,
            "Erreur lors de la récupération du total des dépenses."
        );
    }
};