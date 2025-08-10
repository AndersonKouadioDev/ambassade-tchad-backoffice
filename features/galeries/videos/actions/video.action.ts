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

    try {

        // Création de la video
        const createdVideo = await videoAPI.create(data);

        if (!createdVideo || !createdVideo.id) {
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

    // mise à jour de la Video
    try {

        const updated = await videoAPI.update(id, data);

        return {
            success: true,
            message: "video mise à jour avec succès.",
        };
    } catch (apiError: any) {
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
