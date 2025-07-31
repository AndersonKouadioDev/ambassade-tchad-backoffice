"use server";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { ActualiteDTO, actualiteSchema } from "../schemas/actualites.schema";
import { actualiteAPI } from "../api/actualites.api";
import { IActualiteRechercheParams } from "../types/actualites.type";

/**
 * Fonction pour créer un nouvel événement
 * @param formdata - Les données du formulaire à valider et envoyer
 * @returns Un objet indiquant le succès de l'opération et un message
 */
export async function createActualite(
    formdata: FormData
): Promise<{ success: boolean; message: string }> {
    console.log('createActualite - Données reçues:', formdata);

    try {
        console.log('createActualite - Appel API avec données:', formdata);

        // Création de l'actualité
        const createdActualite = await actualiteAPI.create(formdata);

        console.log('createActualite - Actualite créé:', createdActualite);

        if (!createdActualite || !createdActualite.id) {
            console.error('createActualite - Réponse API invalide:', createdActualite);
            return {
                success: false,
                message: "La création a échoué - réponse API invalide.",
            };
        }

        return {
            success: true,
            message: "Actualité créée avec succès.",
        };
    } catch (apiError: any) {
        console.error('createActualite - Erreur API:', apiError);
        console.error('createActualite - Détails erreur:', {
            message: apiError.message,
            status: apiError.status,
            data: apiError.data,
        });

        return {
            success: false,
            message: apiError.message || "Erreur lors de la création de l'actualité.",
        };
    }
}


// Mise à jour d'un actualite existant
export async function updateActualite(
    id: string,
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    console.log('=== UPDATE ACTUALITE ACTION ===');
    console.log('ID:', id); console.log('updateActualite - FormData reçu:', formData);

    // mise à jour de l'actualite
    try {
        console.log('updateActualite - Appel API avec FormData:', formData);

        const updated = await actualiteAPI.update(id, formData);
        console.log("Actualite mis à jour :", updated);

        return {
            success: true,
            message: "Actualité mise à jour avec succès.",
        };
    } catch (apiError: any) {
        console.error('updateActualite - Erreur API:', apiError);
        console.error('updateActualite - Détails erreur:', {
            message: apiError.message,
            status: apiError.status,
            data: apiError.data,
        });
        return {
            success: false,
            message: apiError.message || "Erreur lors de la mise à jour de l'actualité.",
        };
    }
}
// Suppression d'un actualite
export async function deleteActualite(
    id: string
): Promise<{ success: boolean; message: string }> {
    // Vérification de l'ID de l'actualite et verification de espace dans id
    if (!id || id.trim() === "") {
        return {
            success: false,
            message: "ID de l'actualite requis.",
        };
    }
    // Vérification de l'existence de l'événement
    try {
        // Appel à l'API pour supprimer l'événement
        await actualiteAPI.delete(id);
        return {
            success: true,
            message: "Actualite supprimé avec succès.",
        };
    } catch (apiError: any) {
        return {
            success: false,
            message: apiError.message || "Erreur lors de la suppression de l'actualite.",
        };
    }
}

// Les gets sont appelés dans les queries

export async function getActualiteDetailAction(id: string) {
    if (!id || id.trim() === "") {
        throw new Error("ID de l'actualité requis.");
    }
    return actualiteAPI.getById(id);
}

export async function getActualiteTousAction(params: IActualiteRechercheParams) {

    return actualiteAPI.getAll(params);
}

export async function getActualiteStatsAction() {

    return actualiteAPI.getStats();
}
