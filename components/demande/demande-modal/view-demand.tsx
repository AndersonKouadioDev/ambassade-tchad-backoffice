"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, Mail, Phone, MapPin } from "lucide-react";
import { formatSafeDate, formatSafeDateWithTime } from "@/lib/date-utils";
import type {
  IDemande,
  DemandeStatus,
} from "@/features/demande/types/demande.type";
import type { ServiceType } from "@/features/service/types/service.type";

interface ViewDemandeModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  demande: IDemande;
}

// Fonction utilitaire pour obtenir le libellé des statuts
const getStatusLabel = (status: DemandeStatus): string => {
  const labelMap: Record<DemandeStatus, string> = {
    NEW: "Nouveau",
    IN_REVIEW_DOCS: "Révision documents",
    APPROVED_BY_AGENT: "Approuvé par agent",
    APPROVED_BY_CHEF: "Approuvé par chef",
    APPROVED_BY_CONSUL: "Approuvé par consul",
    REJECTED: "Rejeté",
    ARCHIVED: "Archivé",
    EXPIRED: "Expiré",
    RENEWAL_REQUESTED: "Renouvellement demandé",
    PENDING_ADDITIONAL_INFO: "Info supplémentaire requise",
    READY_FOR_PICKUP: "Prêt pour retrait",
    DELIVERED: "Livré",
  };
  return labelMap[status] || status;
};

// Fonction utilitaire pour obtenir le libellé des services
const getServiceLabel = (serviceType: ServiceType): string => {
  const labelMap: Record<ServiceType, string> = {
    VISA: "Visa",
    BIRTH_ACT_APPLICATION: "Acte de naissance",
    CONSULAR_CARD: "Carte consulaire",
    POWER_OF_ATTORNEY: "Procuration",
    NATIONALITY_CERTIFICATE: "Certificat de nationalité",
    LAISSEZ_PASSER: "Laissez-passer",
    MARRIAGE_CAPACITY_ACT: "Acte de capacité de mariage",
    DEATH_ACT_APPLICATION: "Acte de décès",
  };
  return labelMap[serviceType] || serviceType;
};

// Fonction utilitaire pour obtenir les couleurs des statuts
const getStatusColor = (status: DemandeStatus): string => {
  const colorMap: Record<DemandeStatus, string> = {
    NEW: "bg-blue-100 text-blue-700 border-blue-200",
    IN_REVIEW_DOCS: "bg-yellow-100 text-yellow-700 border-yellow-200",
    APPROVED_BY_AGENT: "bg-green-100 text-green-700 border-green-200",
    APPROVED_BY_CHEF: "bg-emerald-100 text-emerald-700 border-emerald-200",
    APPROVED_BY_CONSUL: "bg-teal-100 text-teal-700 border-teal-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
    ARCHIVED: "bg-slate-100 text-slate-700 border-slate-200",
    EXPIRED: "bg-gray-100 text-gray-700 border-gray-200",
    RENEWAL_REQUESTED: "bg-gray-100 text-gray-700 border-gray-200",
    PENDING_ADDITIONAL_INFO: "bg-gray-100 text-gray-700 border-gray-200",
    READY_FOR_PICKUP: "bg-gray-100 text-gray-700 border-gray-200",
    DELIVERED: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return colorMap[status] || "bg-gray-100 text-gray-700 border-gray-200";
};

export function ViewDemandeModal({
  isOpen,
  setIsOpen,
  demande,
}: ViewDemandeModalProps) {
  const initials = `${demande.user?.firstName.charAt(
    0
  )}${demande?.user?.lastName.charAt(0)}`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-4xl rounded-xl bg-white shadow-xl">
                <div className="bg-gradient-to-r from-blue-600 to-yellow-500 p-6 rounded-t-xl">
                  <Dialog.Title className="text-xl font-bold text-white mb-2">
                    Détails de la Demande #{demande.id}
                  </Dialog.Title>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-white">
                      <AvatarFallback className="bg-white text-blue-600 font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <p className="font-semibold text-lg">
                        {demande.user?.firstName} {demande.user?.lastName}
                      </p>
                      <p className="text-blue-100 text-sm">
                        {demande.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informations générales */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <FileText className="w-5 h-5" />
                          Informations générales
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Service demandé:
                          </span>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            {getServiceLabel(demande.serviceType)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Statut:
                          </span>
                          <Badge
                            className={`border ${getStatusColor(
                              demande.status
                            )}`}
                          >
                            {getStatusLabel(demande.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Date de création:
                          </span>
                          <span className="text-sm text-gray-800">
                            {formatSafeDateWithTime(demande.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Dernière mise à jour:
                          </span>
                          <span className="text-sm text-gray-800">
                            {formatSafeDateWithTime(demande.updatedAt)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Informations personnelles */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <User className="w-5 h-5" />
                          Informations personnelles
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Nom complet:
                          </span>
                          <p className="text-sm text-gray-800">
                            {demande.user?.firstName} {demande.user?.lastName}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Informations de contact */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <Mail className="w-5 h-5" />
                          Contact
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-800">
                            {demande.user?.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-800">
                            {demande.user?.phoneNumber}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div className="text-sm text-gray-800">
                            <p>Address</p>
                            <p>Ville, Pays</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <FileText className="w-5 h-5" />
                          Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {demande.documents && demande.documents.length > 0 ? (
                          <div className="space-y-2">
                            {demande.documents.map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <span className="text-sm text-gray-700">
                                  {doc.fileName}
                                </span>
                                <Badge className="text-xs">
                                  {doc.mimeType}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Aucun document téléchargé
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Commentaires et notes */}
                  {demande.statusHistory &&
                    demande.statusHistory.length > 0 && (
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle className="text-blue-700">
                            Commentaires et suivi
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {demande.statusHistory.map(
                              (statusHistory, index) => (
                                <div
                                  key={index}
                                  className="border-l-4 border-blue-200 pl-4 py-2"
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-medium text-gray-700">
                                      {statusHistory?.changer?.firstName}{" "}
                                      {statusHistory?.changer?.lastName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatSafeDateWithTime(
                                        statusHistory?.changedAt
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {statusHistory?.reason}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Fermer
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
