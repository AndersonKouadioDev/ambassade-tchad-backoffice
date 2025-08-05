"use server";

import { ActionResponse, PaginatedResponse } from "@/types";
import { utilisateurAPI } from "../apis/utilisateur.api";
import { UtilisateurAddDTO, UtilisateurRoleDTO, UtilisateurUpdateDTO } from "../schema/utilisateur.schema";
import { IUtilisateur, IUtilisateurActiveDesactiveDeleteResponse, IUtilisateursParams, IUtilisateurStatsResponse } from "../types/utilisateur.type";
import { handleServerActionError } from "@/utils/handleServerActionError";

export const obtenirTousUtilisateursAction = async (params: IUtilisateursParams): Promise<ActionResponse<PaginatedResponse<IUtilisateur>>> => {
    try {
        const data = await utilisateurAPI.obtenirTousUtilisateurs(params);
        return {
            success: true,
            data: data,
            message: "Utilisateurs obtenus avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des utilisateurs");
    }
}

export const obtenirUnUtilisateurAction = async (id: string): Promise<ActionResponse<IUtilisateur>> => {
    try {
        const data = await utilisateurAPI.obtenirUtilisateur(id);
        return {
            success: true,
            data: data,
            message: "Utilisateur obtenu avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de l'utilisateur");
    }
}

export const obtenirStatsUtilisateursAction = async (type: "personnel" | "demandeur"): Promise<ActionResponse<IUtilisateurStatsResponse>> => {
    try {
        const data = await utilisateurAPI.obtenirStatsUtilisateurs(type);
        return {
            success: true,
            data: data,
            message: "Stats utilisateurs obtenues avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des stats utilisateurs");
    }
}

export const ajouterUtilisateurAction = async (formdata: UtilisateurAddDTO): Promise<ActionResponse<IUtilisateur>> => {
    try {
        const data = await utilisateurAPI.ajouterUtilisateur(formdata);
        return {
            success: true,
            data: data,
            message: "Utilisateur ajoute avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de l'ajout de l'utilisateur");
    }
}

export const modifierProfilAction = async (formdata: UtilisateurUpdateDTO): Promise<ActionResponse<IUtilisateur>> => {
    try {
        const data = await utilisateurAPI.modifierProfil(formdata);
        return {
            success: true,
            data: data,
            message: "Profil modifie avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la modification du profil");
    }
}

export const modifierRoleAction = async (id: string, formdata: UtilisateurRoleDTO): Promise<ActionResponse<IUtilisateur>> => {
    try {
        const data = await utilisateurAPI.modifierRole(id, formdata);
        return {
            success: true,
            data: data,
            message: "Role modifie avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la modification du role");
    }
}

export const activerUtilisateurAction = async (id: string): Promise<ActionResponse<IUtilisateurActiveDesactiveDeleteResponse>> => {
    try {
        const data = await utilisateurAPI.activerUtilisateur(id);
        return {
            success: true,
            data: data,
            message: "Utilisateur active avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de l'activation de l'utilisateur");
    }
}

export const desactiverUtilisateurAction = async (id: string): Promise<ActionResponse<IUtilisateurActiveDesactiveDeleteResponse>> => {
    try {
        const data = await utilisateurAPI.desactiverUtilisateur(id);
        return {
            success: true,
            data: data,
            message: "Utilisateur desactive avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la desactivation de l'utilisateur");
    }
}

export const supprimerUtilisateurAction = async (id: string): Promise<ActionResponse<IUtilisateurActiveDesactiveDeleteResponse>> => {
    try {
        const data = await utilisateurAPI.supprimerUtilisateur(id);
        return {
            success: true,
            data: data,
            message: "Utilisateur supprime avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la suppression de l'utilisateur");
    }
}
