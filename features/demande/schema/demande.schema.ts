import { z } from 'zod';

export const DemandeAddSchema = z.object({
  name: z.string({ message: "Le prénom est requis" })
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100, "Le prénom ne doit pas dépasser 100 caractères")
    .trim(),
});

export type DemandeAddDTO = z.infer<typeof DemandeAddSchema>;



export const DemandeUpdateSchema = DemandeAddSchema.partial();
export type DemandeUpdateDTO = z.infer<typeof DemandeUpdateSchema>;


export const DemandeRoleSchema = DemandeAddSchema.pick({ name: true });
export type DemandeRoleDTO = z.infer<typeof DemandeRoleSchema>;