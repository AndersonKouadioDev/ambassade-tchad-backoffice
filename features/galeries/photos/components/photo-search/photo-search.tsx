"use client";

import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPhotoRechercheParams } from "../../types/photo.type";
import { Button } from "@/components/ui/button";

interface PhotoSearchProps {
  onSearch: (params: IPhotoRechercheParams) => void;
  isLoading?: boolean;
}

export const PhotoSearch: React.FC<PhotoSearchProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [searchParams, setSearchParams] = useState<IPhotoRechercheParams>({
    title: "",
    description: "",
    page: 1,
    limit: 10,
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const handleReset = () => {
    const resetParams: IPhotoRechercheParams = {
      title: "",
      description: "",
      page: 1,
      limit: 10,
    };
    setSearchParams(resetParams);
    onSearch(resetParams);
  };

  const handleInputChange = (
    field: keyof IPhotoRechercheParams,
    value: any
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasActiveFilters = () => {
    return searchParams.title || searchParams.description || searchParams.title;
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher par titre ou contenu..."
            value={searchParams.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="pl-10"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtres
          {hasActiveFilters() && (
            <Badge className="ml-1 bg-blue-500 text-white">
              {
                Object.values(searchParams).filter((v) => v && v !== "all")
                  .length
              }
            </Badge>
          )}
        </Button>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Recherche..." : "Rechercher"}
        </Button>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filtres avancés</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Statut de publication */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Rechercher par description
              </label>
              <Select
                value={
                  searchParams.description !== undefined
                    ? searchParams.description.toString()
                    : "all"
                }
                onValueChange={(value) =>
                  handleInputChange(
                    "description",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contenu */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Rechercher par titre
              </label>
              <Input
                placeholder="Rechercher par titre..."
                value={searchParams.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>

            {/* Limite par page */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Par page</label>
              <Select
                value={searchParams.limit?.toString() || "10"}
                onValueChange={(value) =>
                  handleInputChange("limit", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Recherche..." : "Appliquer les filtres"}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      )}

      {/* Indicateurs de filtres actifs */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {searchParams.title && (
            <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800">
              Titre: {searchParams.title}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleInputChange("title", "")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {searchParams.description && (
            <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800">
              Contenu: {searchParams.description}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleInputChange("description", "")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {searchParams.description !== undefined && (
            <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800">
              Description: {searchParams.description}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleInputChange("description", undefined)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {searchParams.title && (
            <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800">
              Titre: {searchParams.title}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleInputChange("title", "")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {searchParams.limit && searchParams.limit !== 10 && (
            <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800">
              Nombre de photos par page: {searchParams.limit}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleInputChange("limit", 10)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
