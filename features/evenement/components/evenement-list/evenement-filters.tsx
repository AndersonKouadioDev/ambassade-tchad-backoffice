"use client";

import React from "react";
import { Search, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EvenentFiltersProps {
  filters: {
    title: string;
    published: "true" | "false" | "all" | null;
    eventDate: string;
  };
  onTextFilterChange: (
    filterName: "title" | "authorId" | "eventDate",
    value: string
  ) => void;
  onPublishedFilterChange: (value: string) => void;
  onCreate: () => void;
}

export const EvenementFilters: React.FC<EvenentFiltersProps> = ({
  filters,
  onTextFilterChange,
  onPublishedFilterChange,
  onCreate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un évènement..."
            value={filters.title || ""}
            onChange={(e) => onTextFilterChange("title", e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher par date d'évènement..."
            type="date"
            value={filters.eventDate || ""}
            onChange={(e) => onTextFilterChange("eventDate", e.target.value)}
            className="pl-10 w-full"
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

      <Button onClick={onCreate} className="w-full sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        Créer un évènement
      </Button>
    </div>
  );
};
