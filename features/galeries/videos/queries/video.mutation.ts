"use client";

import {useMutation,} from '@tanstack/react-query';
import {toast} from "sonner";
import {processAndValidateFormData} from "ak-zod-form-kit";
import {useInvalidateVideoQuery} from './index.query';
import {createVideoAction, deleteVideoAction, updateVideoAction} from '../actions/video.action';
import {VideoDTO, videoSchema, VideoUpdateDTO, VideoUpdateSchema} from '../schemas/video.schema';

export const useVideoCreateMutation = () => {
    const invalidateVideoQuery = useInvalidateVideoQuery()

    return useMutation({
        mutationFn: async (data: VideoDTO) => {
            // Validation des données
            const validation = processAndValidateFormData(videoSchema, data,
                {
                    outputFormat: "object",
                })

            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            // Appel de l'API avec l'action
            const result = await createVideoAction(validation.data as VideoDTO);

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la création de la video");
            }

            return result.data!;
        },
        onSuccess: async () => {
            await invalidateVideoQuery();
            toast.success("Video ajoutée avec succès");
        },

        onError: async (error) => {
            toast.error("Erreur lors de l'ajout de la video:", {
                description: error.message,
            });
        },
    });
};

export const useVideoUpdateMutation = () => {
    const invalidateVideoQuery = useInvalidateVideoQuery()
    return useMutation({
        mutationFn: async ({id, data}: { id: string, data: VideoDTO }) => {
            // Validation des données
            const validation = processAndValidateFormData(VideoUpdateSchema, data,
                {
                    outputFormat: "object"

                });

            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            if (!id) {
                throw new Error("L'identifiant de la video est requis.");
            }

            // Appel de l'API avec l'action
            const result = await updateVideoAction(id, validation.data as VideoUpdateDTO);

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la modification de la video");
            }

            return result.data!;
        },
        onSuccess: async () => {
            await invalidateVideoQuery();
            toast.success("Video modifiée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur modification video:", {
                description: error.message,
            });
        },
    });
};


export const useSupprimerVideoMutation = () => {
    const invalidateVideoQuery = useInvalidateVideoQuery()
    return useMutation({
        mutationFn: async (id: string) => {
            if (!id) {
                throw new Error("L'identifiant de la video est requis.");
            }
            const result = await deleteVideoAction(id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la suppression de la video");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateVideoQuery();
            toast.success("Video supprimée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur suppression video:", {
                description: error.message,
            });
        },
    });
};