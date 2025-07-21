import { api as apiClient } from '@/lib/api-http';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types pour les documents
export interface Document {
  id: string;
  userId: string;
  visaRequestId?: string;
  appointmentId?: string;
  type: 'PASSPORT' | 'PHOTO' | 'INVITATION_LETTER' | 'HOTEL_RESERVATION' | 'FLIGHT_TICKET' | 'BANK_STATEMENT' | 'EMPLOYMENT_LETTER' | 'BIRTH_CERTIFICATE' | 'MARRIAGE_CERTIFICATE' | 'ACADEMIC_TRANSCRIPT' | 'MEDICAL_CERTIFICATE' | 'POLICE_CLEARANCE' | 'INSURANCE_POLICY' | 'OTHER';
  category: 'IDENTITY' | 'TRAVEL' | 'FINANCIAL' | 'PROFESSIONAL' | 'MEDICAL' | 'LEGAL' | 'OTHER';
  name: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  verificationStatus: 'NOT_VERIFIED' | 'VERIFIED' | 'REJECTED';
  expiryDate?: string;
  issueDate?: string;
  issuingAuthority?: string;
  description?: string;
  notes?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface CreateDocumentData {
  userId: string;
  visaRequestId?: string;
  appointmentId?: string;
  type: Document['type'];
  category: Document['category'];
  name: string;
  expiryDate?: string;
  issueDate?: string;
  issuingAuthority?: string;
  description?: string;
  notes?: string;
}

export interface UpdateDocumentData {
  type?: Document['type'];
  category?: Document['category'];
  name?: string;
  status?: Document['status'];
  verificationStatus?: Document['verificationStatus'];
  expiryDate?: string;
  issueDate?: string;
  issuingAuthority?: string;
  description?: string;
  notes?: string;
  rejectionReason?: string;
}

export interface DocumentFilters {
  userId?: string;
  visaRequestId?: string;
  appointmentId?: string;
  type?: Document['type'];
  category?: Document['category'];
  status?: Document['status'];
  verificationStatus?: Document['verificationStatus'];
  uploadedBy?: string;
  verifiedBy?: string;
  expiryDateFrom?: string;
  expiryDateTo?: string;
  uploadedDateFrom?: string;
  uploadedDateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'uploadedAt' | 'name' | 'type' | 'status' | 'expiryDate';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  notVerified: number;
  verified: number;
  verificationRejected: number;
  byType: Record<Document['type'], number>;
  byCategory: Record<Document['category'], number>;
  expiringThisMonth: number;
  recentUploads: number;
  averageVerificationTime: number;
}

export interface PaginatedDocumentsResponse {
  data: Document[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DocumentUploadResponse {
  document: Document;
  uploadUrl?: string;
}

// Service pour les documents
export class DocumentsService {
  // Obtenir tous les documents avec filtres
  static async getAll(filters?: DocumentFilters): Promise<PaginatedDocumentsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/documents?${params.toString()}`);
    return data;
  }

  // Obtenir les documents d'un utilisateur
  static async getByUser(userId: string, filters?: Omit<DocumentFilters, 'userId'>): Promise<PaginatedDocumentsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/documents/user/${userId}?${params.toString()}`);
    return data;
  }

  // Obtenir les documents d'une demande de visa
  static async getByVisaRequest(visaRequestId: string): Promise<Document[]> {
    const { data } = await apiClient.get(`/documents/visa-request/${visaRequestId}`);
    return data;
  }

  // Obtenir les documents d'un rendez-vous
  static async getByAppointment(appointmentId: string): Promise<Document[]> {
    const { data } = await apiClient.get(`/documents/appointment/${appointmentId}`);
    return data;
  }

  // Obtenir les statistiques des documents
  static async getStats(): Promise<DocumentStats> {
    const { data } = await apiClient.get('/documents/stats');
    return data;
  }

  // Obtenir un document par ID
  static async getById(id: string): Promise<Document> {
    const { data } = await apiClient.get(`/documents/${id}`);
    return data;
  }

  // Créer un nouveau document (métadonnées seulement)
  static async create(documentData: CreateDocumentData): Promise<Document> {
    const { data } = await apiClient.post('/documents', documentData);
    return data;
  }

  // Uploader un fichier pour un document
  static async upload(file: File, documentData: CreateDocumentData): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentData', JSON.stringify(documentData));
    
