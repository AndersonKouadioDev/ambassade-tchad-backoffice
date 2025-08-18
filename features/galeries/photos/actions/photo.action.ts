"use server";
import { ActionResponse, PaginatedResponse } from "@/types";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { IPhoto, IPhotoRechercheParams, IPhotoStats } from "../types/photo.type";
import { photoAPI } from "../apis/photo.api";


export async function createPhotoAction(
    formdata: FormData
): Promise<ActionResponse<IPhoto>> {

    try {
        const createdPhoto = await photoAPI.create(formdata);

        return {
            success: true,
            data: createdPhoto,
            message: "Photo créée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la création de la photo.");
    }
}


export async function updatePhotoAction(
    id: string,
    formData: FormData
): Promise<ActionResponse<IPhoto>> {

    try {

        const updated = await photoAPI.update(id, formData);

        return {
            success: true,
            data: updated,
            message: "Photo mise à jour avec succès.",
        };

    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la mise à jour de la photo.");
    }
}

export async function deletePhotoAction(
    id: string
): Promise<ActionResponse<void>> {

    try {
        await photoAPI.delete(id);
        return {
            success: true,
            message: "Photo supprimé avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la suppression de la photo.");
    }
}


export async function getPhotoDetailAction(id: string): Promise<ActionResponse<IPhoto>> {
    try {
        const photo = await photoAPI.getById(id);
        return {
            success: true,
            data: photo,
            message: "Photo récupérée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la photo.");
    }
}

export async function getPhotoTousAction(params: IPhotoRechercheParams):
    Promise<ActionResponse<PaginatedResponse<IPhoto>>> {
    try {
        const photos = await photoAPI.getAll(params);
        return {
            success: true,
            data: photos,
            message: "Photos récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des photos.");
    }
}

export async function getPhotoStatsAction(): Promise<ActionResponse<IPhotoStats>> {
    try {
        const stats = await photoAPI.getStats();
        return {
            success: true,
            data: stats,
            message: "Statistiques récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des statistiques.");
    }
}
