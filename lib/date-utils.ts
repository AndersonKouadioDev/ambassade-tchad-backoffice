import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formate une date de manière sécurisée
 * @param dateValue - La valeur de date à formater (peut être string, Date, number ou undefined/null)
 * @param formatString - Le format de sortie (par défaut: "dd/MM/yyyy")
 * @returns La date formatée ou un message d'erreur approprié
 */
export const formatSafeDate = (dateValue: any, formatString: string = "dd/MM/yyyy"): string => {
  if (!dateValue) return "Date non disponible";
  
  const date = new Date(dateValue);
  if (!isValid(date)) return "Date invalide";
  
  return format(date, formatString, { locale: fr });
};

/**
 * Formate une date avec heure de manière sécurisée
 * @param dateValue - La valeur de date à formater
 * @returns La date formatée avec heure ou un message d'erreur
 */
export const formatSafeDateWithTime = (dateValue: any): string => {
  return formatSafeDate(dateValue, "dd/MM/yyyy à HH:mm");
};