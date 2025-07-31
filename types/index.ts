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
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<PaginatedResponse<T>> { }