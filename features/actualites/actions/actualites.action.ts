import { api } from "@/lib/api";
import { IEvenement } from "@/types/evenement.types";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { IActualite } from "../types/actualites.type";
import { ActualiteDTO, actualiteSchema } from "../schemas/actualites.schema";
import { actualiteAPI } from "../api/actualites.api";

/**
 * Fonction pour créer un nouvel événement
 * @param formdata - Les données du formulaire à valider et envoyer
 * @returns Un objet indiquant le succès de l'opération et un message
 */
export async function createActualite(
    formdata: ActualiteDTO,
    formData?: FormData
): Promise<{ success: boolean; message: string }> {
    console.log('createActualite - Données reçues:', formdata);
    console.log('createActualite - FormData reçu:', formData);
    
    // Vérification des données du formulaire
    const result = processAndValidateFormData(actualiteSchema, formdata, {
        outputFormat: "object",
    });

    console.log('createActualite - Résultat validation:', result);

    if (!result.success) {
        console.error('createActualite - Erreurs de validation:', result.errorsInString);
        return {
            success: false,
            message: result.errorsInString || "Des erreurs de validation sont survenues.",
        };
    }

    try {
        console.log('createActualite - Appel API avec données:', result.data);
        console.log('createActualite - Appel API avec FormData:', formData);
        
        // Création de l'actualité
        const createdActualite = await actualiteAPI.create(result.data as ActualiteDTO, formData);
        
        console.log('createActualite - Actualite créé:', createdActualite);
        
        return {
            success: true,
            message: "Actualite créé avec succès.",
        };
    } catch (apiError: any) {
        console.error('createActualite - Erreur API:', apiError);
        console.error('createActualite - Détails erreur:', {
            message: apiError.message,
            status: apiError.status,
            data: apiError.data,
        });
        
        return {
            success: false,
            message: apiError.message || "Erreur lors de la création de l'événement.",
        };
    }
}


// Mise à jour d'un actualite existant
export async function updateActualite(
    id: string,
    formdata: ActualiteDTO
): Promise<{ success: boolean; message: string }> {
    // Vérification des données du formulaire
    const result = processAndValidateFormData(actualiteSchema, formdata, {
        outputFormat: "object",
    });

    if (!result.success) {
        return {
            success: false,
            message: result.errorsInString || "Des erreurs de validation sont survenues.",
        };
    }

    // mise à jour de l'actualite
    try {
        const updated = await actualiteAPI.update(id, result.data as ActualiteDTO);
        console.log("Actualite mis à jour :", updated);
        return {
            success: true,
            message: "Événement mis à jour avec succès.",
        };
    } catch (apiError: any) {
        return {
            success: false,
            message: apiError.message || "Erreur lors de la mise à jour de l'événement.",
        };
    }
}
// Suppression d'un actualite
export async function deleteActualite(
    id: string
): Promise<{ success: boolean; message: string }> {
    // Vérification de l'ID de l'actualite et verification de espace dans id
    if (!id || id.trim() === "") {
        return {
            success: false,
            message: "ID de l'actualite requis.",
        };
    }
    // Vérification de l'existence de l'événement
    try {
        // Appel à l'API pour supprimer l'événement
        await actualiteAPI.delete(id);
        return {
            success: true,
            message: "Actualite supprimé avec succès.",
        };
    } catch (apiError: any) {
        return {
            success: false,
            message: apiError.message || "Erreur lors de la suppression de l'actualite.",
        };
    }
}

