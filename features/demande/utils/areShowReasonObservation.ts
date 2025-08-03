import { DemandeStatus } from "../types/demande.type";

export function areShowReasonObservation(status: DemandeStatus): {
    reason: boolean;
    observation: boolean;
} {
    if (!status) return { reason: false, observation: false };
    switch (status) {
        case DemandeStatus.NEW:
        case DemandeStatus.IN_REVIEW_DOCS:
        case DemandeStatus.READY_FOR_PICKUP:
        case DemandeStatus.DELIVERED:
        case DemandeStatus.ARCHIVED:
        case DemandeStatus.EXPIRED:
        case DemandeStatus.RENEWAL_REQUESTED:
            return { reason: false, observation: false };

        case DemandeStatus.REJECTED:
            return { reason: true, observation: true };

        case DemandeStatus.PENDING_ADDITIONAL_INFO:
        case DemandeStatus.APPROVED_BY_CHEF:
        case DemandeStatus.APPROVED_BY_CONSUL:
            return { reason: true, observation: false };

        case DemandeStatus.APPROVED_BY_AGENT:
            return { reason: false, observation: true };

        default:
            return { reason: false, observation: false };
    }
}
