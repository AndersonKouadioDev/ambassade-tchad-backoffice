import {
    useMutation,
} from '@tanstack/react-query';
import {
    createDemandRequestAction,
    createDemandAdminRequestAction,
    updateDemandStatusAction,
} from '../actions/demande.action';
import { useInvalidateDemandeQuery } from './index.query';
import { toast } from "sonner";
import { DemandCreateDTO, DemandCreateSchema, DemandUpdateDTO, DemandUpdateSchema } from '../schema/demande.schema';
import { processAndValidateFormData } from 'ak-zod-form-kit';

export const useCreateDemandRequestMutation = () => {
    const invalidateDemandeQuery = useInvalidateDemandeQuery();

    return useMutation({
        mutationFn: async (data: DemandCreateDTO) => {
            const result = processAndValidateFormData(DemandCreateSchema, data, {
                outputFormat: "formData"
            });
            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }
            return createDemandRequestAction(result.data as FormData);

        },
        onSuccess: async () => {
            await invalidateDemandeQuery();
            toast.success("Demande créée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur lors de la création de la demande:", {
                description: error.message,
            });
        },
    });
};

export const useCreateDemandAdminRequestMutation = () => {
    const invalidateDemandeQuery = useInvalidateDemandeQuery();

    return useMutation({
        mutationFn: async ({ userId, data }: { userId: string, data: DemandCreateDTO }) => {
            if (!userId) {
                throw new Error("L'identifiant de l'utilisateur est requis pour la création admin.");
            }

            const result = processAndValidateFormData(DemandCreateSchema, data, {
                outputFormat: "formData"
            });

            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            return createDemandAdminRequestAction(userId, result.data as FormData);
        },
        onSuccess: async () => {
            await invalidateDemandeQuery();
            toast.success("Demande créée par l'administrateur avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur lors de la création de la demande par l'administrateur:", {
                description: error.message,
            });
        },
    });
};

export const useUpdateDemandStatusMutation = () => {
    const invalidateDemandeQuery = useInvalidateDemandeQuery();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: DemandUpdateDTO }) => {
            if (!id) {
                throw new Error("L'identifiant de la demande est requis pour la mise à jour du statut.");
            }

            const result = processAndValidateFormData(DemandUpdateSchema, data, {
                outputFormat: "object"
            });

            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            return updateDemandStatusAction(id, result.data as DemandUpdateDTO);
        },
        onSuccess: async () => {
            await invalidateDemandeQuery();
            toast.success("Statut de la demande mis à jour avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur lors de la mise à jour du statut de la demande:", {
                description: error.message,
            });
        },
    });
};