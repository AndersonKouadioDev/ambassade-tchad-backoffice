import { z } from "zod";
import { UtilisateurRole, UtilisateurStatus, UtilisateurType } from "../types/utilisateur.type";

export const UtilisateursParamsSchema = z.object({
  type: z.nativeEnum(UtilisateurType).optional(),
  status: z.nativeEnum(UtilisateurStatus).optional(),
  role: z.nativeEnum(UtilisateurRole).optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  email: z.string().trim().optional(),
  phoneNumber: z.string().trim().min(1).optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
});

export type UtilisateursParamsDTO = z.infer<typeof UtilisateursParamsSchema>;