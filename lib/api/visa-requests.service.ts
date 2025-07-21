import { api as apiClient } from '@/lib/api-http';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types pour les demandes de visa
export interface VisaRequest {
  id: string;
  userId: string;
  type: 'TOURIST' | 'BUSINESS' | 'TRANSIT' | 'DIPLOMATIC' | 'OFFICIAL';
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  submissionDate: string;
  appointmentDate?: string;
  appointmentTime?: string;
  documents: VisaDocument[];
  personalInfo: PersonalInfo;
  travelInfo: TravelInfo;
  contactInfo: ContactInfo;
  emergencyContact: EmergencyContact;
  rejectionReason?: string;
  notes?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisaDocument {
  id: string;
  type: 'PASSPORT' | 'PHOTO' | 'INVITATION_LETTER' | 'HOTEL_RESERVATION' | 'FLIGHT_TICKET' | 'BANK_STATEMENT' | 'EMPLOYMENT_LETTER' | 'OTHER';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssuePlace: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  profession: string;
  employer?: string;
}

export interface TravelInfo {
  purposeOfVisit: string;
  intendedDateOfEntry: string;
  intendedDateOfExit: string;
  durationOfStay: number;
  accommodationAddress: string;
  accommodationType: 'HOTEL' | 'PRIVATE' | 'OTHER';
  invitingPerson?: string;
  invitingPersonAddress?: string;
  invitingPersonPhone?: string;
  previousVisits: boolean;
  previousVisitDetails?: string;
}

export interface ContactInfo {
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address: string;
}

export interface CreateVisaRequestData {
  type: VisaRequest['type'];
  appointmentDate?: string;
  appointmentTime?: string;
  personalInfo: PersonalInfo;
  travelInfo: TravelInfo;
  contactInfo: ContactInfo;
  emergencyContact: EmergencyContact;
  documents: Omit<VisaDocument, 'id' | 'uploadedAt'>[];
}

export interface UpdateVisaRequestData {
  type?: VisaRequest['type'];
  status?: VisaRequest['status'];
  appointmentDate?: string;
  appointmentTime?: string;
  personalInfo?: Partial<PersonalInfo>;
  travelInfo?: Partial<TravelInfo>;
  contactInfo?: Partial<ContactInfo>;
  emergencyContact?: Partial<EmergencyContact>;
  rejectionReason?: string;
  notes?: string;
}

export interface VisaRequestFilters {
  userId?: string;
  type?: VisaRequest['type'];
  status?: VisaRequest['status'];
  submissionDateFrom?: string;
  submissionDateTo?: string;
  appointmentDateFrom?: string;
  appointmentDateTo?: string;
  processedBy?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'submissionDate' | 'appointmentDate' | 'status' | 'type';
  sortOrder?: 'asc' | 'desc';
}

export interface VisaRequestStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  completed: number;
  byType: Record<VisaRequest['type'], number>;
  recentSubmissions: number;
  averageProcessingTime: number;
}

export interface PaginatedVisaRequestsResponse {
  data: VisaRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Service pour les demandes de visa
export class VisaRequestsService {
  // Obtenir toutes les demandes de visa avec filtres
  static async getAll(filters?: VisaRequestFilters): Promise<PaginatedVisaRequestsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/visa-requests?${params.toString()}`);
    return data;
  }

  // Obtenir les demandes de visa d'un utilisateur
  static async getByUser(userId: string, filters?: Omit<VisaRequestFilters, 'userId'>): Promise<PaginatedVisaRequestsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/visa-requests/user/${userId}?${params.toString()}`);
    return data;
  }

  // Obtenir les statistiques des demandes de visa
  static async getStats(): Promise<VisaRequestStats> {
    const { data } = await apiClient.get('/visa-requests/stats');
    return data;
  }

  // Obtenir une demande de visa par ID
  static async getById(id: string): Promise<VisaRequest> {
    const { data } = await apiClient.get(`/visa-requests/${id}`);
    return data;
  }

  // Créer une nouvelle demande de visa
  static async create(requestData: CreateVisaRequestData): Promise<VisaRequest> {
    const { data } = await apiClient.post('/visa-requests', requestData);
    return data;
  }

  // Mettre à jour une demande de visa
  static async update(id: string, requestData: UpdateVisaRequestData): Promise<VisaRequest> {
    const { data } = await apiClient.put(`/visa-requests/${id}`, requestData);
    return data;
  }

  // Supprimer une demande de visa
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/visa-requests/${id}`);
  }

  // Approuver une demande de visa
  static async approve(id: string, notes?: string): Promise<VisaRequest> {
    const { data } = await apiClient.patch(`/visa-requests/${id}/approve`, { notes });
    return data;
  }

  // Rejeter une demande de visa
  static async reject(id: string, rejectionReason: string): Promise<VisaRequest> {
    const { data } = await apiClient.patch(`/visa-requests/${id}/reject`, { rejectionReason });
    return data;
  }

  // Marquer une demande comme complétée
  static async complete(id: string): Promise<VisaRequest> {
    const { data } = await apiClient.patch(`/visa-requests/${id}/complete`);
    return data;
  }

  // Uploader un document pour une demande
  static async uploadDocument(id: string, file: File, type: VisaDocument['type']): Promise<VisaDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const { data } = await apiClient.post(`/visa-requests/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  // Supprimer un document d'une demande
  static async deleteDocument(requestId: string, documentId: string): Promise<void> {
    await apiClient.delete(`/visa-requests/${requestId}/documents/${documentId}`);
  }
}

