import { api as apiClient } from '@/lib/api-http';

// Types basés sur le guide API
export interface DemandeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
}

// Types des détails spécifiques à chaque service
export interface VisaDetails {
  id: string;
  requestId: string;
  personFirstName: string;
  personLastName: string;
  personGender: 'MALE' | 'FEMALE';
  personNationality: string;
  personBirthDate: string;
  personBirthPlace: string;
  personMaritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  passportType: 'ORDINARY' | 'SERVICE' | 'DIPLOMATIC';
  passportNumber: string;
  passportIssuedBy: string;
  passportIssueDate: string;
  passportExpirationDate: string;
  profession?: string;
  employerAddress?: string;
  employerPhoneNumber?: string;
  visaType: 'SHORT_STAY' | 'LONG_STAY';
  durationMonths: number;
  destinationState?: string;
  visaExpirationDate?: string;
}

export interface BirthActDetails {
  id: string;
  requestId: string;
  personFirstName: string;
  personLastName: string;
  personBirthDate: string;
  personBirthPlace: string;
  personNationality: string;
  personDomicile?: string;
  fatherFullName: string;
  motherFullName: string;
  requestType: 'NEWBORN' | 'RENEWAL';
}

export interface ConsularCardDetails {
  id: string;
  requestId: string;
  personFirstName: string;
  personLastName: string;
  personBirthDate: string;
  personBirthPlace: string;
  personProfession?: string;
  personNationality: string;
  personDomicile?: string;
  personAddressInOriginCountry?: string;
  fatherFullName?: string;
  motherFullName?: string;
  justificationDocumentType?: string;
  justificationDocumentNumber?: string;
  cardExpirationDate?: string;
}

export interface LaissezPasserDetails {
  id: string;
  requestId: string;
  personFirstName: string;
  personLastName: string;
  personBirthDate: string;
  personBirthPlace: string;
  personProfession?: string;
  personNationality: string;
  personDomicile?: string;
  fatherFullName?: string;
  motherFullName?: string;
  destination?: string;
  travelReason?: string;
  accompanied: boolean;
  justificationDocumentType?: string;
  justificationDocumentNumber?: string;
  laissezPasserExpirationDate: string;
  accompaniers: any[];
}

export interface Demande {
  id: string;
  ticketNumber: string;
  userId: string;
  serviceType: 'VISA' | 'BIRTH_ACT_APPLICATION' | 'CONSULAR_CARD' | 'LAISSEZ_PASSER' | 'MARRIAGE_CAPACITY_ACT' | 'DEATH_ACT_APPLICATION' | 'POWER_OF_ATTORNEY' | 'NATIONALITY_CERTIFICATE';
  status: 'NEW' | 'IN_REVIEW_DOCS' | 'PENDING_ADDITIONAL_INFO' | 'APPROVED_BY_AGENT' | 'APPROVED_BY_CHEF' | 'APPROVED_BY_CONSUL' | 'REJECTED' | 'READY_FOR_PICKUP' | 'DELIVERED' | 'ARCHIVED' | 'EXPIRED' | 'RENEWAL_REQUESTED';
  submissionDate: string;
  completionDate?: string;
  issuedDate?: string;
  contactPhoneNumber?: string;
  observations?: string;
  amount: number;
  user: DemandeUser;
  visaDetails?: VisaDetails;
  birthActDetails?: BirthActDetails;
  consularCardDetails?: ConsularCardDetails;
  laissezPasserDetails?: LaissezPasserDetails;
  marriageCapacityActDetails?: any;
  deathActDetails?: any;
  powerOfAttorneyDetails?: any;
  nationalityCertificateDetails?: any;
}

