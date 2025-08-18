import React from "react";
import {BookOpen} from "lucide-react";
import {ButtonGoLink} from "@/components/blocks/button-goLink";
import {EvenementNotFound} from "@/features/evenement/components";
import {EvenementForm} from "@/features/evenement/components/evenement-form/evenement-form";
import {prefetchEvenement} from "@/features/evenement/queries/evenement-details.query";

interface EditEvenementProps {
  params: Promise<{ id: string }>;
}

export default async function EditEvenementPage({
  params,
}: EditEvenementProps) {
  const { id } = await params;

  if (!id) {
    return EvenementNotFound();
  }

  await prefetchEvenement(id)

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <ButtonGoLink href="/contenu/evenement" />
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Modifier l&apos;événement</h1>
            <p className="text-primary-100 mt-2">
              Modifiez le contenu et les paramètres de l&apos;événement
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <EvenementForm id={id} />
      </div>
    </div>
  );
}
