"use server";
import {evenementAPI} from "../apis/evenement.api";
import {IEvenement, IEvenementRechercheParams} from "../types/evenement.type";
import {handleServerActionError} from "@/utils/handleServerActionError";
import {ActionResponse} from "@/types";


/**
 * Fonction pour créer un nouvel événement
 * @param formdata - Les données du formulaire à valider et envoyer
 * @returns Un objet indiquant le succès de l'opération et un message
 */
export async function createEvenementAction(
    formdata: FormData
): Promise<ActionResponse<IEvenement>> {
    try {
        // Création de l'évènement
        const result = await evenementAPI.create(formdata);

        return {
            success: true,
            data: result,
            message: "Actualité créée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la création de l'actualité.");
    }
}


// Mise à jour d'un Evenement existant
export async function updateEvenementAction(
    id: string,
    formData: FormData
): Promise<ActionResponse<IEvenement>> {
    try {
        // mise à jour de l'Evenement
        const result = await evenementAPI.update(id, formData);

        return {
            success: true,
            data: result,
            message: "Actualité créée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la création de l'actualité.");
    }
}

// Suppression d'un Evenement
export async function deleteEvenementAction(
    id: string
): Promise<ActionResponse<IEvenement>> {
    // Vérification de l'ID de l'evenement et verification d'espace dans id
    if (!id || id.trim() === "") {
        return {
            success: false,
            message: "ID de l'evenement requis.",
        };
    }
    // Vérification de l'existence de l'événement
    try {
        // Appel à l'API pour supprimer l'événement
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

// Les gets sont appelés dans les queries
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

export async function getEvenementTousAction(params: IEvenementRechercheParams) {

    return evenementAPI.getAll(params);
}

export async function getEvenementStatsAction() {

    return evenementAPI.getStats();
}
