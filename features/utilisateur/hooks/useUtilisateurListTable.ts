import { useState, useMemo } from "react";
import {
    SortingState,
    VisibilityState,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import { useQueryStates } from 'nuqs';
import { utilisateurFiltersClient } from '../filters/utilisateur.filters';
import { IUtilisateursRechercheParams } from "../types/utilisateur.type";
import { useUtilisateursList } from "../queries/utilisateur-list.query";
import { DataProps } from '../components/user-list-table/column';

export function useUtilisateurListTable(columns: any[]) {
    // États pour le tri et la visibilité des colonnes et la sélection des lignes gérés par React Table
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Gestion des paramètres d'URL via Nuqs
    const [filters, setFilters] = useQueryStates(utilisateurFiltersClient, {
        clearOnDefault: true
    });

    // Construction des paramètres de recherche par défaut pour React Query
    const currentSearchParams: IUtilisateursRechercheParams = useMemo(() => {
        return {
            page: filters.page,
            limit: filters.limit,
            firstName: filters.firstName || undefined,
            lastName: filters.lastName || undefined,
            email: filters.email || undefined,
            phoneNumber: filters.phoneNumber || undefined,
            type: filters.type,
            status: filters.status,
            role: filters.role || undefined,
        };
    }, [filters]);

    // Récupération des données
    const { data, isLoading, isError, error } = useUtilisateursList(currentSearchParams);

    const users = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;

    // États et gestionnaires pour les modales
    const [addOpen, setAddOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<DataProps | null>(null);

    const handleViewUser = (user: DataProps) => {
        setCurrentUser(user);
        setViewOpen(true);
    };

    const handleEditUser = (user: DataProps) => {
        setCurrentUser(user);
        setEditOpen(true);
    };

    const handleDeleteUser = (user: DataProps) => {
        setCurrentUser(user);
        setDeleteOpen(true);
    };

    /**
     * @function handleTextFilterChange
     * @description Gère les changements pour les champs de filtre textuels.
     * Met à jour le filtre correspondant dans l'état Nuqs et réinitialise la page à 1.
     * @param {'firstName' | 'lastName' | 'email' | 'phoneNumber'} filterName Le nom du filtre.
     * @param {string} value La nouvelle valeur.
     */
    const handleTextFilterChange = (filterName: 'firstName' | 'lastName' | 'email' | 'phoneNumber', value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value,
            page: 1, // Réinitialise à la première page
        }));
    };

    /**
     * @function handleEnumFilterChange
     * @description Gère les changements pour les champs de filtre d'enum.
     * Met à jour le filtre correspondant dans l'état Nuqs et réinitialise la page à 1.
     * @param {'type' | 'status' | 'role'} filterName Le nom du filtre.
     * @param {string} value La nouvelle valeur (chaîne).
     */
    const handleEnumFilterChange = (filterName: 'type' | 'status' | 'role', value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value === "_all_" ? "" : value,
            page: 1, // Réinitialise à la première page
        }));
    };

    // Configuration de TanStack Table
    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        // onColumnFiltersChange: setColumnFilters, // Nuqs gère le filtrage
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // getFilteredRowModel n'est pas nécessaire car le filtrage est côté serveur
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        pageCount: totalPages,
        state: {
            sorting,
            // columnFilters, // Géré par Nuqs
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: (filters.page || 1) - 1,
                pageSize: filters.limit || 10,
            },
        },
        onPaginationChange: (updater) => {
            const newState = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
            setFilters(prev => ({
                ...prev,
                page: newState.pageIndex + 1,
                limit: newState.pageSize,
            }));
        },
        meta: {
            onView: handleViewUser,
            onEdit: handleEditUser,
            onDelete: handleDeleteUser,
        },
    });

    return {
        table,
        isLoading,
        isError,
        error,
        handleTextFilterChange,
        handleEnumFilterChange,
        modalStates: {
            addOpen,
            viewOpen,
            editOpen,
            deleteOpen,
        },
        modalHandlers: {
            setAddOpen,
            setViewOpen,
            setEditOpen,
            setDeleteOpen,
        },
        currentUser,
        filters
    };
}