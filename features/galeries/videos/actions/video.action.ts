"use server";

import {videoAPI} from "../apis/video.api";
import {VideoDTO} from "../schemas/video.schema";
import {IVideo, IVideoRechercheParams, IVideoStats} from "../types/video.type";
import {ActionResponse, PaginatedResponse} from "@/types";
import {handleServerActionError} from "@/utils/handleServerActionError";

/**
 * Fonction pour créer une nouvelle video
 * @param data - Les données du formulaire à valider et envoyer
 * @returns Un objet indiquant le succès de l'opération et un message
 */
export async function createVideoAction(
    data: VideoDTO
): Promise<ActionResponse<IVideo>> {

    try {
        const result = await videoAPI.create(data);

        return {
            success: true,
            data: result,
            message: "Video créée avec succès.",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la création de la video.");
    }
}


// Mise à jour d'une Video existante
export async function updateVideoAction(
    id: string,
    data: VideoDTO
): Promise<ActionResponse<IVideo>> {
    try {
        const result = await videoAPI.update(id, data);
        return {
            success: true,
            data: result,
            message: "Video mise à jour avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la mise à jour de la video.");
    }
}

// Suppression d'une Video
export async function deleteVideoAction(
    id: string
): Promise<ActionResponse<void>> {
    try {
        // Appel à l'API pour supprimer la video
        await videoAPI.delete(id);
        return {
            success: true,
            message: "video supprimée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la suppression de la video.");
    }
}

// Les gets sont appelés dans les queries

export async function getVideoDetailAction(id: string):Promise<ActionResponse<IVideo>> {
    try {
        const video = await videoAPI.getById(id);
        return {
            success: true,
            data: video,
            message: "Video récupérée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la video.");
    }
}

export async function getVideoTousAction(params: IVideoRechercheParams):Promise<ActionResponse<PaginatedResponse<IVideo>>> {
    try {
        const videos = await videoAPI.getAll(params);
        return {
            success: true,
            data: videos,
            message: "Videos récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des videos.");
    }
}

export async function getVideoStatsAction():Promise<ActionResponse<IVideoStats>> {
    try {
        const stats = await videoAPI.getStats();
        return {
            success: true,
            data: stats,
            message: "Statistiques des videos récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des statistiques des videos.");
    }
}
