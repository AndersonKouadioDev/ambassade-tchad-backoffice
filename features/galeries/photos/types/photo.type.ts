
export interface IPhoto {
    id: string;
    title: string;
    description: string;
    imageUrl?: string[];
    createdAt?: Date;
    updatedAt?: Date;

}

export interface IPhotoRechercheParams {
    title?: string;
    description?: string;
    page?: number;
    limit?: number;
}

export interface IPhotoStats {
    total: number;
}