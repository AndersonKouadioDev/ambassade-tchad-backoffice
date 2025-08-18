"use client";
import { Loader2 } from "lucide-react";

export function TableIndicatorFetching({
  isFetching,
}: {
  isFetching: boolean;
}) {
  return (
    isFetching && (
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">
            Recherche en cours...
          </span>
        </div>
      </div>
    )
  );
}
