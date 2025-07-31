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

interface ActualiteFiltersProps {
  filters: {
    title: string;
    published: 'true' | 'false' | 'all' | null;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'all' | null;
  };
  onTextFilterChange: (filterName: 'title' | 'description' | 'authorId', value: string) => void;
  onPublishedFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onCreate: () => void;
}

export const ActualiteFilters: React.FC<ActualiteFiltersProps> = ({
  filters,
  onTextFilterChange,
  onPublishedFilterChange,
  onStatusFilterChange,
  onCreate,
}) => {
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

        <Select
          value={filters.status || "all"}
          onValueChange={onStatusFilterChange}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="DRAFT">Brouillon</SelectItem>
            <SelectItem value="PUBLISHED">Publié</SelectItem>
            <SelectItem value="ARCHIVED">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onCreate} className="w-full sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        Créer une actualité
      </Button>
    </div>
  );
}; 