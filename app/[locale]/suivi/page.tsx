"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTrackDemande } from '@/hooks/queries/demande-queries';
import { Request, RequestStatus } from '@/types/demande.types';
import { Search, FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { formatSafeDate } from '@/lib/date-utils';

const STATUS_CONFIG = {
  [RequestStatus.PENDING]: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  [RequestStatus.IN_PROGRESS]: {
    label: 'En cours de traitement',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: AlertCircle
  },
  [RequestStatus.APPROVED]: {
    label: 'Approuvée',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  [RequestStatus.REJECTED]: {
    label: 'Rejetée',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  [RequestStatus.COMPLETED]: {
    label: 'Terminée',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle
  }
};

const SERVICE_LABELS = {
  VISA: 'Demande de Visa',
  BIRTH_CERTIFICATE: 'Acte de Naissance',
  CONSULAR_CARD: 'Carte Consulaire',
  LAISSEZ_PASSER: 'Laissez-Passer',
  MARRIAGE_CERTIFICATE: 'Acte de Capacité de Mariage',
  DEATH_CERTIFICATE: 'Acte de Décès'
};

export default function SuiviPage() {
  const [ticket, setTicket] = useState('');
  const [searchTicket, setSearchTicket] = useState('');
  
  const { data: demande, isLoading, error, refetch } = useTrackDemande(searchTicket);

  const handleSearch = () => {
    if (ticket.trim()) {
      setSearchTicket(ticket.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatSafeDate(dateString, 'dd MMMM yyyy à HH:mm');
    } catch {
      return dateString;
    }
  };

  const StatusBadge = ({ status }: { status: RequestStatus }) => {
    const config = STATUS_CONFIG[status];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1 px-3 py-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Suivi de Demande
          </h1>
          <p className="text-xl text-blue-600">
            Suivez l'état de votre demande avec votre ticket
          </p>
        </div>

        {/* Formulaire de recherche */}
        <Card className="border-blue-200 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
            <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Rechercher votre demande
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="ticket" className="text-sm font-medium text-gray-900 mb-2 block">
                  Numéro de ticket
                </Label>
                <Input
                  id="ticket"
                  type="text"
                  placeholder="Entrez votre numéro de ticket (ex: TCH-2024-001234)"
                  value={ticket}
                  onChange={(e) => setTicket(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={!ticket.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Rechercher
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-red-700">
                <XCircle className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Demande non trouvée</h3>
                  <p className="text-sm">Vérifiez votre numéro de ticket et réessayez.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {demande && (
          <div className="space-y-6">
            {/* Informations générales */}
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold text-blue-800">
                      {SERVICE_LABELS[demande.serviceType as keyof typeof SERVICE_LABELS] || demande.serviceType}
                    </CardTitle>
                    <p className="text-blue-600 mt-1">Ticket: {demande.ticket}</p>
                  </div>
                  <StatusBadge status={demande.status} />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations du demandeur</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nom:</span> {demande.demandeurLastName}</p>
                      <p><span className="font-medium">Prénom:</span> {demande.demandeurFirstName}</p>
                      <p><span className="font-medium">Email:</span> {demande.demandeurEmail}</p>
                      <p><span className="font-medium">Téléphone:</span> {demande.demandeurPhone}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Détails de la demande</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Date de soumission:</span> {formatDate(demande.createdAt)}</p>
                      <p><span className="font-medium">Dernière mise à jour:</span> {formatDate(demande.updatedAt)}</p>
                      {demande.documents && demande.documents.length > 0 && (
                        <p><span className="font-medium">Documents:</span> {demande.documents.length} fichier(s)</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historique des statuts */}
            {demande.statusHistory && demande.statusHistory.length > 0 && (
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                  <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Historique de traitement
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {demande.statusHistory.map((history, index) => {
                      const config = STATUS_CONFIG[history.status];
                      const IconComponent = config.icon;
                      
                      return (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-full ${config.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-medium text-gray-900">{config.label}</h5>
                              <span className="text-xs text-gray-500">
                                {formatDate(history.changedAt)}
                              </span>
                            </div>
                            {history.comment && (
                              <p className="text-sm text-gray-600">{history.comment}</p>
                            )}
                            {history.changedBy && (
                              <p className="text-xs text-gray-500 mt-1">
                                Par: {history.changedBy}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-4">Besoin d'aide ?</h4>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                      <FileText className="w-4 h-4 mr-2" />
                      Télécharger le récépissé
                    </Button>
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                      Contacter l'ambassade
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Pour toute question, contactez-nous au +225 XX XX XX XX XX ou par email à contact@ambassade-tchad.ci
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        {!demande && !error && searchTicket === '' && (
          <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Comment utiliser le suivi ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-yellow-700">
                <p>1. <strong>Récupérez votre ticket:</strong> Après avoir soumis votre demande, vous avez reçu un numéro de ticket unique.</p>
                <p>2. <strong>Entrez le ticket:</strong> Saisissez ce numéro dans le champ ci-dessus (format: TCH-YYYY-XXXXXX).</p>
                <p>3. <strong>Consultez le statut:</strong> Vous verrez l'état actuel de votre demande et son historique.</p>
                <p>4. <strong>Restez informé:</strong> Vous recevrez également des notifications par email à chaque étape.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}