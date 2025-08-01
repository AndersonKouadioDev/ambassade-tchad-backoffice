"use server"
import { utilisateurAPI } from "../apis/utilisateur.api";
import { UtilisateurAddDTO, UtilisateurAddSchema, UtilisateurRoleDTO, UtilisateurRoleSchema, UtilisateurUpdateDTO, UtilisateurUpdateSchema } from "../schema/utilisateur.schema";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { IUtilisateursParams } from "../types/utilisateur.type";

export const obtenirTousUtilisateursAction = (params: IUtilisateursParams) => {
    return utilisateurAPI.obtenirTousUtilisateurs(params);
}

export const obtenirUnUtilisateurAction = (id: string) => {
    if (!id) throw new Error("L'identifiant utilisateur est requis");
    return utilisateurAPI.obtenirUtilisateur(id);
}

export const obtenirStatsUtilisateursAction = (type: "personnel" | "demandeur") => {
    return utilisateurAPI.obtenirStatsUtilisateurs(type);
}

export const ajouterUtilisateurAction = async (data: UtilisateurAddDTO) => {

    const result = processAndValidateFormData(UtilisateurAddSchema, data,
        {
            outputFormat: "object"

        })
    if (!result.success) {
        throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
    }

    return await utilisateurAPI.ajouterUtilisateur(data);
}

export const modifierProfilAction = async (data: UtilisateurUpdateDTO) => {
    const result = processAndValidateFormData(UtilisateurUpdateSchema, data,
        {
            outputFormat: "object"

        })

    if (!result.success) {
        throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
    }

    return await utilisateurAPI.modifierProfil(data);
}

export const modifierRoleAction = async (id: string, data: UtilisateurRoleDTO) => {
    const result = processAndValidateFormData(UtilisateurRoleSchema, data,
        {
            outputFormat: "object"

        })

    if (!result.success) {
        throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
    }

    return await utilisateurAPI.modifierRole(id, data);
}

export const activerUtilisateurAction = async (id: string) => {
    return await utilisateurAPI.activerUtilisateur(id);
}

export const desactiverUtilisateurAction = async (id: string) => {
    return await utilisateurAPI.desactiverUtilisateur(id);
}

export const supprimerUtilisateurAction = async (id: string) => {
    return await utilisateurAPI.supprimerUtilisateur(id);
}
