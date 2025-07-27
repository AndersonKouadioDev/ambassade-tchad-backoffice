import { BaseEntity } from './index';

// Énumérations selon le backend
export enum ServiceType {
  VISA = "VISA",
  BIRTH_ACT_APPLICATION = "BIRTH_ACT_APPLICATION", 
  CONSULAR_CARD = "CONSULAR_CARD",
  LAISSEZ_PASSER = "LAISSEZ_PASSER",
  MARRIAGE_CAPACITY_ACT = "MARRIAGE_CAPACITY_ACT",
  DEATH_ACT_APPLICATION = "DEATH_ACT_APPLICATION",
  POWER_OF_ATTORNEY = "POWER_OF_ATTORNEY",
  NATIONALITY_CERTIFICATE = "NATIONALITY_CERTIFICATE"
}

export enum RequestStatus {
  NEW = "NEW",
  IN_REVIEW_DOCS = "IN_REVIEW_DOCS",
  PENDING_ADDITIONAL_INFO = "PENDING_ADDITIONAL_INFO",
  APPROVED_BY_AGENT = "APPROVED_BY_AGENT",
  APPROVED_BY_CHEF = "APPROVED_BY_CHEF",
  APPROVED_BY_CONSUL = "APPROVED_BY_CONSUL",
  REJECTED = "REJECTED",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  DELIVERED = "DELIVERED",
  ARCHIVED = "ARCHIVED"
}

export enum UserRole {
  AGENT = "AGENT",
  CHEF_SERVICE = "CHEF_SERVICE",
  CONSUL = "CONSUL",
  ADMIN = "ADMIN"
}

