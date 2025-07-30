"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IEvenement } from "@/types/evenement.types";
import { EvenementDTO } from "../../schemas/evenement.schema";
import { ContentModal, ContentModalField } from "@/components/ui/content-modal";
import { toast } from "sonner";

interface EvenementEditModalProps {
  evenement: IEvenement | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EvenementDTO, formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

export const EvenementEditModal: React.FC<EvenementEditModalProps> = ({
  evenement,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const t = useTranslations("contenu.gestionEvenement");

  // Définition des champs du formulaire pour les événements
  const formFields: ContentModalField[] = [
    {
      key: "title",
      type: "text",
      label: t("fields.title"),
      placeholder: "Entrez le titre de l'événement...",
      required: true
    },
    {
      key: "eventDate",
      type: "date",
      label: t("fields.eventDate"),
      required: true
    },
    {
      key: "location",
      type: "text",
      label: t("fields.location"),
      placeholder: "Lieu de l'événement..."
    },
    {
      key: "description",
      type: "textarea",
      label: t("fields.description"),
      placeholder: "Décrivez l'événement...",
      required: true,
      rows: 4
    },
    {
      key: "imageUrl",
      type: "file",
      label: t("fields.imageUrl"),
      accept: "image/*",
      placeholder: "Ajoutez des images pour l'événement..."
    },
    {
      key: "published",
      type: "select",
      label: t("fields.published"),
      required: true,
      options: [
        { value: "true", label: t("status.publie") },
        { value: "false", label: t("status.brouillon") }
      ]
    }
  ];

  // Préparer les données pour l'édition
  const getEditData = (evenement: IEvenement) => {
    return {
      title: evenement.title,
      description: evenement.description,
      eventDate: evenement.eventDate ? new Date(evenement.eventDate).toISOString().split('T')[0] : "",
      location: evenement.location || "",
      imageUrl: evenement.imageUrl || [],
      published: evenement.published ? "true" : "false"
    };
  };

  const handleSubmit = async (formData: any) => {
    try {
      console.log('Modal - Données reçues du formulaire:', formData);
      console.log('Modal - imageUrl reçu:', formData.imageUrl);
      console.log('Modal - Type de imageUrl:', typeof formData.imageUrl);
      console.log('Modal - Est-ce un tableau?', Array.isArray(formData.imageUrl));
      
      // Créer un FormData pour l'envoi de fichiers
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      // Convertir la date au format ISO-8601 complet
      let eventDateString;
      if (formData.eventDate instanceof Date) {
        eventDateString = formData.eventDate.toISOString();
      } else if (typeof formData.eventDate === 'string') {
        // Si c'est une chaîne de date (YYYY-MM-DD), la convertir en Date puis en ISO
        const date = new Date(formData.eventDate);
        eventDateString = date.toISOString();
      } else {
        eventDateString = new Date().toISOString();
      }
      
      formDataToSend.append('eventDate', eventDateString);
      formDataToSend.append('location', formData.location || "");
      formDataToSend.append('published', formData.published === "true" ? "true" : "false");
      
      // Ajouter les fichiers avec le nom 'images' comme attendu par le backend
      const imageFiles = Array.isArray(formData.imageUrl) ? formData.imageUrl : [];
      
      if (imageFiles.length > 0) {
        console.log('Modal - Ajout de fichiers au FormData');
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          console.log(`Modal - Fichier ${i}:`, file);
          console.log(`Modal - Type du fichier ${i}:`, typeof file);
          console.log(`Modal - Est-ce un File? ${i}:`, file instanceof File);
          formDataToSend.append('images', file);
        }
      } else {
        console.log('Modal - Aucun fichier à ajouter, création d\'un fichier factice');
        // Créer un fichier factice pour éviter l'erreur backend
        const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
        formDataToSend.append('images', emptyFile);
      }

      // Log du contenu du FormData
      console.log('Modal - FormData créé:');
      const formDataEntries = Array.from(formDataToSend.entries());
      for (const [key, value] of formDataEntries) {
        console.log(`Modal - ${key}:`, value);
      }

      // Convertir pour la validation (sans les fichiers)
      const eventData: EvenementDTO = {
        title: formData.title,
        description: formData.description,
        eventDate: eventDateString, // Utiliser la même conversion que pour FormData
        location: formData.location || "",
        imageUrl: imageFiles.length > 0 ? imageFiles.map((f: File) => f.name) : [],
        published: formData.published === "true"
      };

      console.log('Modal - Données converties pour validation:', eventData);

      await onSubmit(eventData, formDataToSend);
      onClose();
      toast.success(evenement ? "Événement modifié avec succès" : "Événement créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Erreur lors de l'opération");
    }
  };

  return (
    <ContentModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={evenement ? t("modal.edit_title") : t("modal.create_title")}
      description={evenement ? "Modifiez les informations de cet événement" : "Créez un nouvel événement pour informer vos visiteurs"}
      fields={formFields}
      initialData={evenement ? getEditData(evenement) : {}}
      isEditing={!!evenement}
      isLoading={isLoading}
      translationNamespace="contenu.gestionEvenement"
    />
  );
}; 