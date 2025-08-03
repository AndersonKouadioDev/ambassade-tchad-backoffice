import { DemandeStatus } from "@/features/demande/types/demande.type";

export const getDemandeStatusLabel = (status: DemandeStatus): { label: string; style: string } => {
    switch (status) {
        case DemandeStatus.NEW: return { label: "Nouvelle", style: "bg-blue-100 text-blue-600" };
        case DemandeStatus.IN_REVIEW_DOCS: return { label: "Documents en Revue", style: "bg-orange-100 text-orange-600" };
        case DemandeStatus.PENDING_ADDITIONAL_INFO: return { label: "Informations Add. Requises", style: "bg-yellow-100 text-yellow-700" };
        case DemandeStatus.APPROVED_BY_AGENT: return { label: "Approuvée par Agent", style: "bg-lime-100 text-lime-700" };
        case DemandeStatus.APPROVED_BY_CHEF: return { label: "Approuvée par Chef", style: "bg-teal-100 text-teal-700" };
        case DemandeStatus.APPROVED_BY_CONSUL: return { label: "Approuvée par Consul", style: "bg-green-100 text-green-600" };
        case DemandeStatus.REJECTED: return { label: "Rejetée", style: "bg-red-100 text-red-600" };
        case DemandeStatus.READY_FOR_PICKUP: return { label: "Prête pour Retrait", style: "bg-purple-100 text-purple-700" };
        case DemandeStatus.DELIVERED: return { label: "Livrée", style: "bg-emerald-100 text-emerald-700" };
        case DemandeStatus.ARCHIVED: return { label: "Archivée", style: "bg-gray-100 text-gray-600" };
        case DemandeStatus.EXPIRED: return { label: "Expirée", style: "bg-brown-100 text-brown-600" };
        case DemandeStatus.RENEWAL_REQUESTED: return { label: "Renouvellement Demandé", style: "bg-fuchsia-100 text-fuchsia-700" };
        default: return { label: "Inconnu", style: "bg-muted text-muted-foreground" };
    }
};