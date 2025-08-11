"use client";

import {
    useMutation,
} from '@tanstack/react-query';
import { toast } from "sonner";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { useInvalidatePhotoQuery } from './index.query';
import { createPhotoAction, deletePhotoAction, updatePhotoAction } from '../actions/photo.action';
import { PhotoDTO, photoSchema } from '../schemas/photo.schema';

export const usePhotoCreateMutation = () => {
    const invalidatePhotoQuery = useInvalidatePhotoQuery()

    return useMutation({
        mutationFn: async (data: PhotoDTO) => {
            // Validation des données
            const validation = processAndValidateFormData(photoSchema, data,
                {
                    outputFormat: "formData",
                })

            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            // Appel de l'API avec l'action
            const result = await createPhotoAction(validation.data as FormData);

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la création de la photo");
            }

            return result.data!;
        },
        onSuccess: async () => {
            await invalidatePhotoQuery();
            toast.success("Photo ajoutée avec succès");
        },

        onError: async (error) => {
            toast.error("Erreur lors de l'ajout de la photo:", {
                description: error.message,
            });
        },
    });
};

export const usePhotoUpdateMutation = () => {
    const invalidatePhotoQuery = useInvalidatePhotoQuery()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: PhotoDTO }) => {
            // Validation des données
            const validation = processAndValidateFormData(photoSchema, data,
                {
                    outputFormat: "formData"

                });

            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            if (!id) {
                throw new Error("L'identifiant de la photo est requis.");
            }

            // Appel de l'API avec l'action
            const result = await updatePhotoAction(id, validation.data as FormData);

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la modification de la photo");
            }

            return result.data!;
        },
        onSuccess: async () => {
            await invalidatePhotoQuery();
            toast.success("Photo modifiée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur modification photo:", {
                description: error.message,
            });
        },
    });
};


export const useSupprimerPhotoMutation = () => {
    const invalidatePhotoQuery = useInvalidatePhotoQuery()
    return useMutation({
        mutationFn: async (id: string) => {
            if (!id) {
                throw new Error("L'identifiant de la photo est requis.");
            }
            const result = await deletePhotoAction(id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la suppression de la photo");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidatePhotoQuery();
            toast.success("Photo supprimée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur suppression photo:", {
                description: error.message,
            });
        },
    });
};