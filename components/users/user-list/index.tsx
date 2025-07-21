"use client"

import * as React from "react"
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
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RefreshCw, Plus, Filter, Users, UserCheck, UserX } from "lucide-react"
import { columns } from "./column"
import AddUserModal from "../user-modal/add-user"
import { ViewUserModal } from "../user-modal/view-user"
import { EditUserModal } from "../user-modal/edit-user"
import { DeleteUserModal } from "../user-modal/delete-user"
import { useUsers, useUserStats } from "@/hooks/use-users"
import type { User } from "@/types/user"

const UserList = () => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isOpen, setIsOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)

  // États pour les filtres API
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    status: '',
    service: ''
  })

  // Hooks API
  const { data: usersData, isLoading, error, refetch } = useUsers(filters)
  const { data: statsData, isLoading: isStatsLoading } = useUserStats()

  // Gestionnaires de filtres
  const handleSearchFilter = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }))
  }

  const handleRoleFilter = (value: string) => {
    setFilters(prev => ({ ...prev, role: value, page: 1 }))
  }

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ ...prev, status: value, page: 1 }))
  }

  const handleServiceFilter = (value: string) => {
    setFilters(prev => ({ ...prev, service: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const table = useReactTable({
    data: usersData?.data || [],
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
      onView: (user: User) => {
        setCurrentUser(user)
        setViewOpen(true)
      },
      onEdit: (user: User) => {
        setCurrentUser(user)
        setEditOpen(true)
      },
      onDelete: (user: User) => {
        setCurrentUser(user)
        setDeleteOpen(true)
      },
    },
  })

  // Gestion des erreurs
  if (error) {
    return (
      <div className="w-full p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erreur lors du chargement des utilisateurs: {error.message}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="ml-2"
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-background">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Total</span>
          </div>
          <div className="text-2xl font-bold">
            {isStatsLoading ? <Skeleton className="h-8 w-16" /> : statsData?.total || 0}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Actifs</span>
          </div>
          <div className="text-2xl font-bold">
            {isStatsLoading ? <Skeleton className="h-8 w-16" /> : statsData?.active || 0}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-muted-foreground">Inactifs</span>
          </div>
          <div className="text-2xl font-bold">
            {isStatsLoading ? <Skeleton className="h-8 w-16" /> : statsData?.inactive || 0}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-muted-foreground">Administrateurs</span>
          </div>
          <div className="text-2xl font-bold">
            {isStatsLoading ? <Skeleton className="h-8 w-16" /> : statsData?.admins || 0}
          </div>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center justify-between py-4 px-6">
        <div className="text-xl font-medium text-default-900">Liste des utilisateurs</div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button
            onClick={() => setIsOpen(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 px-6 pb-4">
        <Input
          placeholder="Rechercher par nom..."
          value={filters.search}
          onChange={(e) => handleSearchFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filters.role} onValueChange={handleRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les rôles</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="moderator">Modérateur</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.service} onValueChange={handleServiceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les services</SelectItem>
            <SelectItem value="consulaire">Consulaire</SelectItem>
            <SelectItem value="visa">Visa</SelectItem>
            <SelectItem value="administration">Administration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader className="bg-default-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Skeletons de chargement
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {filters.search || filters.role || filters.status || filters.service
                  ? "Aucun utilisateur trouvé avec les filtres appliqués"
                  : "Aucun utilisateur"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination personnalisée avec les données API */}
      {usersData && (
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Affichage de {((usersData.currentPage - 1) * usersData.limit) + 1} à{' '}
            {Math.min(usersData.currentPage * usersData.limit, usersData.total)} sur{' '}
            {usersData.total} utilisateurs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(usersData.currentPage - 1)}
              disabled={usersData.currentPage <= 1 || isLoading}
            >
              Précédent
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: usersData.totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === usersData.totalPages || 
                  Math.abs(page - usersData.currentPage) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <Button
                      variant={page === usersData.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      disabled={isLoading}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))
              }
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(usersData.currentPage + 1)}
              disabled={usersData.currentPage >= usersData.totalPages || isLoading}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Modales */}
      <AddUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
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
          />
          <DeleteUserModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            userId={currentUser.id}
          />
        </>
      )}
    </div>
  )
}

export default UserList
