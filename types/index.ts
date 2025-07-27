export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<PaginatedResponse<T>> { }

// Export specific types
export * from './actualite.types';
export * from './evenement.types';
export * from './galerie.types';
export { IService as ServiceIService } from './service.types';
export { OtherServiceType1 } from './service.types';