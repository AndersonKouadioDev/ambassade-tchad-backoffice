
export interface IPhoto {
    id: string;
    title?: string;
    description?: string;
    imageUrl: string[];
    createdAt: Date;
    updatedAt: Date;
}