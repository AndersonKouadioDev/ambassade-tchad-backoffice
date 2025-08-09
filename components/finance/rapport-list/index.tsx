"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "./table-pagination";
import { columns } from "./column";
import { data as initialData } from "@/app/[locale]/(protected)/finance/depenses/data";
import type { DataProps } from "./column";
import { Button } from "@/components/ui/button";
// import { ViewDemandeModal } from "../demande-modal/view-demand";
// import { EditDemandeModal } from "../demande-modal/edit-demand";
// import { DeleteDemandeModal } from "../demande-modal/delete-demand";

// This component displays a list of demands with functionalities to view, edit, and delete them.

const DepenseList = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<DataProps[]>(initialData);

  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [currentDemande, setCurrentDemande] = React.useState<DataProps | null>(
    null
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onView: (demande: DataProps) => {
        setCurrentDemande(demande);
        setViewOpen(true);
      },
      onEdit: (demande: DataProps) => {
        setCurrentDemande(demande);
        setEditOpen(true);
      },
      onDelete: (demande: DataProps) => {
        setCurrentDemande(demande);
        setDeleteOpen(true);
      },
    },
  });

  const handleChangeEdit = (field: string, value: string) => {
    if (!currentDemande) return;
    setCurrentDemande({
      ...currentDemande,
      [field]: value,
    });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDemande) return;

    setData((prev) =>
      prev.map((item) =>
        item.id === currentDemande.id ? currentDemande : item
      )
    );
    setEditOpen(false);
  };

  const handleDelete = () => {
    if (!currentDemande) return;
    setData((prev) => prev.filter((item) => item.id !== currentDemande.id));
    setDeleteOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-5">
        <div className="text-xl font-medium text-default-900">
          Liste des depenses
        </div>
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Filtrer par document..."
            value={
              (table.getColumn("document")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("document")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
      <Button
        color="destructive"
        onClick={() => setEditOpen(true)}
        className="ml-3"
      >
        Ajouter une depense
      </Button>
          {/* <Button variant="secondary" onClick={() => setViewOpen(true)}>
            Voir
          </Button> */}
          
        </div>
      </div>  

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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination table={table} />

      {/* {currentDemande && (
        <>
          <ViewDemandeModal
            isOpen={viewOpen}
            setIsOpen={setViewOpen}
            demande={currentDemande}
          />
          <EditDemandeModal
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            demande={currentDemande}
            onChange={handleChangeEdit}
            onSubmit={handleSubmitEdit}
          />
          <DeleteDemandeModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            onConfirm={handleDelete}
          />
        </>
      )} */}
    </div>
  );
};

export default DepenseList;
