import { api as apiClient } from '@/lib/api-http';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types pour les rapports
export interface Report {
  id: string;
  title: string;
  description?: string;
  type: 'VISA_REQUESTS' | 'APPOINTMENTS' | 'USERS' | 'DOCUMENTS' | 'NOTIFICATIONS' | 'FINANCIAL' | 'PERFORMANCE' | 'CUSTOM';
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  parameters: ReportParameters;
  fileUrl?: string;
  fileSize?: number;
  generatedBy: string;
  generatedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportParameters {
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  visaType?: string;
  status?: string;
  location?: string;
  assignedTo?: string;
  includeDetails?: boolean;
  groupBy?: string[];
  filters?: Record<string, any>;
  customFields?: string[];
}

export interface CreateReportData {
  title: string;
  description?: string;
  type: Report['type'];
  format: Report['format'];
  parameters: ReportParameters;
}

export interface UpdateReportData {
  title?: string;
  description?: string;
  parameters?: Partial<ReportParameters>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  type: Report['type'];
  defaultFormat: Report['format'];
  defaultParameters: ReportParameters;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportTemplateData {
  name: string;
  description?: string;
  type: Report['type'];
  defaultFormat: Report['format'];
  defaultParameters: ReportParameters;
  isPublic?: boolean;
}

export interface UpdateReportTemplateData {
  name?: string;
  description?: string;
  defaultFormat?: Report['format'];
  defaultParameters?: Partial<ReportParameters>;
  isPublic?: boolean;
}

export interface ReportFilters {
  type?: Report['type'];
  status?: Report['status'];
  format?: Report['format'];
  generatedBy?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'generatedAt' | 'title' | 'type' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface ReportStats {
  total: number;
  pending: number;
  generating: number;
  completed: number;
  failed: number;
  byType: Record<Report['type'], number>;
  byFormat: Record<Report['format'], number>;
  recentReports: number;
  averageGenerationTime: number;
  totalFileSize: number;
}

export interface DashboardData {
  visaRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byType: Record<string, number>;
    recentSubmissions: Array<{
      date: string;
      count: number;
    }>;
    processingTimes: {
      average: number;
      median: number;
      fastest: number;
      slowest: number;
    };
  };
  appointments: {
    total: number;
    today: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    byLocation: Record<string, number>;
    utilizationRate: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    byType: Record<string, number>;
  };
  documents: {
    total: number;
    verified: number;
    pending: number;
    expired: number;
    byType: Record<string, number>;
  };
  performance: {
    responseTime: number;
    uptime: number;
    errorRate: number;
    throughput: number;
  };
}

export interface AnalyticsData {
  period: string;
  metrics: {
    visaApplications: Array<{
      date: string;
      count: number;
      approved: number;
      rejected: number;
    }>;
    appointmentBookings: Array<{
      date: string;
      count: number;
      completed: number;
      cancelled: number;
    }>;
    userActivity: Array<{
      date: string;
      activeUsers: number;
      newRegistrations: number;
    }>;
    documentUploads: Array<{
      date: string;
      count: number;
      verified: number;
    }>;
  };
  trends: {
    visaApplicationsGrowth: number;
    appointmentBookingsGrowth: number;
    userActivityGrowth: number;
    documentUploadsGrowth: number;
  };
}

export interface PaginatedReportsResponse {
  data: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedReportTemplatesResponse {
  data: ReportTemplate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Service pour les rapports
export class ReportsService {
  // Obtenir tous les rapports avec filtres
  static async getAll(filters?: ReportFilters): Promise<PaginatedReportsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/reports?${params.toString()}`);
    return data;
  }

  // Obtenir les rapports d'un utilisateur
  static async getByUser(userId: string, filters?: Omit<ReportFilters, 'generatedBy'>): Promise<PaginatedReportsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/reports/user/${userId}?${params.toString()}`);
    return data;
  }

  // Obtenir les statistiques des rapports
  static async getStats(): Promise<ReportStats> {
    const { data } = await apiClient.get('/reports/stats');
    return data;
  }

  // Obtenir un rapport par ID
  static async getById(id: string): Promise<Report> {
    const { data } = await apiClient.get(`/reports/${id}`);
    return data;
  }

  // Créer un nouveau rapport
  static async create(reportData: CreateReportData): Promise<Report> {
    const { data } = await apiClient.post('/reports', reportData);
    return data;
  }

  // Mettre à jour un rapport
  static async update(id: string, reportData: UpdateReportData): Promise<Report> {
    const { data } = await apiClient.put(`/reports/${id}`, reportData);
    return data;
  }

  // Supprimer un rapport
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/reports/${id}`);
  }

  // Générer un rapport
  static async generate(id: string): Promise<Report> {
    const { data } = await apiClient.post(`/reports/${id}/generate`);
    return data;
  }

  // Télécharger un rapport
  static async download(id: string): Promise<Blob> {
    const { data } = await apiClient.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });
    return data;
  }

  // Obtenir les données du tableau de bord
  static async getDashboardData(period?: string): Promise<DashboardData> {
    const params = period ? `?period=${period}` : '';
    const { data } = await apiClient.get(`/reports/dashboard${params}`);
    return data;
  }

  // Obtenir les données d'analyse
  static async getAnalyticsData(period: string = '30d'): Promise<AnalyticsData> {
    const { data } = await apiClient.get(`/reports/analytics?period=${period}`);
    return data;
  }

  // Obtenir tous les modèles de rapport
  static async getTemplates(filters?: Omit<ReportFilters, 'status' | 'generatedBy'>): Promise<PaginatedReportTemplatesResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/reports/templates?${params.toString()}`);
    return data;
  }

