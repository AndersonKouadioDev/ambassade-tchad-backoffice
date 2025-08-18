"use client";

import React from "react";
import {Search, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";

interface VideoFiltersProps {
    filters: {
        title: string;
        youtubeUrl?: string;
    };
    onTextFilterChange: (
        filterName: "title" | "youtubeUrl",
        value: string
    ) => void;
}

export const VideoFilters: React.FC<VideoFiltersProps> = ({
                                                              filters,
                                                              onTextFilterChange,
                                                          }) => {
    const router = useRouter();
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                    <Input
                        placeholder="Rechercher une video..."
                        value={filters.title || ""}
                        onChange={(e) => onTextFilterChange("title", e.target.value)}
                        className="pl-10 w-full sm:w-64"
                    />
                </div>
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                    <Input
                        placeholder="Rechercher une video..."
                        value={filters.youtubeUrl || ""}
                        onChange={(e) => onTextFilterChange("youtubeUrl", e.target.value)}
                        className="pl-10 w-full sm:w-64"
                    />
                </div>
            </div>

            <Button
                onClick={() => router.push("/contenu/galerie-video/create")}
                className="w-full sm:w-auto"
            >
                <Plus className="w-4 h-4 mr-2"/>
                Créer une video
            </Button>
        </div>
    );
};
