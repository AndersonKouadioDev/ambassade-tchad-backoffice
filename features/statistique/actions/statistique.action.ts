"use server";

import { ActionResponse } from "@/types";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { statistiqueAPI } from "../apis/statistique.api";
import { IStatistiqueOptions, IStatistiqueResponse } from "../types/statistique.type";

/**
 * Récupère les statistiques en fonction des filtres.
 * @param params Les options de filtre pour la période.
 */
export const getStatistiquesAction = async (
    params: IStatistiqueOptions
): Promise<ActionResponse<IStatistiqueResponse>> => {
    try {
        const data = await statistiqueAPI.getStatistiques(params);
        return {
            success: true,
            data: data,
            message: "Statistiques obtenues avec succès.",
        };
    } catch (error) {
        return handleServerActionError(
            error,
            "Erreur lors de la récupération des statistiques."
        );
    }
};
