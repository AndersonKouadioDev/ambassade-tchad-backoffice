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


export const useAjouterUtilisateurMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery()

    return useMutation({
        mutationFn: async (data: UtilisateurAddDTO) => ajouterUtilisateurAction(data),
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
        mutationFn: async (data: UtilisateurUpdateDTO) => modifierProfilAction(data),
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
        mutationFn: async ({ id, data }: { id: string, data: UtilisateurRoleDTO }) => modifierRoleAction(id, data),
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
        mutationFn: async (id: string) => activerUtilisateurAction(id),
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
        mutationFn: async (id: string) => desactiverUtilisateurAction(id),
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
        mutationFn: async (id: string) => supprimerUtilisateurAction(id),
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