// Hooks TanStack Query pour les demandes de visa

// Hook pour obtenir toutes les demandes de visa
export const useVisaRequests = (filters?: VisaRequestFilters) => {
  return useQuery({
    queryKey: ['visa-requests', filters],
    queryFn: () => VisaRequestsService.getAll(filters),
  });
};

// Hook pour obtenir les demandes de visa d'un utilisateur
export const useUserVisaRequests = (userId: string, filters?: Omit<VisaRequestFilters, 'userId'>) => {
  return useQuery({
    queryKey: ['visa-requests', 'user', userId, filters],
    queryFn: () => VisaRequestsService.getByUser(userId, filters),
    enabled: !!userId,
  });
};

// Hook pour obtenir les statistiques des demandes de visa
export const useVisaRequestStats = () => {
  return useQuery({
    queryKey: ['visa-requests', 'stats'],
    queryFn: () => VisaRequestsService.getStats(),
  });
};

// Hook pour obtenir une demande de visa par ID
export const useVisaRequest = (id: string) => {
  return useQuery({
    queryKey: ['visa-requests', id],
    queryFn: () => VisaRequestsService.getById(id),
    enabled: !!id,
  });
};

// Hook pour créer une demande de visa
export const useCreateVisaRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestData: CreateVisaRequestData) => VisaRequestsService.create(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visa-requests'] });
    },
  });
};

// Hook pour mettre à jour une demande de visa
export const useUpdateVisaRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVisaRequestData }) => 
      VisaRequestsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['visa-requests'] });
      queryClient.invalidateQueries({ queryKey: ['visa-requests', id] });
    },
  });
};

// Hook pour supprimer une demande de visa
export const useDeleteVisaRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => VisaRequestsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visa-requests'] });
    },
  });
};

// Hook pour approuver une demande de visa
export const useApproveVisaRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      VisaRequestsService.approve(id, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['visa-requests'] });
      queryClient.invalidateQueries({ queryKey: ['visa-requests', id] });
    },
  });
};

// Hook pour rejeter une demande de visa
export const useRejectVisaRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => 
      VisaRequestsService.reject(id, rejectionReason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['visa-requests'] });
      queryClient.invalidateQueries({ queryKey: ['visa-requests', id] });
    },
  });
};

// Hook pour marquer une demande comme complétée
export const useCompleteVisaRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => VisaRequestsService.complete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['visa-requests'] });
      queryClient.invalidateQueries({ queryKey: ['visa-requests', id] });
    },
  });
};

// Hook pour uploader un document
export const useUploadVisaDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file, type }: { id: string; file: File; type: VisaDocument['type'] }) => 
      VisaRequestsService.uploadDocument(id, file, type),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['visa-requests', id] });
    },
  });
};

// Hook pour supprimer un document
export const useDeleteVisaDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, documentId }: { requestId: string; documentId: string }) => 
      VisaRequestsService.deleteDocument(requestId, documentId),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ['visa-requests', requestId] });
    },
  });
};