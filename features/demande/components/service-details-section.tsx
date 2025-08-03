import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  User,
  FileText,
  CreditCard,
  Import as Passport,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { IDemande } from "@/features/demande/types/demande.type";
import { ServiceType } from "@/features/service/types/service.type";

interface ServiceDetailsSectionProps {
  demande: IDemande;
}

const serviceTypeLabels = {
  [ServiceType.VISA]: "Visa",
  [ServiceType.BIRTH_ACT_APPLICATION]: "Acte de naissance",
  [ServiceType.CONSULAR_CARD]: "Carte consulaire",
  [ServiceType.LAISSEZ_PASSER]: "Laissez-passer",
  [ServiceType.MARRIAGE_CAPACITY_ACT]: "Certificat de capacité à mariage",
  [ServiceType.DEATH_ACT_APPLICATION]: "Acte de décès",
  [ServiceType.POWER_OF_ATTORNEY]: "Procuration",
  [ServiceType.NATIONALITY_CERTIFICATE]: "Certificat de nationalité",
};

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number | undefined;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground break-words">{value}</p>
      </div>
    </div>
  );
}

function VisaDetails({ demande }: { demande: IDemande }) {
  const visa = demande.visaDetails;
  if (!visa) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InfoItem
        icon={User}
        label="Nom complet"
        value={`${visa.personFirstName} ${visa.personLastName}`}
      />
      <InfoItem
        icon={Calendar}
        label="Date de naissance"
        value={format(new Date(visa.personBirthDate), "PPP", { locale: fr })}
      />
      <InfoItem
        icon={MapPin}
        label="Lieu de naissance"
        value={visa.personBirthPlace}
      />
      <InfoItem
        icon={FileText}
        label="Nationalité"
        value={visa.personNationality}
      />
      <InfoItem
        icon={Passport}
        label="Numéro de passeport"
        value={visa.passportNumber}
      />
      <InfoItem
        icon={Calendar}
        label="Expiration passeport"
        value={format(new Date(visa.passportExpirationDate), "PPP", {
          locale: fr,
        })}
      />
      <InfoItem icon={FileText} label="Type de visa" value={visa.visaType} />
      <InfoItem
        icon={Calendar}
        label="Durée (mois)"
        value={visa.durationMonths}
      />
      {visa.profession && (
        <InfoItem icon={User} label="Profession" value={visa.profession} />
      )}
      {visa.destinationState && (
        <InfoItem
          icon={MapPin}
          label="État de destination"
          value={visa.destinationState}
        />
      )}
    </div>
  );
}

function DefaultServiceDetails({ demande }: { demande: IDemande }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InfoItem
        icon={FileText}
        label="Type de service"
        value={serviceTypeLabels[demande.serviceType]}
      />
      <InfoItem
        icon={Calendar}
        label="Date de soumission"
        value={format(new Date(demande.submissionDate), "PPP", { locale: fr })}
      />
      {demande.contactPhoneNumber && (
        <InfoItem
          icon={FileText}
          label="Numéro de contact"
          value={demande.contactPhoneNumber}
        />
      )}
      <InfoItem
        icon={CreditCard}
        label="Montant"
        value={`${demande.amount} FCFA`}
      />
    </div>
  );
}

export function ServiceDetailsSection({ demande }: ServiceDetailsSectionProps) {
  const renderServiceSpecificDetails = () => {
    switch (demande.serviceType) {
      case ServiceType.VISA:
        return <VisaDetails demande={demande} />;
      default:
        return <DefaultServiceDetails demande={demande} />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            Détails du service
          </CardTitle>
          <Badge className="text-sm">
            {serviceTypeLabels[demande.serviceType]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {renderServiceSpecificDetails()}

        {demande.observations && (
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Observations
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {demande.observations}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