    const { data } = await apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  // Remplacer le fichier d'un document existant
  static async replaceFile(id: string, file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await apiClient.put(`/documents/${id}/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  // Mettre à jour les métadonnées d'un document
  static async update(id: string, documentData: UpdateDocumentData): Promise<Document> {
    const { data } = await apiClient.put(`/documents/${id}`, documentData);
    return data;
  }

  // Supprimer un document
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  }

  // Approuver un document
  static async approve(id: string, notes?: string): Promise<Document> {
    const { data } = await apiClient.patch(`/documents/${id}/approve`, { notes });
    return data;
  }

  // Rejeter un document
  static async reject(id: string, rejectionReason: string): Promise<Document> {
    const { data } = await apiClient.patch(`/documents/${id}/reject`, { rejectionReason });
    return data;
  }

  // Vérifier un document
  static async verify(id: string, notes?: string): Promise<Document> {
    const { data } = await apiClient.patch(`/documents/${id}/verify`, { notes });
    return data;
  }

  // Rejeter la vérification d'un document
  static async rejectVerification(id: string, rejectionReason: string): Promise<Document> {
    const { data } = await apiClient.patch(`/documents/${id}/reject-verification`, { rejectionReason });
    return data;
  }

  // Télécharger un document
  static async download(id: string): Promise<Blob> {
    const { data } = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return data;
  }

  // Obtenir l'URL de prévisualisation d'un document
  static async getPreviewUrl(id: string): Promise<{ previewUrl: string }> {
    const { data } = await apiClient.get(`/documents/${id}/preview-url`);
    return data;
  }

  // Obtenir les documents expirant bientôt
  static async getExpiringSoon(days: number = 30): Promise<Document[]> {
    const { data } = await apiClient.get(`/documents/expiring-soon?days=${days}`);
    return data;
  }

  // Obtenir les documents en attente de vérification
  static async getPendingVerification(): Promise<Document[]> {
    const { data } = await apiClient.get('/documents/pending-verification');
    return data;
  }

  // Rechercher des documents
  static async search(query: string, filters?: Omit<DocumentFilters, 'search'>): Promise<Document[]> {
    const params = new URLSearchParams({ search: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/documents/search?${params.toString()}`);
    return data;
  }
}

// Hooks TanStack Query pour les documents

// Hook pour obtenir tous les documents
export const useDocuments = (filters?: DocumentFilters) => {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => DocumentsService.getAll(filters),
  });
};

// Hook pour obtenir les documents d'un utilisateur
export const useUserDocuments = (userId: string, filters?: Omit<DocumentFilters, 'userId'>) => {
  return useQuery({
    queryKey: ['documents', 'user', userId, filters],
    queryFn: () => DocumentsService.getByUser(userId, filters),
    enabled: !!userId,
  });
};

// Hook pour obtenir les documents d'une demande de visa
export const useVisaRequestDocuments = (visaRequestId: string) => {
  return useQuery({
    queryKey: ['documents', 'visa-request', visaRequestId],
    queryFn: () => DocumentsService.getByVisaRequest(visaRequestId),
    enabled: !!visaRequestId,
  });
};

// Hook pour obtenir les documents d'un rendez-vous
export const useAppointmentDocuments = (appointmentId: string) => {
  return useQuery({
    queryKey: ['documents', 'appointment', appointmentId],
    queryFn: () => DocumentsService.getByAppointment(appointmentId),
    enabled: !!appointmentId,
  });
};

// Hook pour obtenir les statistiques des documents
export const useDocumentStats = () => {
  return useQuery({
    queryKey: ['documents', 'stats'],
    queryFn: () => DocumentsService.getStats(),
  });
};

// Hook pour obtenir un document par ID
export const useDocument = (id: string) => {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: () => DocumentsService.getById(id),
    enabled: !!id,
  });
};

// Hook pour obtenir les documents expirant bientôt
export const useExpiringSoonDocuments = (days: number = 30) => {
  return useQuery({
    queryKey: ['documents', 'expiring-soon', days],
    queryFn: () => DocumentsService.getExpiringSoon(days),
  });
};

// Hook pour obtenir les documents en attente de vérification
export const usePendingVerificationDocuments = () => {
  return useQuery({
    queryKey: ['documents', 'pending-verification'],
    queryFn: () => DocumentsService.getPendingVerification(),
  });
};

// Hook pour rechercher des documents
export const useSearchDocuments = (query: string, filters?: Omit<DocumentFilters, 'search'>) => {
  return useQuery({
    queryKey: ['documents', 'search', query, filters],
    queryFn: () => DocumentsService.search(query, filters),
    enabled: !!query && query.length > 2,
  });
};

// Hook pour obtenir l'URL de prévisualisation
export const useDocumentPreviewUrl = (id: string) => {
  return useQuery({
    queryKey: ['documents', id, 'preview-url'],
    queryFn: () => DocumentsService.getPreviewUrl(id),
    enabled: !!id,
  });
};

// Hook pour créer un document
export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentData: CreateDocumentData) => DocumentsService.create(documentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

// Hook pour uploader un document
export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, documentData }: { file: File; documentData: CreateDocumentData }) => 
      DocumentsService.upload(file, documentData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      if (data.document.visaRequestId) {
        queryClient.invalidateQueries({ queryKey: ['documents', 'visa-request', data.document.visaRequestId] });
      }
      if (data.document.appointmentId) {
        queryClient.invalidateQueries({ queryKey: ['documents', 'appointment', data.document.appointmentId] });
      }
    },
  });
};

// Hook pour remplacer le fichier d'un document
export const useReplaceDocumentFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => 
      DocumentsService.replaceFile(id, file),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documents', id] });
    },
  });
};

// Hook pour mettre à jour un document
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentData }) => 
      DocumentsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documents', id] });
    },
  });
};

// Hook pour supprimer un document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DocumentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

// Hook pour approuver un document
export const useApproveDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      DocumentsService.approve(id, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documents', id] });
    },
  });
};

// Hook pour rejeter un document
export const useRejectDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => 
      DocumentsService.reject(id, rejectionReason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documents', id] });
    },
  });
};

// Hook pour vérifier un document
export const useVerifyDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      DocumentsService.verify(id, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documents', id] });
      queryClient.invalidateQueries({ queryKey: ['documents', 'pending-verification'] });
    },
  });
};

// Hook pour rejeter la vérification d'un document
export const useRejectDocumentVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => 
      DocumentsService.rejectVerification(id, rejectionReason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documents', id] });
      queryClient.invalidateQueries({ queryKey: ['documents', 'pending-verification'] });
    },
  });
};

// Hook pour télécharger un document
export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: (id: string) => DocumentsService.download(id),
  });
};