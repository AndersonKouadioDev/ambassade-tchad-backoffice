"use server";

import { evenementAPI } from "../apis/evenement.api";
import { IEvenement, IEvenementRechercheParams, IEvenementStats } from "../types/evenement.type";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { ActionResponse, PaginatedResponse } from "@/types";


// Création d'un Evenement
export async function createEvenementAction(
    formdata: FormData
): Promise<ActionResponse<IEvenement>> {
    try {
        const result = await evenementAPI.create(formdata);

        return {
            success: true,
            data: result,
            message: "Evenement créée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la création de l'evenement.");
    }
}


// Mise à jour d'un Evenement existant
export async function updateEvenementAction(
    id: string,
    formData: FormData
): Promise<ActionResponse<IEvenement>> {
    try {
        const result = await evenementAPI.update(id, formData);

        return {
            success: true,
            data: result,
            message: "Evenement modifié avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la modification de l'evenement.");
    }
}

// Suppression d'un Evenement
export async function deleteEvenementAction(
    id: string
): Promise<ActionResponse<IEvenement>> {
    if (!id || id.trim() === "") {
        return {
            success: false,
            message: "ID de l'evenement requis.",
        };
    }
    try {
        await evenementAPI.delete(id);
        return {
            success: true,
            message: "evenement supprimé avec succès.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la suppression de l'evenement.",
        };
    }
}

// Récupération d'un Evenement
export async function getEvenementDetailAction(id: string): Promise<ActionResponse<IEvenement>> {
    try {
        const evenement = await evenementAPI.getById(id);
        return {
            success: true,
            data: evenement,
            message: "Événement récupéré avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de l'événement.");
    }
}

// Récupération de tous les Evenements
export async function getEvenementTousAction(params: IEvenementRechercheParams): Promise<ActionResponse<PaginatedResponse<IEvenement>>> {
    try {
        const result = await evenementAPI.getAll(params);

        return {
            success: true,
            data: result,
            message: "Événements récupérés avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des événements.");
    }
}

// Récupération des stats des Evenements
export async function getEvenementStatsAction(): Promise<ActionResponse<IEvenementStats>> {
    try {
        const result = await evenementAPI.getStats();

        return {
            success: true,
            data: result,
            message: "Stats récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des stats.");
    }
}
