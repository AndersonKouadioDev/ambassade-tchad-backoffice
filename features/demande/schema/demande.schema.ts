import { z } from 'zod';

export const DemandeAddSchema = z.object({
  firstName: z.string({ message: "Le prénom est requis" })
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100, "Le prénom ne doit pas dépasser 100 caractères")
    .trim(),

  lastName: z.string({ message: "Le nom est requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères")
    .trim(),

  email: z.string({ message: "L'email est requis" })
    .email("L'email doit être une adresse valide")
    .max(100, "L'email ne doit pas dépasser 100 caractères")
    .toLowerCase()
    .trim(),

  phoneNumber: z.string({ message: "Le numéro de téléphone est requis" })
    .max(20, "Le numéro de téléphone ne doit pas dépasser 20 caractères")
    .regex(/^\+?[\d\s\-]+$/, "Numéro de téléphone invalide")
    .trim(),

  role: z.enum(['AGENT', 'CHEF_SERVICE', 'CONSUL', 'ADMIN'], { message: "Le rôle est requis" })
});

export type DemandeAddDTO = z.infer<typeof DemandeAddSchema>;



export const DemandeUpdateSchema = DemandeAddSchema.partial();
export type DemandeUpdateDTO = z.infer<typeof DemandeUpdateSchema>;


export const DemandeRoleSchema = DemandeAddSchema.pick({ role: true });
export type DemandeRoleDTO = z.infer<typeof DemandeRoleSchema>;