export enum UserType {
  DEMANDEUR = "DEMANDEUR",
  PERSONNEL = "PERSONNEL"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export type Gender = "MALE" | "FEMALE";
export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
export type PassportType = "ORDINARY" | "SERVICE" | "DIPLOMATIC";
export type VisaType = "SHORT_STAY" | "LONG_STAY";

// Types pour les utilisateurs selon la vraie structure backend
export interface DemandeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Types pour les détails des documents selon la vraie structure backend
export interface LaissezPasserDetails {
  id: string;
  requestId: string;
  personFirstName: string;
  personLastName: string;
  personBirthDate: string;
  personBirthPlace: string;
  personProfession: string;
  personNationality: string;
  personDomicile: string;
  fatherFullName: string;
  motherFullName: string;
  destination: string;
  travelReason: string;
  accompanied: boolean;
  accompaniers: string[];
  justificationDocumentType: string;
  justificationDocumentNumber: string;
  laissezPasserExpirationDate: string;
  createdAt: string;
  updatedAt: string;
}

// Interfaces pour les détails spécifiques selon les données réelles du backend
export interface VisaDetails {
  id: string;
  requestId: string;
  personFirstName: string;
  personLastName: string;
  personGender: string;
  personNationality: string;
  personBirthDate: string;
  personBirthPlace: string;
  personMaritalStatus: string;
  passportType: string;
  passportNumber: string;
  passportIssuedBy: string;
  passportIssueDate: string;
  passportExpirationDate: string;
  profession: string;
  employerAddress: string;
  employerPhoneNumber: string;
  visaType: string;
  durationMonths: number;
  destinationState: string;
  visaExpirationDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BirthActDetails {
  id: string;
  requestId: string;
  personFirstName: string;
  personLastName: string;
  personBirthDate: string;
  personBirthPlace: string;
  personNationality: string;
  personDomicile: string;
  fatherFullName: string;
  motherFullName: string;
  requestType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsularCardDetails {
  id: string;
  requestId: string;
  personFirstName: string;
  personLastName: string;
  personBirthDate: string;
  personBirthPlace: string;
  personProfession: string;
  personNationality: string;
  personDomicile: string;
  personAddressInOriginCountry: string;
  fatherFullName: string;
  motherFullName: string;
  justificationDocumentType: string;
  justificationDocumentNumber: string;
  cardExpirationDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// Interface principale pour une demande selon la vraie structure backend
export interface Demande {
  id: string;
  ticketNumber: string;
  userId: string;
  serviceType: ServiceType;
  status: RequestStatus;
  submissionDate: string;
  updatedAt: string;
  completionDate: string | null;
  issuedDate: string | null;
  contactPhoneNumber: string | null;
  observations: string;
  amount: number;
  user: DemandeUser;
  visaDetails: VisaDetails | null;
  birthActDetails: BirthActDetails | null;
  consularCardDetails: ConsularCardDetails | null;
  laissezPasserDetails: LaissezPasserDetails | null;
  marriageCapacityActDetails: any | null;
  deathActDetails: any | null;
  powerOfAttorneyDetails: any | null;
  nationalityCertificateDetails: any | null;
}

// Interface utilisateur
export interface User extends BaseEntity {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
  type: UserType;
  status: UserStatus;
}

// Interface de base pour une demande (sans authentification demandeur)
export interface BaseRequest extends BaseEntity {
  serviceType: ServiceType;
  status: RequestStatus;
  amount: number;
  contactPhoneNumber?: string;
  // Informations demandeur directement dans la demande (pas d'userId)
  demandeurFirstName: string;
  demandeurLastName: string;
  demandeurEmail: string;
  demandeurPhone: string;
  ticket?: string;
  documents?: RequestDocument[];
  statusHistory?: StatusHistory[];
}

// Document attaché à une demande
export interface RequestDocument {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

// Historique des changements de statut
export interface StatusHistory {
  id: string;
  previousStatus: RequestStatus;
  newStatus: RequestStatus;
  reason?: string;
  changedBy: string;
  changedAt: Date;
  user?: User;
}

// Détails spécifiques pour les demandes de visa
export interface VisaRequestDetails {
  // Informations personnelles
  personFirstName: string;
  personLastName: string;
  personGender: Gender;
  personNationality: string;
  personBirthDate: Date;
  personBirthPlace: string;
  personMaritalStatus: MaritalStatus;
  
  // Informations de passeport
  passportType: PassportType;
  passportNumber: string;
  passportIssuedBy: string;
  passportIssueDate: Date;
  passportExpirationDate: Date;
  
  // Informations professionnelles (optionnelles)
  profession?: string;
  employerAddress?: string;
  employerPhoneNumber?: string;
  
  // Détails du visa
  visaType: VisaType;
  durationMonths: number;
  destinationState?: string;
}

// Détails pour les actes de naissance
export interface BirthActRequestDetails {
  personFirstName: string;
  personLastName: string;
  personGender: Gender;
  personBirthDate: Date;
  personBirthPlace: string;
  fatherFirstName: string;
  fatherLastName: string;
  motherFirstName: string;
  motherLastName: string;
  declarantFirstName: string;
  declarantLastName: string;
  declarantRelation: string;
}

// Détails pour les cartes consulaires
export interface ConsularCardRequestDetails {
  personFirstName: string;
  personLastName: string;
  personGender: Gender;
  personNationality: string;
  personBirthDate: Date;
  personBirthPlace: string;
  personMaritalStatus: MaritalStatus;
  personAddress: string;
  personCity: string;
  personCountry: string;
  personPhoneNumber: string;
  personEmail?: string;
  profession?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

// Détails pour les laissez-passer
export interface LaissezPasserRequestDetails {
  personFirstName: string;
  personLastName: string;
  personGender: Gender;
  personNationality: string;
  personBirthDate: Date;
  personBirthPlace: string;
  personAddress: string;
  personPhoneNumber: string;
  travelPurpose: string;
  travelDestination: string;
  travelDepartureDate: Date;
  travelReturnDate: Date;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

// Détails pour les actes de capacité de mariage
export interface MarriageCapacityActRequestDetails {
  personFirstName: string;
  personLastName: string;
  personGender: Gender;
  personNationality: string;
  personBirthDate: Date;
  personBirthPlace: string;
  personMaritalStatus: MaritalStatus;
  personAddress: string;
  personPhoneNumber: string;
  spouseFirstName: string;
  spouseLastName: string;
  spouseNationality: string;
  marriageDate: Date;
  marriagePlace: string;
}

// Détails pour les actes de décès
export interface DeathActRequestDetails {
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedGender: Gender;
  deceasedNationality: string;
  deceasedBirthDate: Date;
  deceasedBirthPlace: string;
  deathDate: Date;
  deathPlace: string;
  deathCause?: string;
  declarantFirstName: string;
  declarantLastName: string;
  declarantRelation: string;
  declarantPhoneNumber: string;
}

// Détails pour les procurations
export interface PowerOfAttorneyRequestDetails {
  grantorFirstName: string;
  grantorLastName: string;
  grantorGender: Gender;
  grantorNationality: string;
  grantorBirthDate: Date;
  grantorBirthPlace: string;
  grantorAddress: string;
  grantorPhoneNumber: string;
  attorneyFirstName: string;
  attorneyLastName: string;
  attorneyAddress: string;
  attorneyPhoneNumber: string;
  powerPurpose: string;
  powerScope: string;
  validUntil?: Date;
}

// Détails pour les certificats de nationalité
export interface NationalityCertificateRequestDetails {
  personFirstName: string;
  personLastName: string;
  personGender: Gender;
  personBirthDate: Date;
  personBirthPlace: string;
  personAddress: string;
  personPhoneNumber: string;
  fatherFirstName: string;
  fatherLastName: string;
  fatherNationality: string;
  motherFirstName: string;
  motherLastName: string;
  motherNationality: string;
  residenceCountry: string;
  residenceAddress: string;
}

// Union type pour tous les détails de demande
export type RequestDetails = 
  | VisaRequestDetails
  | BirthActRequestDetails
  | ConsularCardRequestDetails
  | LaissezPasserRequestDetails
  | MarriageCapacityActRequestDetails
  | DeathActRequestDetails
  | PowerOfAttorneyRequestDetails
  | NationalityCertificateRequestDetails;

// Interface complète d'une demande avec détails
export interface Request extends BaseRequest {
  details: RequestDetails;
}

// Statistiques des demandes
export interface RequestStats {
  total: number;
  byStatus: Record<RequestStatus, number>;
  byService: Record<ServiceType, number>;
  recentRequests: Request[];
}

// Formulaire de création de demande (sans authentification)
export interface CreateRequestData {
  serviceType: ServiceType;
  amount: number;
  contactPhoneNumber?: string;
  // Informations du demandeur (remplace userId)
  demandeurFirstName: string;
  demandeurLastName: string;
  demandeurEmail: string;
  demandeurPhone: string;
  details: RequestDetails;
  documents?: File[];
}

// Formulaire de mise à jour du statut
export interface UpdateStatusData {
  newStatus: RequestStatus;
  reason?: string;
}

// Configuration des champs de formulaire
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  section?: string;
  colSpan?: 1 | 2 | 3;
}

// Configuration des sections de formulaire
export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

// Configuration complète du formulaire par type de service
export interface ServiceFormConfig {
  serviceType: ServiceType;
  title: string;
  description: string;
  sections: FormSection[];
  requiredDocuments: string[];
}

// Labels traduits pour l'interface
export const SERVICE_LABELS: Record<ServiceType, string> = {
  [ServiceType.VISA]: "Demande de Visa",
  [ServiceType.BIRTH_ACT_APPLICATION]: "Acte de Naissance",
  [ServiceType.CONSULAR_CARD]: "Carte Consulaire",
  [ServiceType.LAISSEZ_PASSER]: "Laissez-Passer",
  [ServiceType.MARRIAGE_CAPACITY_ACT]: "Acte de Capacité de Mariage",
  [ServiceType.DEATH_ACT_APPLICATION]: "Acte de Décès",
  [ServiceType.POWER_OF_ATTORNEY]: "Procuration",
  [ServiceType.NATIONALITY_CERTIFICATE]: "Certificat de Nationalité"
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.NEW]: "Nouvelle",
  [RequestStatus.IN_REVIEW_DOCS]: "Révision des documents",
  [RequestStatus.PENDING_ADDITIONAL_INFO]: "Informations manquantes",
  [RequestStatus.APPROVED_BY_AGENT]: "Approuvée par l'agent",
  [RequestStatus.APPROVED_BY_CHEF]: "Approuvée par le chef de service",
  [RequestStatus.APPROVED_BY_CONSUL]: "Approuvée par le consul",
  [RequestStatus.REJECTED]: "Rejetée",
  [RequestStatus.READY_FOR_PICKUP]: "Prête à récupérer",
  [RequestStatus.DELIVERED]: "Livrée",
  [RequestStatus.ARCHIVED]: "Archivée"
};

// Design system colors - Clean blue and yellow theme
export const STATUS_COLORS: Record<RequestStatus, string> = {
  [RequestStatus.NEW]: "bg-blue-500 text-white",
  [RequestStatus.IN_REVIEW_DOCS]: "bg-yellow-500 text-black",
  [RequestStatus.PENDING_ADDITIONAL_INFO]: "bg-yellow-600 text-white",
  [RequestStatus.APPROVED_BY_AGENT]: "bg-blue-500 text-white",
  [RequestStatus.APPROVED_BY_CHEF]: "bg-blue-600 text-white",
  [RequestStatus.APPROVED_BY_CONSUL]: "bg-blue-600 text-white",
  [RequestStatus.REJECTED]: "bg-yellow-600 text-white",
  [RequestStatus.READY_FOR_PICKUP]: "bg-yellow-500 text-black",
  [RequestStatus.DELIVERED]: "bg-blue-500 text-white",
  [RequestStatus.ARCHIVED]: "bg-blue-600 text-white"
};

// Interface pour les informations personnelles du demandeur
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// Interface étendue pour inclure les informations personnelles
export interface RequestWithPersonalInfo extends Request {
  personalInfo: PersonalInfo;
}

// Alias pour la compatibilité
export type Demande = RequestWithPersonalInfo;