"use client";
import { ButtonGoLink } from "@/components/blocks/button-goLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export function ActualiteNotFound() {
  const router = useRouter();
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/contenu/actualite")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Erreur</h1>
            <p className="text-primary-100 dark:text-primary-200 mt-2">
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
