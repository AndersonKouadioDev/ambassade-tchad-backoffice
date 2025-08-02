import { z } from 'zod';
import { ServiceType } from '@/features/service/types/service.type';
import { PaysParentType } from '../types/certificat-nationalite.type';

export const CertificatNationaliteDetailsSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).default(ServiceType.NATIONALITY_CERTIFICATE).optional(),
  applicantFirstName: z.string({ message: "Le prénom est obligatoire." })
    .min(1, { message: "Le prénom est obligatoire." })
    .max(255, { message: "Le prénom ne doit pas dépasser 255 caractères." }),
  applicantLastName: z.string({ message: "Le nom est obligatoire." })
    .min(1, { message: "Le nom est obligatoire." })
    .max(255, { message: "Le nom ne doit pas dépasser 255 caractères." }),
  applicantBirthDate: z.string({ message: "La date de naissance est obligatoire." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "La date de naissance doit être une date valide." })
    .min(1, { message: "La date de naissance est obligatoire." }),
  applicantBirthPlace: z.string({ message: "Le lieu de naissance est obligatoire." })
    .min(1, { message: "Le lieu de naissance est obligatoire." })
    .max(255, { message: "Le lieu de naissance ne doit pas dépasser 255 caractères." }),
  applicantNationality: z.string({ message: "La nationalité est obligatoire." })
    .min(1, { message: "La nationalité est obligatoire." })
    .max(255, { message: "La nationalité ne doit pas dépasser 255 caractères." }),
  originCountryParentFirstName: z.string({ message: "Le prénom du parent est obligatoire." })
    .min(1, { message: "Le prénom du parent est obligatoire." })
    .max(255, { message: "Le prénom du parent ne doit pas dépasser 255 caractères." }),
  originCountryParentLastName: z.string({ message: "Le nom du parent est obligatoire." })
    .min(1, { message: "Le nom du parent est obligatoire." })
    .max(255, { message: "Le nom du parent ne doit pas dépasser 255 caractères." }),
  originCountryParentRelationship: z.nativeEnum(PaysParentType, { message: "le type de relation est invalide." })
    .optional(),
});

export type CertificatNationaliteDetailsDTO = z.infer<typeof CertificatNationaliteDetailsSchema>;