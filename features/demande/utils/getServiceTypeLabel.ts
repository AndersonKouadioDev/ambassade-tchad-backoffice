import { ServiceType } from "@/features/service/types/service.type";

export const getServiceTypeLabel = (serviceType: ServiceType): { label: string; style: string } => {
    switch (serviceType) {
        case ServiceType.VISA:
            return { label: "Visa", style: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" };
        case ServiceType.BIRTH_ACT_APPLICATION:
            return { label: "Acte de Naissance", style: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200" };
        case ServiceType.CONSULAR_CARD:
            return { label: "Carte Consulaire", style: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" };
        case ServiceType.LAISSEZ_PASSER:
            return { label: "Laissez-Passer", style: "bg-purple-100 text-purple-700 hover:bg-purple-200" };
        case ServiceType.MARRIAGE_CAPACITY_ACT:
            return { label: "Acte de Capacité de Mariage", style: "bg-pink-100 text-pink-700 hover:bg-pink-200" };
        case ServiceType.DEATH_ACT_APPLICATION:
            return { label: "Acte de Décès", style: "bg-red-100 text-red-700 hover:bg-red-200" };
        case ServiceType.POWER_OF_ATTORNEY:
            return { label: "Procuration", style: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" };
        case ServiceType.NATIONALITY_CERTIFICATE:
            return { label: "Certificat de Nationalité", style: "bg-green-100 text-green-700 hover:bg-green-200" };
        default:
            return { label: "Type de service inconnu", style: "bg-muted text-muted-foreground hover:bg-muted" };
    }
};