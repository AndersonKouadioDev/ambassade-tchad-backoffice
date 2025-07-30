"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { IEvenement } from "@/types/evenement.types";
import { EvenementCard } from "./evenement-card";
import { EvenementFilters } from "./evenement-filters";
import { EvenementEmptyState } from "./evenement-empty-state";
import { EvenementPagination } from "./evenement-pagination";
import { useEvenementListTable } from "../../hooks/useEvenementListTable";
import { EvenementListSkeleton } from "./evenement-list-skeleton";

interface EvenementListProps {
  onView: (evenement: IEvenement) => void;
  onEdit: (evenement: IEvenement) => void;
  onDelete: (evenement: IEvenement) => void;
  onCreate: () => void;
}

export const EvenementList: React.FC<EvenementListProps> = ({
  onView,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const t = useTranslations("contenu.gestionEvenement");
  
  const {
    data: evenements,
    isLoading,
    error,
    filters,
    pagination,
    handleTextFilterChange,
    handlePublishedFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
  } = useEvenementListTable();

  if (isLoading) {
    return <EvenementListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{t("errors.loading_error")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EvenementFilters
        filters={{
          title: filters.title,
          published: filters.published === null ? undefined : filters.published,
        }}
        onTextFilterChange={handleTextFilterChange}
        onPublishedFilterChange={handlePublishedFilterChange}
        onCreate={onCreate}
      />

      {evenements.length === 0 ? (
        <EvenementEmptyState onCreate={onCreate} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {evenements.map((evenement: IEvenement) => (
              <EvenementCard
                key={evenement.id}
                evenement={evenement}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <EvenementPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}; 