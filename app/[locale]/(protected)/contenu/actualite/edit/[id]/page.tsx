import React from "react";
import { BookOpen } from "lucide-react";
import {
  getActualiteDetailAction,} from "@/features/actualites/actions/actualites.action";
import { ButtonGoLink } from "@/components/blocks/button-goLink";
import { getTranslations } from "next-intl/server";
import { IActualite } from "@/features/actualites/types/actualites.type";
import { ActualiteNotFound } from "@/features/actualites/components/actualite-not-found";
import { ActualiteForm } from "@/features/actualites/components/actualite-form/actualite-form";

interface EditActualitePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditActualitePage({
  params,
}: EditActualitePageProps) {
  const { id } = await params;

  if (!id) {
    return ActualiteNotFound();
  }
  let actualite: IActualite;

  try {
    actualite = await getActualiteDetailAction(id);
  } catch (error) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-embassy-blue-600 to-embassy-blue-700 dark:from-embassy-blue-800 dark:to-embassy-blue-900 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
          <div className="flex items-center gap-4">
            <ButtonGoLink href="/contenu/actualite" />
            <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Erreur</h1>
              <p className="text-embassy-blue-100 dark:text-embassy-blue-200 mt-2">
                Actualité non trouvée
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              L&apos;actualité demandée n&apos;a pas été trouvée ou une erreur
              s&apos;est produite.
            </p>
            <ButtonGoLink href="/contenu/actualite">
              Retour à la liste
            </ButtonGoLink>
          </div>
        </div>
      </div>
    );
  }

  const t = getTranslations("contenu.gestionActualite");

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-embassy-blue-600 to-embassy-blue-700 dark:from-embassy-blue-800 dark:to-embassy-blue-900 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <ButtonGoLink href="/contenu/actualite" />
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Modifier l&apos;actualité</h1>
            <p className="text-embassy-blue-100 dark:text-embassy-blue-200 mt-2">
              Modifiez le contenu et les paramètres de l&apos;actualité
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <ActualiteForm actualite={actualite} />
      </div>
    </div>
  );
}
