"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PhotoFiltersProps {
  filters: {
    title: string;
    description: string;
  };
  onTextFilterChange: (
    filterName: "title" | "description",
    value: string
  ) => void;
  onCreate: () => void;
}

export const PhotoFilters: React.FC<PhotoFiltersProps> = ({
  filters,
  onTextFilterChange,
  onCreate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher une photo..."
            value={filters.title || ""}
            onChange={(e) => onTextFilterChange("title", e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>

        <Select
          value={filters.description || "all"}
          onValueChange={(value) => onTextFilterChange("description", value)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Rechercher par description" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onCreate} className="w-full sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        Créer une photo
      </Button>
    </div>
  );
};
