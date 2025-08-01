"use client";

import { EvenementChart } from "@/features/evenement/components/evenement-stats/evenement-chart";
import EvenementCardsContainer from "@/features/evenement/components/evenement-cards-container";
import { Calendar, CalendarCheck, CalendarX, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEvenementStats } from "@/features/evenement/queries/evenement-stats.query";

export default function EvenementListPage() {
  const t = useTranslations("contenu.gestionEvenement");
  const { data: stats, isLoading, error } = useEvenementStats();

  // Fonction pour formater les nombres avec des virgules
  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };



  // Gestion des erreurs
  if (error) {
    console.error("Erreur lors du chargement des statistiques:", error);
  }

  return (
    <div className="space-y-8">
      {/* En-tête avec titre et description */}
      <div className="bg-gradient-to-r from-embassy-blue-600 to-embassy-blue-700 dark:from-embassy-blue-800 dark:to-embassy-blue-900 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-embassy-blue-100 dark:text-embassy-blue-200 mt-2">
              Gérez et organisez vos événements avec une interface moderne et intuitive
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton loading pour les statistiques
          <>
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-[45px] w-[124px] bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </>
        ) : error ? (
          // Message d'erreur
          <div className="col-span-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <CalendarX className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Erreur de chargement
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Impossible de charger les statistiques. Veuillez réessayer.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
                         <EvenementChart
               title={t("total_brouillon")}
               total={formatNumber(stats?.unpublishedEvents || 0)}
               iconWrapperClass="bg-orange-100 dark:bg-orange-900/30"
               chartColor="#FB923C"
               icon={<CalendarX className="w-5 h-5 text-orange-600" />}
               series={[]}
             />

             <EvenementChart
               title={t("total_publie")}
               total={formatNumber(stats?.publishedEvents || 0)}
               iconWrapperClass="bg-emerald-100 dark:bg-emerald-900/30"
               chartColor="#10B981"
               icon={<CalendarCheck className="w-5 h-5 text-emerald-600" />}
               series={[]}
             />
             <EvenementChart
               title={t("total_evenement")}
               total={formatNumber(stats?.totalEvents || 0)}
               icon={<Calendar className="w-5 h-5 text-embassy-blue-600" />}
               iconWrapperClass="bg-embassy-blue-100 dark:bg-embassy-blue-900/30"
               chartColor="#2563EB"
               series={[]}
             />
             <EvenementChart
               title="Événements à venir"
               total={formatNumber(stats?.upcomingEvents || 0)}
               icon={<Users className="w-5 h-5 text-embassy-yellow-600" />}
               iconWrapperClass="bg-embassy-yellow-100 dark:bg-embassy-yellow-900/30"
               chartColor="#FBBF24"
               series={[]}
             />
          </>
        )}
      </div>

      {/* Composant principal des événements */}
      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <EvenementCardsContainer />
      </div>
    </div>
  );
}
