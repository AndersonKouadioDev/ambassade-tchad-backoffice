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
            const result = processAndValidateFormData(UtilisateurAddSchema, data,
                {
                    outputFormat: "object"

                })
            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            return ajouterUtilisateurAction(result.data as UtilisateurAddDTO)
        },
        onSuccess: async () => {
            await invalidateUtilisateurQuery();
            toast.success("Utilisateur ajouté avec succès");
        },

        onError: async (error) => {
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
            const result = processAndValidateFormData(UtilisateurUpdateSchema, data,
                {
                    outputFormat: "object"

                })
            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            return modifierProfilAction(result.data as UtilisateurUpdateDTO)
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
            const result = processAndValidateFormData(UtilisateurUpdateSchema, data,
                {
                    outputFormat: "object"

                })
            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            return modifierRoleAction(id, result.data as UtilisateurRoleDTO)
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
            return activerUtilisateurAction(id)
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
            return desactiverUtilisateurAction(id)
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
            return supprimerUtilisateurAction(id)
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