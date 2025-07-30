"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EvenementEmptyStateProps {
  onCreate: () => void;
}

export const EvenementEmptyState: React.FC<EvenementEmptyStateProps> = ({
  onCreate,
}) => {
  const t = useTranslations("contenu.gestionEvenement");

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-semibold text-default-900 mb-2">
          {t("empty_state.title")}
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          {t("empty_state.description")}
        </p>
        
        <Button onClick={onCreate} className="bg-embassy-blue-600 hover:bg-embassy-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          {t("actions.create")}
        </Button>
      </CardContent>
    </Card>
  );
}; 