"use client";

import {
    useMutation,
} from '@tanstack/react-query';
import { toast } from "sonner";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { useInvalidateEvenementQuery } from './index.query';
import { EvenementDTO, EvenementUpdateDTO, evenementSchema, evenementUpdateSchema } from '../schemas/evenement.schema';
import { createEvenementAction, deleteEvenementAction, updateEvenementAction } from '../actions/evenement.action';

export const useEvenementCreateMutation = () => {
    const invalidateEvenementQuery = useInvalidateEvenementQuery()

    return useMutation({
        mutationFn: async (data: EvenementDTO) => {
            // Validation des données
            const validation = processAndValidateFormData(evenementSchema, data,
                {
                    outputFormat: "formData",
                })

            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            // Appel de l'API avec l'action
            const result = await createEvenementAction(validation.data as FormData);

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la création de l'actualité");
            }

            return result.data!;
        },
        onSuccess: async () => {
            await invalidateEvenementQuery();
            toast.success("Actualité ajoutée avec succès");
        },

        onError: async (error) => {
            toast.error("Erreur lors de l'ajout de l'actualité:", {
                description: error.message,
            });
        },
    });
};

export const useEvenementUpdateMutation = () => {
    const invalidateEvenementQuery = useInvalidateEvenementQuery()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: EvenementUpdateDTO }) => {
            // Validation des données
            const validation = processAndValidateFormData(evenementUpdateSchema, data,
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
            const result = await updateEvenementAction(id, validation.data as FormData);

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la modification de l'actualité");
            }

            return result.data!;
        },
        onSuccess: async () => {
            await invalidateEvenementQuery();
            toast.success("Actualité modifiée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur modification actualité:", {
                description: error.message,
            });
        },
    });
};

export const useEvenementSupprimerMutation = () => {
    const invalidateEvenementQuery = useInvalidateEvenementQuery()
    return useMutation({
        mutationFn: async (id: string) => {
            if (!id) {
                throw new Error("L'identifiant de l'actualité est requis.");
            }
            const result = await deleteEvenementAction(id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la suppression de l'actualité");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateEvenementQuery();
            toast.success("Actualité supprimée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur suppression actualité:", {
                description: error.message,
            });
        },
    });
};