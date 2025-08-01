import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  Star,
  Building,
  GraduationCap,
  Trophy,
  Users2,
  Coffee
} from "lucide-react";
import { IEvenementRechercheParams } from "../types/evenement.type";

// Fonctions de formatage
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateRange = (dateDebut: string, dateFin: string): string => {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  
  if (debut.toDateString() === fin.toDateString()) {
    return formatDate(dateDebut);
  }
  
  return `${formatDate(dateDebut)} - ${formatDate(dateFin)}`;
};

export const formatTime = (timeString: string): string => {
  return timeString;
};

// Fonctions de validation des dates
export const isEventUpcoming = (dateDebut: string): boolean => {
  return new Date(dateDebut) > new Date();
};

export const isEventPast = (dateFin: string): boolean => {
  return new Date(dateFin) < new Date();
};

export const isEventOngoing = (dateDebut: string, dateFin: string): boolean => {
  const now = new Date();
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  return now >= debut && now <= fin;
};

// Fonctions de statut
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "publié":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "brouillon":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    case "annulé":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "archivé":
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

// Fonctions de priorité
export const getPriorityIcon = (priorite?: string) => {
  switch (priorite) {
    case "urgente":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "importante":
      return <Star className="w-4 h-4 text-yellow-500" />;
    case "normale":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    default:
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  }
};

// Fonctions de type d'événement
export const getTypeIcon = (type?: string) => {
  switch (type) {
    case "conference":
      return <Building className="w-4 h-4 text-blue-500" />;
    case "seminaire":
      return <GraduationCap className="w-4 h-4 text-purple-500" />;
    case "atelier":
      return <Users2 className="w-4 h-4 text-green-500" />;
    case "ceremonie":
      return <Trophy className="w-4 h-4 text-yellow-500" />;
    case "reception":
      return <Coffee className="w-4 h-4 text-orange-500" />;
    case "formation":
      return <GraduationCap className="w-4 h-4 text-indigo-500" />;
    default:
      return <Calendar className="w-4 h-4 text-gray-500" />;
  }
};

export const getTypeColor = (type?: string): string => {
  switch (type) {
    case "conference":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "seminaire":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "atelier":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "ceremonie":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "reception":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    case "formation":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

// Fonctions utilitaires
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Fonctions de recherche et filtrage
export const filterEvenements = (
  evenements: any[],
  searchParams: IEvenementRechercheParams
): any[] => {
  return evenements.filter((evenement) => {
    const matchesSearch = !searchParams.title || 
      evenement.titre.toLowerCase().includes(searchParams.title.toLowerCase()) ||
      evenement.description.toLowerCase().includes(searchParams.title.toLowerCase());
    
    const matchesStatus = !searchParams.published || 
      evenement.status === searchParams.published;
    
    const matchesAuthor = !searchParams.authorId || 
      evenement.authorId === searchParams.authorId;
    
    return matchesSearch && matchesStatus && matchesAuthor;
  });
};

// Fonctions de validation
export const validateEvenementDates = (dateDebut: string, dateFin: string): boolean => {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  return debut <= fin;
};

export const validateEvenementTime = (heureDebut: string, heureFin: string): boolean => {
  if (!heureDebut || !heureFin) return true;
  
  const [h1, m1] = heureDebut.split(':').map(Number);
  const [h2, m2] = heureFin.split(':').map(Number);
  
  const time1 = h1 * 60 + m1;
  const time2 = h2 * 60 + m2;
  
  return time1 < time2;
};

// Fonctions de calcul
export const calculateEventDuration = (dateDebut: string, dateFin: string): number => {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  const diffTime = Math.abs(fin.getTime() - debut.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateParticipationRate = (inscrits: number, capacite: number): number => {
  if (!capacite) return 0;
  return Math.round((inscrits / capacite) * 100);
}; 