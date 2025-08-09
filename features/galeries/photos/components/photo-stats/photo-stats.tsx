"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  CalendarX,
  FileText,
  Eye,
  BookOpen,
} from "lucide-react";
import { StatusBlock } from "@/components/blocks/status-block";
import { useTranslations } from "next-intl";
import { usePhotoStats } from "../../queries/photo-stats.query";

export function PhotoStats() {
  const t = useTranslations("contenu.gestionPhoto");

  const { data: stats, isLoading } = usePhotoStats();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  if (isLoading) {
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

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusBlock
          title={t("total_photo")}
          total="8"
          iconWrapperClass="bg-orange-100 dark:bg-orange-900/30"
          chartColor="#FB923C"
          icon={<FileText className="w-5 h-5 text-orange-600" />}
        />
        <StatusBlock
          title={t("total_photo")}
          total="15"
          iconWrapperClass="bg-emerald-100 dark:bg-emerald-900/30"
          chartColor="#10B981"
          icon={<Eye className="w-5 h-5 text-emerald-600" />}
        />
        <StatusBlock
          title={t("total_photo")}
          total="28"
          icon={<BookOpen className="w-5 h-5 text-primary-600" />}
          iconWrapperClass="bg-primary-100 dark:bg-primary-900/30"
          chartColor="#2563EB"
        />
        <StatusBlock
          title="Nombre de photos"
          total="3,456"
          icon={<Users className="w-5 h-5 text-primary" />}
          iconWrapperClass="bg-primary/10 dark:bg-primary/30"
          chartColor="#FBBF24"
        />
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total des actualités */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total des photos
          </CardTitle>
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(stats.total)}
          </div>
          <p className="text-xs text-muted-foreground">
            Toutes les photos confondues
          </p>
        </CardContent>
      </Card>

      {/* Actualités publiées */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Photos publiées
          </CardTitle>
          <CalendarCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {formatNumber(stats.total)}
          </div>
          <p className="text-xs text-muted-foreground">Photos en ligne</p>
        </CardContent>
      </Card>

      {/* Actualités non publiées */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Photos en brouillon
          </CardTitle>
          <CalendarX className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatNumber(stats.total)}
          </div>
          <p className="text-xs text-muted-foreground">Photos en attente</p>
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
              {formatNumber(stats.total)}
          </div>
          <p className="text-xs text-muted-foreground">
            Auteurs ayant créé des actualités
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
