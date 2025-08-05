"use client";

import {
    useMutation,
} from '@tanstack/react-query';
import {
    ajouterUtilisateurAction,
    modifierProfilAction,
    modifierRoleAction,
    activerUtilisateurAction,
    desactiverUtilisateurAction,
    supprimerUtilisateurAction,
} from '../actions/utilisateur.action';
import { useInvalidateUtilisateurQuery } from './index.query';
import { UtilisateurAddDTO, UtilisateurRoleDTO, UtilisateurUpdateDTO } from '../schema/utilisateur.schema';
import { toast } from "sonner";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { UtilisateurAddSchema, UtilisateurUpdateSchema } from "../schema/utilisateur.schema";

export const useAjouterUtilisateurMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery()

    return useMutation({
        mutationFn: async (data: UtilisateurAddDTO) => {
            // Validation des données
            const validation = processAndValidateFormData(UtilisateurAddSchema, data,
                {
                    outputFormat: "object",
                    transformations: {
                        firstName: (value) => value.trim(),
                        lastName: (value) => value.trim(),
                        email: (value) => value.trim().toLowerCase(),
                        phoneNumber: (value) => value.trim(),
                    },
                })

            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            // Appel de l'API avec l'action
            const result = await ajouterUtilisateurAction(validation.data as UtilisateurAddDTO);

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de l'ajout de l'utilisateur");
            }

            return result.data!;
        },
        onSuccess: async () => {
            await invalidateUtilisateurQuery();
            toast.success("Utilisateur ajouté avec succès");
        },

        onError: async (error) => {
            console.log("error query", error)
            toast.error("Erreur lors de l'ajout de l'utilisateur:", {
                description: error.message,
            });
        },
    });
};

export const useModifierProfilMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery()
    return useMutation({
        mutationFn: async (data: UtilisateurUpdateDTO) => {
            // Validation des données
            const validation = processAndValidateFormData(UtilisateurUpdateSchema, data,
                {
                    outputFormat: "object"

                })
            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            const result = await modifierProfilAction(validation.data as UtilisateurUpdateDTO)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la modification de l'utilisateur");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateUtilisateurQuery();
            toast.success("Utilisateur modifié avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur modification utilisateur:", {
                description: error.message,
            });
        },
    });
};

export const useModifierRoleMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: UtilisateurRoleDTO }) => {
            // Validation des données
            const validation = processAndValidateFormData(UtilisateurUpdateSchema, data,
                {
                    outputFormat: "object"

                })
            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            const result = await modifierRoleAction(id, validation.data as UtilisateurRoleDTO)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la modification du role");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateUtilisateurQuery();
            toast.success("Role modifié avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur modification role:", {
                description: error.message,
            });
        },
    });
};

export const useActiverUtilisateurMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery()
    return useMutation({
        mutationFn: async (id: string) => {
            if (!id) {
                throw new Error("L'identifiant de l'utilisateur est requis.");
            }
            const result = await activerUtilisateurAction(id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de l'activation de l'utilisateur");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateUtilisateurQuery();
            toast.success("Utilisateur activé avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur activation utilisateur:", {
                description: error.message,
            });
        },
    });
};

export const useDesactiverUtilisateurMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery()
    return useMutation({
        mutationFn: async (id: string) => {
            if (!id) {
                throw new Error("L'identifiant de l'utilisateur est requis.");
            }
            const result = await desactiverUtilisateurAction(id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la desactivation de l'utilisateur");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateUtilisateurQuery();
            toast.success("Utilisateur desactivé avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur deactivation utilisateur:", {
                description: error.message,
            });
        },
    });
};

export const useSupprimerUtilisateurMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery()
    return useMutation({
        mutationFn: async (id: string) => {
            if (!id) {
                throw new Error("L'identifiant de l'utilisateur est requis.");
            }
            const result = await supprimerUtilisateurAction(id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la suppression de l'utilisateur");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateUtilisateurQuery();
            toast.success("Utilisateur supprimé avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur suppression utilisateur:", {
                description: error.message,
            });
        },
    });
};