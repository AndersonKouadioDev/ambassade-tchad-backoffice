"use client"
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export function ActualiteNotFound() {
  const router = useRouter();
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-embassy-blue-600 to-embassy-blue-700 dark:from-embassy-blue-800 dark:to-embassy-blue-900 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
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
            <p className="text-embassy-blue-100 dark:text-embassy-blue-200 mt-2">
              ID d&apos;actualité manquant
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            L&apos;identifiant de l&apos;actualité est manquant.
          </p>
          <Button
            onClick={() => router.push("/contenu/actualite")}
            className="mt-4"
          >
            Retour à la liste
          </Button>
        </div>
      </div>
    </div>
  );
}
