"use client";

import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "./table-pagination";
import { getColumns } from "./column";
import { useUtilisateurListTable } from "../../hooks/useUtilisateurListTable";
import { TableOptions } from "./table-options";
import { Loader2 } from "lucide-react";
import { TableIndicatorFetching } from "./table-indicator-fetching";
import { UtilisateurUpdateModal } from "../utilisateur-modal/utilisateur-update-modal";
import { UtilisateurAddModal } from "../utilisateur-modal/utilisateur-add-modal";
import { UtilisateurDeleteModal } from "../utilisateur-modal/utilisateur-delete-modal";
import { UtilisateurLockUnlockModal } from "../utilisateur-modal/utilisateur-lock-unlock-modal";

export function UtilisateurList({ type }: { type: "personnel" | "demandeur" }) {
  const columns = getColumns({ type });
  const {
    table,
    isLoading,
    isError,
    error,
    isFetching,
    handleTextFilterChange,
    handleEnumFilterChange,
    modalStates,
    modalHandlers,
    currentUser,
    filters,
  } = useUtilisateurListTable({ columns, type });

  return (
    <div className="w-full">
      <TableOptions
        handleTextFilterChange={handleTextFilterChange}
        handleEnumFilterChange={handleEnumFilterChange}
        modalHandlers={modalHandlers}
        filters={filters}
        type={type}
      />

      {/* Indicateur de chargement global */}
      <div className="relative">
        <TableIndicatorFetching isFetching={isFetching} />

        <Table>
          <TableHeader className="bg-default-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // État de chargement initial
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Chargement des données...
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              // État d'erreur
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-destructive">
                    Erreur lors du chargement des données
                    {error?.message && `: ${error.message}`}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              // Données chargées
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={isFetching ? "opacity-70" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Aucun résultat
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />

      {/* Modales - décommentez quand prêtes */}
      <UtilisateurAddModal
        isOpen={modalStates.addOpen}
        setIsOpen={modalHandlers.setAddOpen}
      />

      {currentUser && (
        <>
          <UtilisateurUpdateModal
            isOpen={modalStates.editOpen}
            setIsOpen={modalHandlers.setEditOpen}
            utilisateur={currentUser}
          />
          <UtilisateurDeleteModal
            isOpen={modalStates.deleteOpen}
            setIsOpen={modalHandlers.setDeleteOpen}
            utilisateur={currentUser}
          />
          <UtilisateurLockUnlockModal
            isOpen={modalStates.lockUnlockOpen}
            setIsOpen={modalHandlers.setLockUnlockOpen}
            utilisateur={currentUser}
          />
        </>
      )}
    </div>
  );
}
