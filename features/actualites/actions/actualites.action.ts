"use server";
import { ActionResponse, PaginatedResponse } from "@/types";
import { actualiteAPI } from "../api/actualites.api";
import { IActualite, IActualiteRechercheParams, IActualiteStatsResponse } from "../types/actualites.type";
import { handleServerActionError } from "@/utils/handleServerActionError";


export async function createActualiteAction(
    formdata: FormData
): Promise<ActionResponse<IActualite>> {

    try {
        const createdActualite = await actualiteAPI.create(formdata);

        return {
            success: true,
            data: createdActualite,
            message: "Actualité créée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la création de l'actualité.");
    }
}


export async function updateActualiteAction(
    id: string,
    formData: FormData
): Promise<ActionResponse<IActualite>> {

    try {

        const updated = await actualiteAPI.update(id, formData);

        return {
            success: true,
            data: updated,
            message: "Actualité mise à jour avec succès.",
        };

    } catch (apiError: any) {
        return handleServerActionError(apiError, "Erreur lors de la mise à jour de l'actualité.");
    }
}

export async function deleteActualiteAction(
    id: string
): Promise<ActionResponse<void>> {

    try {
        await actualiteAPI.delete(id);
        return {
            success: true,
            message: "Actualite supprimé avec succès.",
        };
    } catch (apiError: any) {
        return handleServerActionError(apiError, "Erreur lors de la suppression de l'actualité.");
    }
}


export async function getActualiteDetailAction(id: string): Promise<ActionResponse<IActualite>> {
    try {
        const actualite = await actualiteAPI.getById(id);
        return {
            success: true,
            data: actualite,
            message: "Actualité récupérée avec succès.",
        };
    } catch (apiError: any) {
        return handleServerActionError(apiError, "Erreur lors de la récupération de l'actualité.");
    }
}

export async function getActualiteTousAction(params: IActualiteRechercheParams):
    Promise<ActionResponse<PaginatedResponse<IActualite>>> {
    try {
        const actualites = await actualiteAPI.getAll(params);
        return {
            success: true,
            data: actualites,
            message: "Actualités récupérées avec succès.",
        };
    } catch (apiError: any) {
        return handleServerActionError(apiError, "Erreur lors de la récupération des actualités.");
    }
}

export async function getActualiteStatsAction(): Promise<ActionResponse<IActualiteStatsResponse>> {
    try {
        const stats = await actualiteAPI.getStats();
        return {
            success: true,
            data: stats,
            message: "Statistiques récupérées avec succès.",
        };
    } catch (apiError: any) {
        return handleServerActionError(apiError, "Erreur lors de la récupération des statistiques.");
    }
}
