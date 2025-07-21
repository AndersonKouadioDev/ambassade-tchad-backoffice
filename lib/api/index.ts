// Export de tous les services API
export { AuthService } from './auth.service';
export { UsersService } from './users.service';
export { VisaRequestsService } from './visa-requests.service';
export { AppointmentsService } from './appointments.service';
export { DocumentsService } from './documents.service';
export { demandesService } from './demandes.service';
export { eventsService } from './events.service';
export { newsService } from './news.service';
export { photosService } from './photos.service';
export { videosService } from './videos.service';
export { NotificationsService } from './notifications.service';
export { ReportsService } from './reports.service';
export { PaymentsService } from './payments.service';
export { EmailService } from './email.service';

// Export des types
export type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  UserProfile,
  RegisterClientData,
  CompleteLoginData,
  ResetPasswordData
} from './auth.service';

export type {
  User,
  CreateUserData,
  UpdateUserData,
  UsersListParams,
  UsersListResponse
} from './users.service';

export type {
  Notification,
  CreateNotificationData,
  UpdateNotificationData,
  NotificationsListParams,
  NotificationsListResponse
} from './notifications.service';

export type {
  PaymentVerificationData,
  PaymentRefundData,
  PaymentVerificationResponse,
  PaymentRefundResponse
} from './payments.service';

export type {
  SendEmailData,
  EmailTemplate,
  SendEmailResponse
} from './email.service';

export type {
  VisaRequest,
  CreateVisaRequestData,
  UpdateVisaRequestData,
  VisaRequestFilters,
  VisaRequestStats,
  PaginatedVisaRequestsResponse
} from './visa-requests.service';

export type {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  AppointmentStats,
  PaginatedAppointmentsResponse
} from './appointments.service';

export type {
  Document,
  CreateDocumentData,
  UpdateDocumentData,
  DocumentFilters,
  DocumentStats,
  PaginatedDocumentsResponse
} from './documents.service';

export type {
  Event,
  CreateEventData,
  UpdateEventData,
  EventFilters,
  EventStats,
  PaginatedEventsResponse
} from './events.service';

export type {
  News,
  CreateNewsData,
  UpdateNewsData,
  NewsFilters,
  NewsStats,
  PaginatedNewsResponse
} from './news.service';

export type {
  Photo,
  CreatePhotoData,
  UpdatePhotoData,
  PhotoFilters,
  PhotoStats,
  PaginatedPhotosResponse
} from './photos.service';

export type {
  Video,
  CreateVideoData,
  UpdateVideoData,
  VideoFilters,
  VideoStats,
  PaginatedVideosResponse
} from './videos.service';

export type {
  Report,
  CreateReportData,
  UpdateReportData,
  ReportFilters,
  ReportStats,
  DashboardData,
  AnalyticsData,
  PaginatedReportsResponse
} from './reports.service';

export type {
  Demande,
  DemandeUser,
  CreateDemandeData,
  UpdateDemandeData,
  DemandeFilters,
  DemandeStats,
  VisaDetails,
  BirthActDetails,
  ConsularCardDetails,
  LaissezPasserDetails
} from './demandes.service';

// Types communs
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

// Utilitaires pour les services
export const createQueryParams = (params: Record<string, any>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams;
};

// Configuration des query keys pour TanStack Query
export const queryKeys = {
  auth: ['auth'] as const,
  users: ['users'] as const,
  visaRequests: ['visa-requests'] as const,
  appointments: ['appointments'] as const,
  documents: ['documents'] as const,
  events: ['events'] as const,
  news: ['news'] as const,
  photos: ['photos'] as const,
  videos: ['videos'] as const,
  notifications: ['notifications'] as const,
  reports: ['reports'] as const,
  payments: ['payments'] as const,
  email: ['email'] as const,
} as const;