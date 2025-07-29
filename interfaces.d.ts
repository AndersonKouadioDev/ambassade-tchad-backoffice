

export enum ExpenseCategory {
    SALARIES = 'SALARIES',
    GENERAL_OVERHEAD = 'GENERAL_OVERHEAD',
    RENT = 'RENT',
    INTERNET_COMM = 'INTERNET_COMM',
    UTILITIES = 'UTILITIES',
    OTHER = 'OTHER'
}


// ==================== PAYMENT INTERFACES ====================


// ==================== SERVICE DETAIL INTERFACES ====================

export interface News extends BaseEntity {
    title: string;
    content: string;
    imageUrl?: string;
    published: boolean;
    authorId: string;
}

export interface NewsWithRelations extends News {
    author?: User;
}


export interface Photo extends BaseEntity {
    title?: string;
    description?: string;
    imageUrl: string;
}

export interface Video extends BaseEntity {
    title?: string;
    description?: string;
    youtubeUrl: string;
}

// ==================== EXPENSE INTERFACES ====================

export interface Expense extends BaseEntity {
    amount: number;
    description?: string;
    category: ExpenseCategory;
    recordedById: string;
    expenseDate: Date;
}

export interface ExpenseWithRelations extends Expense {
    recordedBy?: User;
}

// ==================== SETTING INTERFACES ====================

export interface Setting extends BaseEntity {
    key: string;
    value: string;
    description?: string;
    updatedById?: string;
}

export interface SettingWithRelations extends Setting {
    updatedBy?: User;
}

// ==================== API RESPONSE INTERFACES ====================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<PaginatedResponse<T>> { }

// ==================== FORM INTERFACES ====================

// Create interfaces (sans id, createdAt, updatedAt)
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateRequestData = Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'ticketNumber'>;
export type CreateDocumentData = Omit<Document, 'id' | 'createdAt' | 'updatedAt'>;
export type CreatePaymentData = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateNewsData = Omit<News, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateEventData = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateExpenseData = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateServiceData = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateSettingData = Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>;

// Update interfaces (tous les champs optionnels sauf id)
export type UpdateUserData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateRequestData = Partial<Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'ticketNumber'>>;
export type UpdateDocumentData = Partial<Omit<Document, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdatePaymentData = Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateNewsData = Partial<Omit<News, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateEventData = Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateExpenseData = Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateServiceData = Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateSettingData = Partial<Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>>;

// ==================== QUERY INTERFACES ====================

export interface RequestFilters {
    status?: RequestStatus;
    serviceType?: ServiceType;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    ticketNumber?: string;
}

export interface UserFilters {
    type?: UserType;
    status?: UserStatus;
    role?: Role;
    email?: string;
}

export interface PaymentFilters {
    method?: PaymentMethod;
    startDate?: Date;
    endDate?: Date;
    recordedById?: string;
}

export interface ExpenseFilters {
    category?: ExpenseCategory;
    startDate?: Date;
    endDate?: Date;
    recordedById?: string;
}

export interface SortOptions {
    field: string;
    direction: 'asc' | 'desc';
}

export interface QueryParams {
    page?: number;
    limit?: number;
    sort?: SortOptions;
    search?: string;
}

// ==================== AUTH INTERFACES ====================

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}

export interface AuthUser extends User {
    permissions?: string[];
}

// ==================== STATISTICS INTERFACES ====================

export interface DashboardStats {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    totalRevenue: number;
    recentRequests: RequestWithRelations[];
    requestsByService: { [key in ServiceType]: number };
    requestsByStatus: { [key in RequestStatus]: number };
    monthlyRevenue: { month: string; revenue: number }[];
}

export interface ServiceStats {
    serviceType: ServiceType;
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    totalRevenue: number;
    averageProcessingTime: number;
}

// ==================== NOTIFICATION INTERFACES ====================

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: Date;
    userId: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
}

// ==================== FILE UPLOAD INTERFACES ====================

export interface FileUploadResponse {
    fileName: string;
    filePath: string;
    mimeType: string;
    fileSizeKB: number;
    url: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}