import { z } from 'zod';

export const DocumentCreateSchema = z.object({
  fileName: z.string().min(1, "Le nom du fichier est obligatoire."),
  mimeType: z.string().min(1, "Le type MIME est obligatoire."),
  filePath: z.string().min(1, "Le chemin du fichier est obligatoire."),
  fileSizeKB: z.number().int().min(0, "La taille du fichier doit être un entier positif.").max(Number.MAX_SAFE_INTEGER, "La taille du fichier est trop grande."),
  uploaderId: z.string().min(1, "L'ID de l'uploader est obligatoire."),
});

export type DocumentCreateDTO = z.infer<typeof DocumentCreateSchema>;