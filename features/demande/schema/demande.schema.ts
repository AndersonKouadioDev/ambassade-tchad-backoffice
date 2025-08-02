import { z } from 'zod';
import { ServiceType } from '@/features/service/types/service.type';
import { VisaRequestDetailsSchema } from './visa.schema';
import { ActeNaissanceDetailsSchema } from './acte-naissance.schema';
import { CarteConsulaireDetailsSchema } from './carte-consulaire.schema';
import { MariageDetailsSchema } from './mariage.schema';
import { DecesDetailsSchema } from './deces.schema';
import { ProcurationDetailsSchema } from './procuration.schema';
import { CertificatNationaliteDetailsSchema } from './certificat-nationalite.schema';
import { LaissezPasserDetailsSchema } from './laissez-passer.schema';
import { DemandeStatus } from '../types/demande.type';


export const DemandCreateSchema = z.object({
  serviceType: z.nativeEnum(ServiceType, { message: 'Type de service invalide.' }),
  visaDetails: VisaRequestDetailsSchema.optional(),
  birthActDetails: ActeNaissanceDetailsSchema.optional(),
  consularCardDetails: CarteConsulaireDetailsSchema.optional(),
  laissezPasserDetails: LaissezPasserDetailsSchema.optional(),
  marriageCapacityActDetails: MariageDetailsSchema.optional(),
  deathActDetails: DecesDetailsSchema.optional(),
  powerOfAttorneyDetails: ProcurationDetailsSchema.optional(),
  nationalityCertificateDetails: CertificatNationaliteDetailsSchema.optional(),

  contactPhoneNumber: z.string({ message: 'Le numéro de téléphone doit être une chaîne.' }).optional(),

  documents: z.array(z.any()).optional(),
});

export type DemandCreateDTO = z.infer<typeof DemandCreateSchema>;

export const DemandUpdateSchema = z.object({
  status: z.nativeEnum(DemandeStatus, { message: 'Statut invalide.' }),
  reason: z.string({ message: 'La raison doit être une chaîne de caractères.' })
    .max(1000, 'La raison ne doit pas dépasser 1000 caractères.')
    .optional(),
  observation: z.string().optional(),
});

export type DemandUpdateDTO = z.infer<typeof DemandUpdateSchema>;