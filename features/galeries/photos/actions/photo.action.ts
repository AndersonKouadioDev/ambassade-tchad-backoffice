"use server";

import { photoAPI } from "../apis/photo.api";
import { IPhotoRechercheParams } from "../types/photo.type";



/**
 * Fonction pour créer un nouvel événement
 * @param formdata - Les données du formulaire à valider et envoyer
 * @returns Un objet indiquant le succès de l'opération et un message
 */
export async function createPhoto(
    formdata: FormData
): Promise<{ success: boolean; message: string }> {
    console.log('createPhoto - Données reçues:', formdata);

    try {
        console.log('createEvenement - Appel API avec données:', formdata);

        // Création de l'évènement
        const createdPhoto = await photoAPI.create(formdata);

        console.log('createEvenement - Evenement créé:', createdPhoto);

            if (!createdPhoto || !createdPhoto.id) {
            console.error('createPhoto - Réponse API invalide:', createdPhoto);
            return {
                success: false,
                message: "La création a échoué - réponse API invalide.",
            };
        }

        return {
            success: true,
            message: "photo créée avec succès.",
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
            message: apiError.message || "Erreur lors de la création de la photo.",
        };
    }
}


// Mise à jour d'un Evenement existant
export async function updatePhoto(
    id: string,
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    console.log('=== UPDATE Photo ACTION ===');
    console.log('ID:', id); console.log('updatePhoto - FormData reçu:', formData);

    // mise à jour de l'Evenement
    try {
        console.log('updatePhoto - Appel API avec FormData:', formData);

        const updated = await photoAPI.update(id, formData);
        console.log("Photo mis à jour :", updated);

        return {
            success: true,
            message: "photo mise à jour avec succès.",
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
            message: apiError.message || "Erreur lors de la mise à jour de la photo.",
        };
    }
}
// Suppression d'un Evenement
export async function deletePhoto(
    id: string
): Promise<{ success: boolean; message: string }> {
    // Vérification de l'ID de l'evenement et verification de espace dans id
    if (!id || id.trim() === "") {
        return {
            success: false,
            message: "ID de la photo requis.",
        };
    }
    // Vérification de l'existence de l'événement
    try {
        // Appel à l'API pour supprimer l'événement
        await photoAPI.delete(id);
        return {
            success: true,
            message: "photo supprimée avec succès.",
        };
    } catch (apiError: any) {
        return {
            success: false,
            message: apiError.message || "Erreur lors de la suppression de la photo.",
        };
    }
}

// Les gets sont appelés dans les queries

export async function getPhotoDetailAction(id: string) {
    if (!id || id.trim() === "") {
        throw new Error("ID de la photo requis.");
    }
    return photoAPI.getById(id);
}

export async function getPhotoTousAction(params: IPhotoRechercheParams) {

    return photoAPI.getAll(params);
}

export async function getPhotoStatsAction() {

    return photoAPI.getStats();
}