  // Obtenir un modèle de rapport par ID
  static async getTemplateById(id: string): Promise<ReportTemplate> {
    const { data } = await apiClient.get(`/reports/templates/${id}`);
    return data;
  }

  // Créer un nouveau modèle de rapport
  static async createTemplate(templateData: CreateReportTemplateData): Promise<ReportTemplate> {
    const { data } = await apiClient.post('/reports/templates', templateData);
    return data;
  }

  // Mettre à jour un modèle de rapport
  static async updateTemplate(id: string, templateData: UpdateReportTemplateData): Promise<ReportTemplate> {
    const { data } = await apiClient.put(`/reports/templates/${id}`, templateData);
    return data;
  }

  // Supprimer un modèle de rapport
  static async deleteTemplate(id: string): Promise<void> {
    await apiClient.delete(`/reports/templates/${id}`);
  }

  // Créer un rapport à partir d'un modèle
  static async createFromTemplate(templateId: string, overrides?: Partial<CreateReportData>): Promise<Report> {
    const { data } = await apiClient.post(`/reports/templates/${templateId}/create`, overrides);
    return data;
  }

  // Exporter des données brutes
  static async exportData(
    type: 'visa-requests' | 'appointments' | 'users' | 'documents',
    format: 'csv' | 'excel' | 'json',
    filters?: Record<string, any>
  ): Promise<Blob> {
    const params = new URLSearchParams({ format });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await apiClient.get(`/reports/export/${type}?${params.toString()}`, {
      responseType: 'blob',
    });
    return data;
  }
}

// Hooks TanStack Query pour les rapports

// Hook pour obtenir tous les rapports
export const useReports = (filters?: ReportFilters) => {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => ReportsService.getAll(filters),
  });
};

// Hook pour obtenir les rapports d'un utilisateur
export const useUserReports = (userId: string, filters?: Omit<ReportFilters, 'generatedBy'>) => {
  return useQuery({
    queryKey: ['reports', 'user', userId, filters],
    queryFn: () => ReportsService.getByUser(userId, filters),
    enabled: !!userId,
  });
};

// Hook pour obtenir les statistiques des rapports
export const useReportStats = () => {
  return useQuery({
    queryKey: ['reports', 'stats'],
    queryFn: () => ReportsService.getStats(),
  });
};

// Hook pour obtenir un rapport par ID
export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => ReportsService.getById(id),
    enabled: !!id,
  });
};

// Hook pour obtenir les données du tableau de bord
export const useDashboardData = (period?: string) => {
  return useQuery({
    queryKey: ['reports', 'dashboard', period],
    queryFn: () => ReportsService.getDashboardData(period),
    refetchInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
  });
};

// Hook pour obtenir les données d'analyse
export const useAnalyticsData = (period: string = '30d') => {
  return useQuery({
    queryKey: ['reports', 'analytics', period],
    queryFn: () => ReportsService.getAnalyticsData(period),
    refetchInterval: 10 * 60 * 1000, // Rafraîchir toutes les 10 minutes
  });
};

// Hook pour obtenir les modèles de rapport
export const useReportTemplates = (filters?: Omit<ReportFilters, 'status' | 'generatedBy'>) => {
  return useQuery({
    queryKey: ['reports', 'templates', filters],
    queryFn: () => ReportsService.getTemplates(filters),
  });
};

// Hook pour obtenir un modèle de rapport par ID
export const useReportTemplate = (id: string) => {
  return useQuery({
    queryKey: ['reports', 'templates', id],
    queryFn: () => ReportsService.getTemplateById(id),
    enabled: !!id,
  });
};

// Hook pour créer un rapport
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportData: CreateReportData) => ReportsService.create(reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// Hook pour mettre à jour un rapport
export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReportData }) => 
      ReportsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports', id] });
    },
  });
};

// Hook pour supprimer un rapport
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReportsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// Hook pour générer un rapport
export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReportsService.generate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports', id] });
    },
  });
};

// Hook pour télécharger un rapport
export const useDownloadReport = () => {
  return useMutation({
    mutationFn: (id: string) => ReportsService.download(id),
  });
};

// Hook pour créer un modèle de rapport
export const useCreateReportTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateData: CreateReportTemplateData) => ReportsService.createTemplate(templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'templates'] });
    },
  });
};

// Hook pour mettre à jour un modèle de rapport
export const useUpdateReportTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReportTemplateData }) => 
      ReportsService.updateTemplate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'templates'] });
      queryClient.invalidateQueries({ queryKey: ['reports', 'templates', id] });
    },
  });
};

// Hook pour supprimer un modèle de rapport
export const useDeleteReportTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReportsService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'templates'] });
    },
  });
};

// Hook pour créer un rapport à partir d'un modèle
export const useCreateReportFromTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, overrides }: { templateId: string; overrides?: Partial<CreateReportData> }) => 
      ReportsService.createFromTemplate(templateId, overrides),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// Hook pour exporter des données
export const useExportData = () => {
  return useMutation({
    mutationFn: ({ type, format, filters }: {
      type: 'visa-requests' | 'appointments' | 'users' | 'documents';
      format: 'csv' | 'excel' | 'json';
      filters?: Record<string, any>;
    }) => ReportsService.exportData(type, format, filters),
  });
};