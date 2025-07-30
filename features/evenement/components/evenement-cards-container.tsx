"use client";

import React, { useState } from "react";
import { IEvenement } from "@/types/evenement.types";
import { EvenementDTO } from "../schemas/evenement.schema";
import { EvenementList } from "./evenement-list/evenement-list";
import { EvenementViewModal } from "./evenement-modal/evenement-view-modal";
import { EvenementEditModal } from "./evenement-modal/evenement-edit-modal";
import { useEvenementListTable } from "../hooks/useEvenementListTable";
import { toast } from "sonner";

const EvenementCardsContainer: React.FC = () => {
  // États des modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEvenement, setCurrentEvenement] = useState<IEvenement | null>(null);

  // Hook personnalisé pour la logique métier
  const {
    data: evenements,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useEvenementListTable();

  // Gestionnaires d'événements
  const handleView = (evenement: IEvenement) => {
    setCurrentEvenement(evenement);
    setIsViewModalOpen(true);
  };

  const handleEdit = (evenement: IEvenement) => {
    setCurrentEvenement(evenement);
    setIsEditModalOpen(true);
  };

  const handleDeleteEvent = async (evenement: IEvenement) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${evenement.title}" ?`)) {
      try {
        await handleDelete(evenement.id);
        toast.success("Événement supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleCreateNew = () => {
    setCurrentEvenement(null);
    setIsEditModalOpen(true);
  };

  const handleSubmitCreate = async (formData: EvenementDTO) => {
    try {
      await handleCreate(formData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  const handleSubmitEdit = async (formData: EvenementDTO) => {
    if (!currentEvenement) return;

    try {
      await handleUpdate(currentEvenement.id, formData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentEvenement(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEvenement(null);
  };

  const handleEditFromView = (evenement: IEvenement) => {
    setIsViewModalOpen(false);
    setCurrentEvenement(evenement);
    setIsEditModalOpen(true);
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Erreur lors du chargement des événements</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EvenementList
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteEvent}
        onCreate={handleCreateNew}
      />

      {/* Modal de visualisation */}
      <EvenementViewModal
        evenement={currentEvenement}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        onEdit={handleEditFromView}
      />

      {/* Modal d'édition/création */}
      <EvenementEditModal
        evenement={currentEvenement}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={currentEvenement ? handleSubmitEdit : handleSubmitCreate}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EvenementCardsContainer; 