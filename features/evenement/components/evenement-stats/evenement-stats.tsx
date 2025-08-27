"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, CalendarCheck, CalendarX } from "lucide-react";
import { useEvenementStats } from "../../queries/evenement-stats.query";

export function EvenementStats() {
  const { data: stats, isError, isLoading } = useEvenementStats();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  if (isLoading || isError) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-4 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total des événements */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total des événements
          </CardTitle>
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(stats?.total || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Toutes les événements confondues
          </p>
        </CardContent>
      </Card>

      {/* Événements publiés */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Événements publiés
          </CardTitle>
          <CalendarCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {formatNumber(stats?.published || 0)}
          </div>
          <p className="text-xs text-muted-foreground">Événements en ligne</p>
        </CardContent>
      </Card>

      {/* Événements non publiés */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Événements en brouillon
          </CardTitle>
          <CalendarX className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatNumber(stats?.unpublished || 0)}
          </div>
          <p className="text-xs text-muted-foreground">Événements en attente</p>
        </CardContent>
      </Card>

      {/* Auteurs actifs */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Auteurs actifs
          </CardTitle>
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(stats?.byAuthor?.length || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Auteurs ayant créé des événements
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
