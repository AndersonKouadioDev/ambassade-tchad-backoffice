export interface IVideo {
    id: string;
    title: string;
    description: string;
    youtubeUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;

}

export interface IVideoRechercheParams {
    title?: string;
    description?: string;
    page?: number;
    limit?: number;
}

export interface IVideoStats {
    total: number;
}