"use server";

import { videoAPI } from "../apis/video.api";
import { VideoDTO } from "../schemas/video.schema";
import { IVideoRechercheParams } from "../types/video.type";

/**
 * Fonction pour créer une nouvelle video
 * @param data - Les données du formulaire à valider et envoyer
 * @returns Un objet indiquant le succès de l'opération et un message
 */
export async function createVideo(
    data: VideoDTO
): Promise<{ success: boolean; message: string }> {
    console.log('createVideo - Données reçues:', data);

    try {
        console.log('createVideo - Appel API avec données:', data);

        // Création de la video
        const createdVideo = await videoAPI.create(data);

        console.log('createVideo - Video créée:', createdVideo);

        if (!createdVideo || !createdVideo.id) {
            console.error('createVideo - Réponse API invalide:', createdVideo);
            return {
                success: false,
                message: "La création a échoué - réponse API invalide.",
            };
        }

        return {
            success: true,
            message: "video créée avec succès.",
        };
    } catch (apiError: any) {
        console.error('createVideo - Erreur API:', apiError);
        console.error('createVideo - Détails erreur:', {
            message: apiError.message,
            status: apiError.status,
            data: apiError.data,
        });

        return {
            success: false,
            message: apiError.message || "Erreur lors de la création de la video.",
        };
    }
}


// Mise à jour d'une Video existante
export async function updateVideo(
    id: string,
    data: VideoDTO
): Promise<{ success: boolean; message: string }> {
    console.log('=== UPDATE Video ACTION ===');
    console.log('ID:', id); console.log('updateVideo - Données reçues:', data);

    // mise à jour de la Video
    try {
            console.log('updateVideo - Appel API avec Données:', data);

        const updated = await videoAPI.update(id, data);
        console.log("Video mis à jour :", updated);

        return {
            success: true,
            message: "video mise à jour avec succès.",
        };
    } catch (apiError: any) {
        console.error('updateVideo - Erreur API:', apiError);
        console.error('updateVideo - Détails erreur:', {
            message: apiError.message,
            status: apiError.status,
            data: apiError.data,
        });
        return {
            success: false,
            message: apiError.message || "Erreur lors de la mise à jour de la video.",
        };
    }
}
// Suppression d'une Video
export async function deleteVideo(
    id: string
): Promise<{ success: boolean; message: string }> {

    // Vérification de l'ID de la video et verification de espace dans id
    if (!id || id.trim() === "") {
        return {
            success: false,
            message: "ID de la video requis.",
        };
    }
    // Vérification de l'existence de la video
    try {
        // Appel à l'API pour supprimer la video
        await videoAPI.delete(id);
        return {
            success: true,
            message: "video supprimée avec succès.",
        };
    } catch (apiError: any) {
        return {
            success: false,
            message: apiError.message || "Erreur lors de la suppression de la video.",
        };
    }
}

// Les gets sont appelés dans les queries

export async function getVideoDetailAction(id: string) {
    if (!id || id.trim() === "") {
        throw new Error("ID de la video requis.");
    }
    return videoAPI.getById(id);
}

    export async function getVideoTousAction(params: IVideoRechercheParams) {
    return videoAPI.getAll(params);
}

export async function getVideoStatsAction() {
    return videoAPI.getStats();
}
