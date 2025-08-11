import { DemandeStatus } from "@/features/demande/types/demande.type";

export const getDemandeStatusLabel = (status: DemandeStatus): { label: string; style: string } => {
    switch (status) {
        case DemandeStatus.NEW: return { label: "Nouvelle demande", style: "bg-blue-100 text-blue-600 hover:bg-blue-200" };
        case DemandeStatus.IN_REVIEW_DOCS: return { label: "Documents en cours de vérification", style: "bg-orange-100 text-orange-600 hover:bg-orange-200" };
        case DemandeStatus.PENDING_ADDITIONAL_INFO: return { label: "Informations complémentaires requises", style: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" };
        case DemandeStatus.APPROVED_BY_AGENT: return { label: "Approuvée par l'agent", style: "bg-lime-100 text-lime-700 hover:bg-lime-200" };
        case DemandeStatus.APPROVED_BY_CHEF: return { label: "Approuvée par le chef", style: "bg-teal-100 text-teal-700 hover:bg-teal-200" };
        case DemandeStatus.APPROVED_BY_CONSUL: return { label: "Approuvée par le consul", style: "bg-green-100 text-green-600 hover:bg-green-200" };
        case DemandeStatus.REJECTED: return { label: "Demande rejetée", style: "bg-red-100 text-red-600 hover:bg-red-200" };
        case DemandeStatus.READY_FOR_PICKUP: return { label: "Prête à être retirée", style: "bg-purple-100 text-purple-700 hover:bg-purple-200" };
        case DemandeStatus.DELIVERED: return { label: "Demande livrée", style: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" };
        case DemandeStatus.ARCHIVED: return { label: "Archivée", style: "bg-gray-100 text-gray-600 hover:bg-gray-200" };
        case DemandeStatus.EXPIRED: return { label: "Expirée", style: "bg-brown-100 text-brown-600 hover:bg-brown-200" };
        case DemandeStatus.RENEWAL_REQUESTED: return { label: "Renouvellement demandé", style: "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200" };
        default: return { label: "Statut inconnu", style: "bg-muted text-muted-foreground hover:bg-muted" };
    }
};