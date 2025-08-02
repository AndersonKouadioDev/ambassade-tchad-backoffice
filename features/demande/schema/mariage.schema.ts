import { z } from 'zod';
import { ServiceType } from '@/features/service/types/service.type';

export const MariageDetailsSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).default(ServiceType.MARRIAGE_CAPACITY_ACT).optional(),
  husbandFirstName: z.string({ message: "Le prénom de l'époux est obligatoire." })
    .min(1, { message: "Le prénom de l'époux est obligatoire." })
    .max(255, { message: "Le prénom de l'époux ne doit pas dépasser 255 caractères." }),
  husbandLastName: z.string({ message: "Le nom de l'époux est obligatoire." })
    .min(1, { message: "Le nom de l'époux est obligatoire." })
    .max(255, { message: "Le nom de l'époux ne doit pas dépasser 255 caractères." }),
  husbandBirthDate: z.string({ message: "La date de naissance de l'époux est obligatoire." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "La date de naissance de l'époux doit être au format YYYY-MM-DD." })
    .min(1, { message: "La date de naissance de l'époux est obligatoire." }),
  husbandBirthPlace: z.string({ message: "Le lieu de naissance de l'époux est obligatoire." })
    .min(1, { message: "Le lieu de naissance de l'époux est obligatoire." })
    .max(255, { message: "Le lieu de naissance de l'époux ne doit pas dépasser 255 caractères." }),
  husbandNationality: z.string({ message: "La nationalité de l'époux est obligatoire." })
    .min(1, { message: "La nationalité de l'époux est obligatoire." })
    .max(255, { message: "La nationalité de l'époux ne doit pas dépasser 255 caractères." }),
  husbandDomicile: z.string({ message: "Le domicile de l'époux ne doit pas dépasser 255 caractères." })
    .max(255, { message: "Le domicile de l'époux ne doit pas dépasser 255 caractères." })
    .optional(),
  wifeFirstName: z.string({ message: "Le prénom de l'épouse est obligatoire." })
    .min(1, { message: "Le prénom de l'épouse est obligatoire." })
    .max(255, { message: "Le prénom de l'épouse ne doit pas dépasser 255 caractères." }),
  wifeLastName: z.string({ message: "Le nom de l'épouse est obligatoire." })
    .min(1, { message: "Le nom de l'épouse est obligatoire." })
    .max(255, { message: "Le nom de l'épouse ne doit pas dépasser 255 caractères." }),
  wifeBirthDate: z.string({ message: "La date de naissance de l'épouse est obligatoire." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "La date de naissance de l'épouse doit être au format YYYY-MM-DD." })
    .min(1, { message: "La date de naissance de l'épouse est obligatoire." }),
  wifeBirthPlace: z.string({ message: "Le lieu de naissance de l'épouse est obligatoire." })
    .min(1, { message: "Le lieu de naissance de l'épouse est obligatoire." })
    .max(255, { message: "Le lieu de naissance de l'épouse ne doit pas dépasser 255 caractères." }),
  wifeNationality: z.string({ message: "La nationalité de l'épouse est obligatoire." })
    .min(1, { message: "La nationalité de l'épouse est obligatoire." })
    .max(255, { message: "La nationalité de l'épouse ne doit pas dépasser 255 caractères." }),
  wifeDomicile: z.string({ message: "Le domicile de l'épouse ne doit pas dépasser 255 caractères." })
    .max(255, { message: "Le domicile de l'épouse ne doit pas dépasser 255 caractères." })
    .optional(),
});

export type MariageDetailsDTO = z.infer<typeof MariageDetailsSchema>;