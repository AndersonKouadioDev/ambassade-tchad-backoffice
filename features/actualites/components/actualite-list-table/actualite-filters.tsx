"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface ActualiteFiltersProps {
  filters: {
    title: string;
    published: "true" | "false" | "all" | null;
  };
  onTextFilterChange: (
    filterName: "title" | "description" | "authorId",
    value: string
  ) => void;
  onPublishedFilterChange: (value: string) => void;
}

export const ActualiteFilters: React.FC<ActualiteFiltersProps> = ({
  filters,
  onTextFilterChange,
  onPublishedFilterChange,
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher une actualité..."
            value={filters.title || ""}
            onChange={(e) => onTextFilterChange("title", e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>

        <Select
          value={filters.published || "all"}
          onValueChange={onPublishedFilterChange}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="État de publication" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les états</SelectItem>
            <SelectItem value="true">Publié</SelectItem>
            <SelectItem value="false">Brouillon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={() => router.push("/contenu/actualite/create")}
        className="w-full sm:w-auto"
      >
        <Plus className="w-4 h-4 mr-2" />
        Créer une actualité
      </Button>
    </div>
  );
};
