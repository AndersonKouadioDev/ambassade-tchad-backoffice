"use client";

import { useDepenseList } from "../../hooks/use-depense-list";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TableAction({
  modalHandlers,
}: Pick<ReturnType<typeof useDepenseList>, "modalHandlers">) {
  return (
    <div className="flex items-center justify-end py-2 px-5">
      <Button
        onClick={() => modalHandlers.setAddOpen(true)}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Ajouter une dépense
      </Button>
    </div>
  );
}
