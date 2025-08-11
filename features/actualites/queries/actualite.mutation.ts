"use client";

import {
    useMutation,
} from '@tanstack/react-query';
import { toast } from "sonner";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { useInvalidateActualiteQuery } from './index.query';
import { ActualiteCreateDTO, ActualiteUpdateDTO, actualiteCreateSchema, actualiteUpdateSchema } from '../schemas/actualites.schema';
import { createActualiteAction, deleteActualiteAction, updateActualiteAction } from '../actions/actualites.action';

export const useActualiteCreateMutation = () => {
    const invalidateActualiteQuery = useInvalidateActualiteQuery()

    return useMutation({
        mutationFn: async (data: ActualiteCreateDTO) => {
            // Validation des données
            const validation = processAndValidateFormData(actualiteCreateSchema, data,
                {
                    outputFormat: "formData",
                })

            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            // Appel de l'API avec l'action
            const result = await createActualiteAction(validation.data as FormData);

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la création de l'actualité");
            }

            return result.data!;
        },
        onSuccess: async () => {
            await invalidateActualiteQuery();
            toast.success("Actualité ajoutée avec succès");
        },

        onError: async (error) => {
            toast.error("Erreur lors de l'ajout de l'actualité:", {
                description: error.message,
            });
        },
    });
};

export const useActualiteUpdateMutation = () => {
    const invalidateActualiteQuery = useInvalidateActualiteQuery()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: ActualiteUpdateDTO }) => {
            // Validation des données
            const validation = processAndValidateFormData(actualiteUpdateSchema, data,
                {
                    outputFormat: "formData"

                });

            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            if (!id) {
                throw new Error("L'identifiant de l'actualité est requis.");
            }

            // Appel de l'API avec l'action
            const result = await updateActualiteAction(id, validation.data as FormData);

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la modification de l'actualité");
            }

            return result.data!;
        },
        onSuccess: async () => {
            await invalidateActualiteQuery();
            toast.success("Actualité modifiée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur modification actualité:", {
                description: error.message,
            });
        },
    });
};


export const useSupprimerActualiteMutation = () => {
    const invalidateActualiteQuery = useInvalidateActualiteQuery()
    return useMutation({
        mutationFn: async (id: string) => {
            if (!id) {
                throw new Error("L'identifiant de l'actualité est requis.");
            }
            const result = await deleteActualiteAction(id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la suppression de l'actualité");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateActualiteQuery();
            toast.success("Actualité supprimée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur suppression actualité:", {
                description: error.message,
            });
        },
    });
};