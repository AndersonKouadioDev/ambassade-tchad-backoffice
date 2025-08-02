import { z } from 'zod';
import { ServiceType } from '@/features/service/types/service.type';
import { DocumentJustificationType } from '../types/carte-consulaire.type';


export const CarteConsulaireDetailsSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).default(ServiceType.CONSULAR_CARD).optional(),
  personFirstName: z.string({ message: 'Le prénom est obligatoire.' })
    .min(1, { message: 'Le prénom est obligatoire.' })
    .max(255, { message: 'Le prénom ne doit pas dépasser 255 caractères.' }),
  personLastName: z.string({ message: 'Le nom est obligatoire.' })
    .min(1, { message: 'Le nom est obligatoire.' })
    .max(255, { message: 'Le nom ne doit pas dépasser 255 caractères.' }),
  personBirthDate: z.string({ message: 'La date de naissance est obligatoire.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La date de naissance doit être une date valide.' })
    .min(1, { message: 'La date de naissance est obligatoire.' }),
  personBirthPlace: z.string({ message: 'Le lieu de naissance est obligatoire.' })
    .min(1, { message: 'Le lieu de naissance est obligatoire.' })
    .max(255, { message: 'Le lieu de naissance ne doit pas dépasser 255 caractères.' }),
  personProfession: z.string({ message: 'La profession ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'La profession ne doit pas dépasser 255 caractères.' })
    .optional(),
  personNationality: z.string({ message: 'La nationalité est obligatoire.' })
    .min(1, { message: 'La nationalité est obligatoire.' })
    .max(255, { message: 'La nationalité ne doit pas dépasser 255 caractères.' }),
  personDomicile: z.string({ message: 'Le domicile ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'Le domicile ne doit pas dépasser 255 caractères.' })
    .optional(),
  personAddressInOriginCountry: z.string({ message: 'Le type de lien au pays d\'origine est invalide.' })
    .optional(),
  fatherFullName: z.string({ message: 'Le nom du père ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'Le nom du père ne doit pas dépasser 255 caractères.' })
    .optional(),
  motherFullName: z.string({ message: 'Le nom de la mère ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'Le nom de la mère ne doit pas dépasser 255 caractères.' })
    .optional(),
  justificationDocumentType: z.nativeEnum(DocumentJustificationType, {
    message: 'Le type de document justificatif est invalide.',
  }).optional(),
  justificationDocumentNumber: z.string({ message: 'Le numéro du document ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'Le numéro du document ne doit pas dépasser 255 caractères.' })
    .optional(),
});

export type CarteConsulaireDetailsDTO = z.infer<typeof CarteConsulaireDetailsSchema>;