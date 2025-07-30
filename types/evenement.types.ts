export interface IEvenement {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  eventDate: Date;
  location?: string;
  imageUrl?: Array<string>;
  published: boolean;
  authorId: string;
  author?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface IEvenementFormData {
  titre: string;
  description: string;
  contenu?: string;
  dateDebut: string;
  dateFin: string;
  heureDebut?: string;
  heureFin?: string;
  lieu: string;
  adresse?: string;
  image?: File | string;
  status: "brouillon" | "publié";
  categorie?: string;
  tags?: string[];
  priorite?: "normale" | "importante" | "urgente";
  langue?: "fr" | "en" | "ar";
  metaDescription?: string;
  metaTitre?: string;
  capaciteMax?: number;
  prixEntree?: number;
  gratuit?: boolean;
  inscriptionRequise?: boolean;
  lienInscription?: string;
  contact?: {
    nom?: string;
    email?: string;
  };
}

export interface IEvenementSearchParams {
  search?: string;
  published?: boolean;
  location?: string;
  authorId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IEvenementStats {
  totalEvents: number;
  upcomingEvents: number;
  publishedEvents: number;
  unpublishedEvents: number;
  // Nouvelles propriétés pour les statistiques avancées
  totalEvenements?: number;
  totalPublies?: number;
  totalBrouillons?: number;
  totalParticipants?: number;
  evolutionPublies?: Array<{ date: string; value: number }>;
  evolutionBrouillons?: Array<{ date: string; value: number }>;
  evolutionParticipants?: Array<{ date: string; value: number }>;
} 