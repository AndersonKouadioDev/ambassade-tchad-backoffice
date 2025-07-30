"use client";
import { Input } from "@/components/ui/input";
import {
  UtilisateurRole,
  UtilisateurStatus,
  UtilisateurType,
} from "../../types/utilisateur.type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUtilisateurListTable } from "../../hooks/useUtilisateurListTable";

export default function TableOptions({
  handleTextFilterChange,
  handleEnumFilterChange,
  modalHandlers,
  filters,
}: Pick<
  ReturnType<typeof useUtilisateurListTable>,
  | "handleTextFilterChange"
  | "handleEnumFilterChange"
  | "modalHandlers"
  | "filters"
>) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-5">
        <div className="flex flex-wrap gap-3">
          {/* <Input
            placeholder="Filtrer par prénom..."
            value={filters.firstName}
            onChange={(e) =>
              handleTextFilterChange("firstName", e.target.value)
            }
            className="max-w-sm"
          />
          <Input
            placeholder="Filtrer par nom..."
            value={filters.lastName}
            onChange={(e) => handleTextFilterChange("lastName", e.target.value)}
            className="max-w-sm"
          /> */}
          <Input
            placeholder="Filtrer par email..."
            value={filters.email}
            onChange={(e) => handleTextFilterChange("email", e.target.value)}
            className="max-w-sm"
          />
          <Input
            placeholder="Filtrer par téléphone..."
            value={filters.phoneNumber}
            onChange={(e) =>
              handleTextFilterChange("phoneNumber", e.target.value)
            }
            className="max-w-sm"
          />
          <Select
            onValueChange={(value) => handleEnumFilterChange("type", value)}
            value={filters.type}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all_">Tous les types</SelectItem>
              {Object.values(UtilisateurType).map((typeValue) => (
                <SelectItem key={typeValue} value={typeValue}>
                  {typeValue.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => handleEnumFilterChange("status", value)}
            value={filters.status}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all_">Tous les statuts</SelectItem>
              {Object.values(UtilisateurStatus).map((statusValue) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {statusValue.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => handleEnumFilterChange("role", value)}
            value={filters.role || "_all_"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all_">Tous les rôles</SelectItem>
              {Object.values(UtilisateurRole).map((roleValue) => (
                <SelectItem key={roleValue} value={roleValue}>
                  {roleValue.replace(/_/g, " ").toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={() => modalHandlers.setAddOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm"
          >
            Ajouter un utilisateur
          </button>
        </div>
      </div>
    </div>
  );
}