export interface DemandeFilters {
  status?: string;
  documentType?: string;
  priority?: string;
  userId?: string;
  assignedTo?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface DemandeStats {
  total: number;
  new: number;
  inReviewDocs: number;
  pendingAdditionalInfo: number;
  approvedByAgent: number;
  approvedByChef: number;
  approvedByConsul: number;
  rejected: number;
  readyForPickup: number;
  delivered: number;
  archived: number;
  expired: number;
  renewalRequested: number;
}

export interface PaginatedResponse<T> {
  currentPage: number;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateDemandeData {
  serviceType: 'VISA' | 'BIRTH_ACT_APPLICATION' | 'CONSULAR_CARD' | 'LAISSEZ_PASSER' | 'MARRIAGE_CAPACITY_ACT' | 'DEATH_ACT_APPLICATION' | 'POWER_OF_ATTORNEY' | 'NATIONALITY_CERTIFICATE';
  amount: number;
  contactPhoneNumber?: string;
  observations?: string;
  // Détails spécifiques selon le type de service
  visaDetails?: {
    personFirstName: string;
    personLastName: string;
    personGender?: 'MALE' | 'FEMALE';
    personNationality: string;
    personBirthDate: string;
    personBirthPlace: string;
    personMaritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
    passportType?: 'ORDINARY' | 'SERVICE' | 'DIPLOMATIC';
    passportNumber?: string;
    passportIssuedBy?: string;
    passportIssueDate?: string;
    passportExpirationDate?: string;
    profession?: string;
    employerAddress?: string;
    employerPhoneNumber?: string;
    visaType?: 'SHORT_STAY' | 'LONG_STAY';
    durationMonths?: number;
    destinationState?: string;
  };
  birthActDetails?: {
    personFirstName: string;
    personLastName: string;
    personBirthDate: string;
    personBirthPlace: string;
    personNationality: string;
    personDomicile?: string;
    fatherFullName?: string;
    motherFullName?: string;
    requestType?: 'NEWBORN' | 'RENEWAL';
  };
  consularCardDetails?: {
    personFirstName: string;
    personLastName: string;
    personBirthDate: string;
    personBirthPlace: string;
    personProfession?: string;
    personNationality: string;
    personDomicile?: string;
    personAddressInOriginCountry?: string;
    fatherFullName?: string;
    motherFullName?: string;
    justificationDocumentType?: string;
    justificationDocumentNumber?: string;
    cardExpirationDate?: string;
  };
  laissezPasserDetails?: {
    personFirstName: string;
    personLastName: string;
    personBirthDate: string;
    personBirthPlace: string;
    personProfession?: string;
    personNationality: string;
    personDomicile?: string;
    fatherFullName?: string;
    motherFullName?: string;
    destination?: string;
    travelReason?: string;
    accompanied?: boolean;
    justificationDocumentType?: string;
    justificationDocumentNumber?: string;
    laissezPasserExpirationDate?: string;
    accompaniers?: any[];
  };
  marriageCapacityActDetails?: {
    personFirstName: string;
    personLastName: string;
    personBirthDate: string;
    personBirthPlace: string;
    personNationality: string;
    fatherFullName?: string;
    motherFullName?: string;
  };
  deathActDetails?: {
    personFirstName: string;
    personLastName: string;
    personBirthDate: string;
    personBirthPlace: string;
    personNationality: string;
    fatherFullName?: string;
    motherFullName?: string;
  };
  powerOfAttorneyDetails?: {
    personFirstName: string;
    personLastName: string;
    personBirthDate: string;
    personBirthPlace: string;
    personNationality: string;
    fatherFullName?: string;
    motherFullName?: string;
  };
  nationalityCertificateDetails?: {
    personFirstName: string;
    personLastName: string;
    personBirthDate: string;
    personBirthPlace: string;
    personNationality: string;
    fatherFullName?: string;
    motherFullName?: string;
  };
}

export interface UpdateDemandeData {
  status?: 'PENDING' | 'IN_PROGRESS' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'REJECTED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  notes?: string;
  assignedTo?: string;
  estimatedCompletionDate?: string;
  rejectionReason?: string;
}

class DemandesService {
  private baseUrl = '/demandes';

  // Obtenir toutes les demandes avec filtres et pagination
  async getDemandes(filters?: DemandeFilters): Promise<PaginatedResponse<Demande>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await apiClient.get(url);
    return response.data;
  }

  // Obtenir les statistiques des demandes
  async getDemandeStats(): Promise<DemandeStats> {
    const response = await apiClient.get(`${this.baseUrl}/stats`);
    return response.data;
  }

  // Obtenir une demande par ID
  async getDemandeById(id: string): Promise<Demande> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Créer une nouvelle demande
  async createDemande(data: CreateDemandeData): Promise<Demande> {
    const response = await apiClient.post(this.baseUrl, data);
    return response.data;
  }

  // Mettre à jour une demande
  async updateDemande(id: string, data: UpdateDemandeData): Promise<Demande> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Changer le statut d'une demande (endpoint backend réel)
  async updateDemandeStatus(id: string, status: string, observation?: string): Promise<Demande> {
    const response = await apiClient.put(`${this.baseUrl}/${id}/status`, {
      status,
      observation
    });
    return response.data;
  }

  // Supprimer une demande
  async deleteDemande(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Assigner une demande à un agent
  async assignDemande(id: string, assignedTo: string): Promise<Demande> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}/assign`, { assignedTo });
    return response.data;
  }

  // Approuver une demande
  async approveDemande(id: string, notes?: string): Promise<Demande> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}/approve`, { notes });
    return response.data;
  }

  // Rejeter une demande
  async rejectDemande(id: string, rejectionReason: string): Promise<Demande> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}/reject`, { rejectionReason });
    return response.data;
  }

  // Marquer une demande comme prête pour retrait
  async markReadyForPickup(id: string): Promise<Demande> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}/ready`);
    return response.data;
  }

  // Marquer une demande comme complétée
  async completeDemande(id: string): Promise<Demande> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}/complete`);
    return response.data;
  }
}

export const demandesService = new DemandesService();
export default demandesService;