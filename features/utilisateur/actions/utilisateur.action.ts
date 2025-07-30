"use server"
import { utilisateurAPI } from "../apis/utilisateur.api";
import { UtilisateurAddUpdateDTO, UtilisateurAddUpdateSchema } from "../schema/utilisateur-add-update.schema";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { UtilisateursParamsDTO, UtilisateursParamsSchema } from "../schema/utilisateur-params.schema";

export const obtenirTousUtilisateursAction = (params: UtilisateursParamsDTO) => {
    const result = processAndValidateFormData(UtilisateursParamsSchema, params,
        {
            outputFormat: "object",
            validationStrategy: "partial-strict",

        })

    if (!result.success) {
        throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
    }

    return utilisateurAPI.obtenirTousUtilisateurs(result.data as UtilisateursParamsDTO);
}

export const obtenirUnUtilisateurAction = (id: string) => {
    if (!id) throw new Error("L'identifiant utilisateur est requis");
    return utilisateurAPI.obtenirUtilisateur(id);
}

export const obtenirStatsUtilisateursAction = () => {
    return utilisateurAPI.obtenirStatsUtilisateurs();
}

export const ajouterUtilisateurAction = async (data: UtilisateurAddUpdateDTO) => {
    const result = processAndValidateFormData(UtilisateurAddUpdateSchema, data,
        {
            outputFormat: "object"

        })
    if (!result.success) {
        return {
            success: false,
            message: result.errorsInString || "Une erreur est survenue lors de la validation des données.",
        }
    }
    try {
        const response = await utilisateurAPI.ajouterUtilisateur(data);
        return {
            success: true,
            message: "Utilisateur ajouté avec succès.",
            data: response,
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Une erreur est survenue lors de l'ajout de l'utilisateur.",
        }
    }
}

export const modifierUtilisateurAction = async (data: UtilisateurAddUpdateDTO) => {
    const result = processAndValidateFormData(UtilisateurAddUpdateSchema, data,
        {
            outputFormat: "object"

        })

    if (!result.success) {
        return {
            success: false,
            message: result.errorsInString || "Une erreur est survenue lors de la validation des données.",
        }
    }

    try {
        await utilisateurAPI.modifierUtilisateur(data);
        return {
            success: true,
            message: "Utilisateur modifié avec succès.",
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Une erreur est survenue lors de la modification de l'utilisateur.",
        }
    }
}

export const activerUtilisateurAction = async (id: string) => {
    try {
        await utilisateurAPI.activerUtilisateur(id);
        return {
            success: true,
            message: "Utilisateur activé avec succès.",
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Une erreur est survenue lors de l'activation de l'utilisateur.",
        }
    }
}

export const desactiverUtilisateurAction = async (id: string) => {
    try {
        await utilisateurAPI.desactiverUtilisateur(id);
        return {
            success: true,
            message: "Utilisateur desactivé avec succès.",
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Une erreur est survenue lors de la desactivation de l'utilisateur.",
        }
    }
}

export const supprimerUtilisateurAction = async (id: string) => {
    try {
        await utilisateurAPI.supprimerUtilisateur(id);
        return {
            success: true,
            message: "Utilisateur supprimé avec succès.",
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Une erreur est survenue lors de la suppression de l'utilisateur.",
        }
    }
}
