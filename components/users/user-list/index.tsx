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
import AddUserModal from "../user-modal/add-user";
import { ViewUserModal } from "../user-modal/view-user";
import { EditUserModal } from "../user-modal/edit-user";
import { DeleteUserModal } from "../user-modal/delete-user";
import type { DataProps } from "./column";

const UserList = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isOpen, setIsOpen] = React.useState(false);

  const [formData, setFormData] = React.useState({
    user: { name: "", image: "" },
    service: "",
    post: "",
    role: "",
  });

  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<DataProps | null>(null);
  const [data, setData] = React.useState<DataProps[]>([]);
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
      onView: (user: DataProps) => {
        setCurrentUser(user);
        setViewOpen(true);
      },
      onEdit: (user: DataProps) => {
        setCurrentUser(user);
        setEditOpen(true);
      },
      onDelete: (user: DataProps) => {
        setCurrentUser(user);
        setDeleteOpen(true);
      },
    },
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: DataProps = {
      id: Date.now(),
      user: { ...formData.user },
      service: formData.service,
      post: formData.post,
      role: formData.role as DataProps["role"],
    };
    setData((prev) => [newUser, ...prev]);
    setFormData({
      user: { name: "", image: "" },
      service: "",
      post: "",
      role: "",
    });
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-5">
        <div className="text-xl font-medium text-default-900">
          Liste des utilisateurs
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Filtrer par statut..."
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("status")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm"
          >
            Ajouter un utilisateur
          </button>
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

      <AddUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddUser}
      />

      {currentUser && (
        <>
          <ViewUserModal
            isOpen={viewOpen}
            setIsOpen={setViewOpen}
            user={currentUser}
          />
          <EditUserModal
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            user={currentUser}
            onChange={() => {}}
            onSubmit={() => {}}
          />
          <DeleteUserModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            user={currentUser}
            onDelete={() => {}}
          />
        </>
      )}
    </div>
  );
};

export default UserList;
