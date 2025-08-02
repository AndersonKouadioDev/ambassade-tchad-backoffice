import { z } from 'zod';
import { ServiceType } from '@/features/service/types/service.type';
import { PassportType, VisaType } from '@/features/demande/types/visa.type';
import { Genre, SituationMatrimoniale } from '@/features/demande/types/demande.type';

export const VisaRequestDetailsSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).default(ServiceType.VISA).optional(),
  personFirstName: z.string({ message: 'Le prénom est obligatoire.' })
    .min(1, { message: 'Le prénom est obligatoire.' })
    .max(255, { message: 'Le prénom ne doit pas dépasser 255 caractères.' }),
  personLastName: z.string({ message: 'Le nom est obligatoire.' })
    .min(1, { message: 'Le nom est obligatoire.' })
    .max(255, { message: 'Le nom ne doit pas dépasser 255 caractères.' })
    .transform(value => value.trim()),
  personGender: z.nativeEnum(Genre, { message: 'Le genre est invalide.' }),
  personNationality: z.string({ message: 'La nationalité est obligatoire.' })
    .min(1, { message: 'La nationalité est obligatoire.' })
    .max(255, { message: 'La nationalité ne doit pas dépasser 255 caractères.' })
    .transform(value => value.trim()),
  personBirthDate: z.string({ message: 'La date de naissance est obligatoire.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La date de naissance doit être une date ISO valide (YYYY-MM-DD).' })
    .min(1, { message: 'La date de naissance est obligatoire.' }),
  personBirthPlace: z.string({ message: 'Le lieu de naissance est obligatoire.' })
    .min(1, { message: 'Le lieu de naissance est obligatoire.' })
    .max(255, { message: 'Le lieu de naissance ne doit pas dépasser 255 caractères.' })
    .transform(value => value.trim()),
  personMaritalStatus: z.nativeEnum(SituationMatrimoniale, { message: 'Le statut matrimonial est invalide.' }),
  passportType: z.nativeEnum(PassportType, { message: 'Le type de passeport est invalide.' }),
  passportNumber: z.string({ message: 'Le numéro du passeport est obligatoire.' })
    .min(1, { message: 'Le numéro du passeport est obligatoire.' })
    .max(255, { message: 'Le numéro du passeport ne doit pas dépasser 255 caractères.' })
    .transform(value => value.trim()),
  passportIssuedBy: z.string({ message: 'Le pays de délivrance du passeport est obligatoire.' })
    .min(1, { message: 'Le pays de délivrance du passeport est obligatoire.' })
    .max(255, { message: 'Le pays de délivrance du passeport ne doit pas dépasser 255 caractères.' })
    .transform(value => value.trim()),
  passportIssueDate: z.string({ message: 'La date de délivrance du passeport est obligatoire.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La date de délivrance du passeport doit être une date ISO valide (YYYY-MM-DD).' })
    .min(1, { message: 'La date de délivrance du passeport est obligatoire.' }),
  passportExpirationDate: z.string({ message: 'La date d\'expiration du passeport est obligatoire.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La date d\'expiration du passeport doit être une date ISO valide (YYYY-MM-DD).' })
    .min(1, { message: 'La date d\'expiration du passeport est obligatoire.' }),
  profession: z.string({ message: 'La profession ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'La profession ne doit pas dépasser 255 caractères.' })
    .optional(),
  employerAddress: z.string({ message: 'L\'adresse de l\'employeur ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'L\'adresse de l\'employeur ne doit pas dépasser 255 caractères.' })
    .transform(value => value.trim())
    .optional(),
  employerPhoneNumber: z.string({ message: 'Le numéro de téléphone de l\'employeur ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'Le numéro de téléphone de l\'employeur ne doit pas dépasser 255 caractères.' })
    .optional(),
  durationMonths: z.number({ message: 'La durée du séjour doit être un entier.' })
    .int({ message: 'La durée du séjour doit être un entier.' })
    .min(1, { message: 'La durée du séjour est obligatoire.' }),
  destinationState: z.string({ message: 'La ville de destination ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'La ville de destination ne doit pas dépasser 255 caractères.' })
    .optional(),
  visaType: z.nativeEnum(VisaType, { message: 'Le type de visa est invalide.' }).optional(),
});

export type VisaRequestDetailsDto = z.infer<typeof VisaRequestDetailsSchema>;