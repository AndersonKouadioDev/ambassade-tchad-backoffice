import { z } from 'zod';

export const UtilisateurAddUpdateSchema = z.object({
  prenom: z.string({ message: "Le prénom est requis" })
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100, "Le prénom ne doit pas dépasser 100 caractères")
    .trim()
    .optional(),

  nom: z.string({ message: "Le nom est requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères")
    .trim()
    .optional(),

  email: z.string({ message: "L'email est requis" })
    .email("L'email doit être une adresse valide")
    .max(100, "L'email ne doit pas dépasser 100 caractères")
    .toLowerCase()
    .trim()
    .optional(),

  telephone: z.string({ message: "Le numéro de téléphone est requis" })
    .max(20, "Le numéro de téléphone ne doit pas dépasser 20 caractères")
    .regex(/^\+?[\d\s\-]+$/, "Numéro de téléphone invalide")
    .trim()
    .optional(),

  role: z.enum(['AGENT', 'CHEF_SERVICE', 'CONSUL', 'ADMIN'], { message: "Le rôle est requis" })
    .optional()
});


export type UtilisateurAddUpdateDTO = z.infer<typeof UtilisateurAddUpdateSchema>;