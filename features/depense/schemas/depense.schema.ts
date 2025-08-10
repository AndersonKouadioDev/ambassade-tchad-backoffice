import { z } from "zod";

// Schéma pour la catégorie de dépense
export const categorieDepenseSchema = z.object({
    id: z.string().min(1, "L'identifiant de la catégorie est requis"),
    name: z.string().min(1, "Le nom de la catégorie est requis"),
    description: z.string().optional(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type ICategorieDepenseDTO = z.infer<typeof categorieDepenseSchema>;

// Schéma pour la création d'une catégorie de dépense
export const categorieDepenseCreateSchema = z.object({
    name: z.string().min(1, "Le nom de la catégorie est requis"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});

export type ICategorieDepenseCreateDTO = z.infer<typeof categorieDepenseCreateSchema>;

// Schéma pour la mise à jour d'une catégorie de dépense
export const categorieDepenseUpdateSchema = categorieDepenseCreateSchema.partial();
export type ICategorieDepenseUpdateDTO = z.infer<typeof categorieDepenseUpdateSchema>;

// Schéma pour la création d'une dépense
export const depenseCreateSchema = z.object({
    amount: z.number().positive("Le montant doit être positif"),
    description: z.string().optional(),
    categoryName: z.string().min(1, "Le nom de la catégorie est requis"),
    expenseDate: z.coerce.date(),
});

export type IDepenseCreateDTO = z.infer<typeof depenseCreateSchema>;

// Schéma pour la mise à jour d'une dépense
export const depenseUpdateSchema = z.object({
    amount: z.coerce.number().positive("Le montant doit être positif").optional(),
    description: z.string().optional(),
    categoryName: z.string().min(1, "Le nom de la catégorie est requis").optional(),
    expenseDate: z.coerce.date().optional(),
});
export type IDepenseUpdateDTO = z.infer<typeof depenseUpdateSchema>;

// Schéma pour la validation des paramètres de recherche de dépenses
export const depensesParamsSchema = z.object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(100).optional(),
    category: z.string().optional(),
    amount: z.number().positive().optional(),
    expenseDate: z.string().optional(),
});

export type IDepensesParamsDTO = z.infer<typeof depensesParamsSchema>;

// Schéma pour la réponse complète d'une dépense (avec relations)
export const depenseResponseSchema = z.object({
    id: z.string(),
    amount: z.coerce.number(),
    description: z.string().optional(),
    categoryId: z.string(),
    recordedById: z.string(),
    category: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        isActive: z.boolean(),
    }),
    recordedBy: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
    }).optional(),
    expenseDate: z.coerce.date(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type IDepenseResponseDTO = z.infer<typeof depenseResponseSchema>;

