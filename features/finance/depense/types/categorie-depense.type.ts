export interface ICategorieDepense {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICategorieDepenseParams {
    name?: string;
    isActive?: boolean;
}

export interface ICategorieDepenseStatsResponse {
    total: number,
    isActive: number,
    isNotActive: number,
}