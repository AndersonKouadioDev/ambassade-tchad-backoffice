"use server";
import { evenementAPI } from "../apis/evenement.api";
import { IEvenementRechercheParams } from "../types/evenement.type";


/**
 * Fonction pour créer un nouvel événement
 * @param formdata - Les données du formulaire à valider et envoyer
 * @returns Un objet indiquant le succès de l'opération et un message
 */
export async function createEvenement(
    formdata: FormData
): Promise<{ success: boolean; message: string }> {
    console.log('createEvenement - Données reçues:', formdata);

    try {
        console.log('createEvenement - Appel API avec données:', formdata);

        // Création de l'évènement
        const createdEvenement = await evenementAPI.create(formdata);

        console.log('createEvenement - Evenement créé:', createdEvenement);

        if (!createdEvenement || !createdEvenement.id) {
            console.error('createEvenement - Réponse API invalide:', createdEvenement);
            return {
                success: false,
                message: "La création a échoué - réponse API invalide.",
            };
        }

        return {
            success: true,
            message: "évènement créée avec succès.",
        };
    } catch (apiError: any) {
        console.error('createEvenement - Erreur API:', apiError);
        console.error('createEvenement - Détails erreur:', {
            message: apiError.message,
            status: apiError.status,
            data: apiError.data,
        });

        return {
            success: false,
            message: apiError.message || "Erreur lors de la création de l'évènement.",
        };
    }
}


// Mise à jour d'un Evenement existant
export async function updateEvenement(
    id: string,
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    console.log('=== UPDATE Evenement ACTION ===');
    console.log('ID:', id); console.log('updateEvenement - FormData reçu:', formData);

    // mise à jour de l'Evenement
    try {
        console.log('updateEvenement - Appel API avec FormData:', formData);

        const updated = await evenementAPI.update(id, formData);
        console.log("Evenement mis à jour :", updated);

        return {
            success: true,
            message: "évènement mise à jour avec succès.",
        };
    } catch (apiError: any) {
        console.error('updateEvenement - Erreur API:', apiError);
        console.error('updateEvenement - Détails erreur:', {
            message: apiError.message,
            status: apiError.status,
            data: apiError.data,
        });
        return {
            success: false,
            message: apiError.message || "Erreur lors de la mise à jour de l'évènement.",
        };
    }
}
// Suppression d'un Evenement
export async function deleteEvenement(
    id: string
): Promise<{ success: boolean; message: string }> {
    // Vérification de l'ID de l'evenement et verification de espace dans id
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
    } catch (apiError: any) {
        return {
            success: false,
            message: apiError.message || "Erreur lors de la suppression de l'evenement.",
        };
    }
}

// Les gets sont appelés dans les queries

export async function getEvenementDetailAction(id: string) {
    if (!id || id.trim() === "") {
        throw new Error("ID de l'évènement requis.");
    }
    return evenementAPI.getById(id);
}

export async function getEvenementTousAction(params: IEvenementRechercheParams) {

    return evenementAPI.getAll(params);
}

export async function getEvenementStatsAction() {

    return evenementAPI.getStats();
}
