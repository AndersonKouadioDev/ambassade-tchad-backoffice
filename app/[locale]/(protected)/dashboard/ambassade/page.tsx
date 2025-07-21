"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Download
} from "lucide-react"
import { useUsers, useUserStats } from "@/hooks/use-users"
import { useDemandes, useDemandeStats } from "@/hooks/use-demandes"
import { useAppointments, useAppointmentStats } from "@/hooks/use-appointments"
import { useVisaRequests, useVisaRequestStats } from "@/hooks/use-visa-requests"
import { useReports } from "@/hooks/use-reports"

const AmbassadeDashboard = () => {
  // Hooks pour les statistiques
  const { data: userStats, isLoading: isUserStatsLoading, error: userStatsError, refetch: refetchUserStats } = useUserStats()
  const { data: demandeStats, isLoading: isDemandeStatsLoading, error: demandeStatsError, refetch: refetchDemandeStats } = useDemandeStats()
  const { data: appointmentStats, isLoading: isAppointmentStatsLoading, error: appointmentStatsError, refetch: refetchAppointmentStats } = useAppointmentStats()
  const { data: visaStats, isLoading: isVisaStatsLoading, error: visaStatsError, refetch: refetchVisaStats } = useVisaRequestStats()

  // Hooks pour les données récentes
  const { data: recentDemandes, isLoading: isDemandesLoading } = useDemandes({ page: 1, limit: 5 })
  const { data: recentUsers, isLoading: isUsersLoading } = useUsers({ page: 1, limit: 5 })
  const { data: recentAppointments, isLoading: isAppointmentsLoading } = useAppointments({ page: 1, limit: 5 })
  const { data: recentVisaRequests, isLoading: isVisaRequestsLoading } = useVisaRequests({ page: 1, limit: 5 })
  const { data: recentReports, isLoading: isReportsLoading } = useReports({ page: 1, limit: 3 })

  const handleRefreshAll = () => {
    refetchUserStats()
    refetchDemandeStats()
    refetchAppointmentStats()
    refetchVisaStats()
  }

  // Gestion des erreurs globales
  const hasErrors = userStatsError || demandeStatsError || appointmentStatsError || visaStatsError

  if (hasErrors) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erreur lors du chargement du tableau de bord. 
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshAll}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* En-tête du dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-default-900">Tableau de Bord</h1>
          <p className="text-muted-foreground">Ambassade du Tchad - Vue d'ensemble</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefreshAll}
          disabled={isUserStatsLoading || isDemandeStatsLoading || isAppointmentStatsLoading || isVisaStatsLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${(isUserStatsLoading || isDemandeStatsLoading || isAppointmentStatsLoading || isVisaStatsLoading) ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Statistiques Utilisateurs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                <div className="flex items-center gap-2">
                  {isUserStatsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{userStats?.total || 0}</p>
                  )}
                  <Badge variant="secondary" className="text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {isUserStatsLoading ? '...' : `${userStats?.active || 0} actifs`}
                  </Badge>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Statistiques Demandes */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Demandes</p>
                <div className="flex items-center gap-2">
                  {isDemandeStatsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{demandeStats?.total || 0}</p>
                  )}
                  <Badge variant="secondary" className="text-orange-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {isDemandeStatsLoading ? '...' : `${demandeStats?.pending || 0} en attente`}
                  </Badge>
                </div>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* Statistiques Rendez-vous */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rendez-vous</p>
                <div className="flex items-center gap-2">
                  {isAppointmentStatsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{appointmentStats?.total || 0}</p>
                  )}
                  <Badge variant="secondary" className="text-blue-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    {isAppointmentStatsLoading ? '...' : `${appointmentStats?.today || 0} aujourd'hui`}
                  </Badge>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Statistiques Visas */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Demandes de Visa</p>
                <div className="flex items-center gap-2">
                  {isVisaStatsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{visaStats?.total || 0}</p>
                  )}
                  <Badge variant="secondary" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {isVisaStatsLoading ? '...' : `${visaStats?.approved || 0} approuvées`}
                  </Badge>
                </div>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections de données récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demandes récentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Demandes Récentes</CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Voir tout
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isDemandesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))
              ) : recentDemandes?.data?.length ? (
                recentDemandes.data.map((demande) => (
                  <div key={demande.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{demande.service}</p>
                        <p className="text-sm text-muted-foreground">{demande.nom} {demande.prenom}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={demande.statut === 'approuvee' ? 'default' : demande.statut === 'en_attente' ? 'secondary' : 'destructive'}
                    >
                      {demande.statut}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Aucune demande récente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rendez-vous récents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rendez-vous Récents</CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Voir tout
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isAppointmentsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))
              ) : recentAppointments?.data?.length ? (
                recentAppointments.data.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.service}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString('fr-FR')} à {appointment.time}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={appointment.status === 'confirmed' ? 'default' : appointment.status === 'pending' ? 'secondary' : 'destructive'}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Aucun rendez-vous récent</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rapports récents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rapports Récents</CardTitle>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Générer rapport
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isReportsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : recentReports?.data?.length ? (
              recentReports.data.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{report.title}</h4>
                    <Badge variant="outline">{report.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Généré le {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-3">
                <p className="text-center text-muted-foreground py-4">Aucun rapport récent</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AmbassadeDashboard