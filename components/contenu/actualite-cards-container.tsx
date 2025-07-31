"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IActualite } from "@/features/actualites/types/actualites.type";
import { ActualiteCards } from "./actualite-cards";
import { ContentModal, ContentModalField } from "@/components/ui/content-modal";
import { ViewModal } from "@/components/ui/view-modal";
import { toast } from "sonner";
import { data as actualitesData } from "@/app/[locale]/(protected)/contenu/actualite/data";

const ActualiteCardsContainer: React.FC = () => {
  const t = useTranslations("contenu.gestionActualite");
  const [data, setData] = useState<IActualite[]>(actualitesData);
  const [isLoading, setIsLoading] = useState(false);

  // État des modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentActualite, setCurrentActualite] = useState<IActualite | null>(null);

  // Définition des champs du formulaire
  const formFields: ContentModalField[] = [
    {
      key: "titre",
      type: "text",
      label: t("fields.titre"),
      placeholder: "Entrez le titre de l'actualité...",
      required: true
    },
    {
      key: "categorie",
      type: "select",
      label: t("fields.categorie"),
      required: true,
      options: [
        { value: "Diplomatie", label: t("category.diplomatie") },
        { value: "Culture", label: t("category.culture") },
        { value: "Économie", label: t("category.economie") },
        { value: "Société", label: t("category.societe") },
        { value: "Éducation", label: t("category.education") }
      ]
    },
    {
      key: "description",
      type: "textarea",
      label: t("fields.description"),
      placeholder: "Décrivez l'actualité...",
      required: true,
      rows: 3
    },
    {
      key: "contenu",
      type: "textarea",
      label: t("fields.contenu"),
      placeholder: "Rédigez le contenu complet de l'actualité...",
      rows: 6
    },
    {
      key: "datePublication",
      type: "date",
      label: t("fields.datePublication"),
      required: true
    },
    {
      key: "image",
      type: "file",
      label: t("fields.image"),
      accept: "image/*",
      required: true
    },
    {
      key: "priorite",
      type: "select",
      label: t("fields.priorite"),
      options: [
        { value: "normale", label: t("priority.normale") },
        { value: "importante", label: t("priority.importante") },
        { value: "urgente", label: t("priority.urgente") }
      ]
    },
    {
      key: "langue",
      type: "select",
      label: t("fields.langue"),
      options: [
        { value: "fr", label: "Français" },
        { value: "en", label: "English" },
        { value: "ar", label: "العربية" }
      ]
    },
    {
      key: "metaTitre",
      type: "text",
      label: t("fields.metaTitre"),
      placeholder: "Titre SEO pour les moteurs de recherche..."
    },
    {
      key: "metaDescription",
      type: "textarea",
      label: t("fields.metaDescription"),
      placeholder: "Description SEO pour les moteurs de recherche...",
      rows: 2
    },
    {
      key: "tags",
      type: "text",
      label: t("fields.tags"),
      placeholder: "Séparez les mots-clés par des virgules..."
    }
  ];

  // Handlers pour les actions CRUD
  const handleCreate = () => {
    setCurrentActualite(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (actualite: IActualite) => {
    setCurrentActualite(actualite);
    setIsEditModalOpen(true);
  };

  const handleView = (actualite: IActualite) => {
    setCurrentActualite(actualite);
    setIsViewModalOpen(true);
  };

  const handleDelete = (actualite: IActualite) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      setData(prev => prev.filter(item => item.id !== actualite.id));
      toast.success("Article supprimé avec succès");
    }
  };

  const handleSubmitCreate = async (formData: any) => {
    setIsLoading(true);
    try {
      // Simulation d'une création
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newActualite: IActualite = {
        id: Date.now(),
        ...formData,
        date: formData.datePublication,
        user: "Utilisateur actuel",
        vues: 0,
        tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
        auteur: {
          id: "current-user",
          nom: "Utilisateur actuel",
          email: "user@ambassade-tchad.fr"
        }
      };
      
      setData(prev => [newActualite, ...prev]);
      setIsCreateModalOpen(false);
      toast.success("Article créé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEdit = async (formData: any) => {
    if (!currentActualite) return;
    
    setIsLoading(true);
    try {
      // Simulation d'une modification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedActualite: IActualite = {
        ...currentActualite,
        ...formData,
        dateModification: new Date().toISOString().split('T')[0]
      };
      
      setData(prev => prev.map(item => 
        item.id === currentActualite.id ? updatedActualite : item
      ));
      setIsEditModalOpen(false);
      setCurrentActualite(null);
      toast.success("Article modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification");
    } finally {
      setIsLoading(false);
    }
  };

  // Préparer les données pour l'édition
  const getEditData = (actualite: IActualite) => {
    return {
      ...actualite
    };
  };

  return (
    <div>
      <ActualiteCards
        data={data}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
      />

      {/* Modal de création */}
      <ContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitCreate}
        title={t("create_article")}
        description="Créez un nouvel article d'actualité pour informer vos lecteurs"
        fields={formFields}
        isLoading={isLoading}
        translationNamespace="contenu.gestionActualite"
      />

      {/* Modal d'édition */}
      <ContentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentActualite(null);
        }}
        onSubmit={handleSubmitEdit}
        title={t("edit_article")}
        description="Modifiez les informations de cet article"
        fields={formFields}
        initialData={currentActualite ? getEditData(currentActualite) : {}}
        isEditing={true}
        isLoading={isLoading}
        translationNamespace="contenu.gestionActualite"
      />

      {/* Modal de visualisation */}
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setCurrentActualite(null);
        }}
        title="Détails de l'article"
        data={currentActualite}
        type="actualite"
        translationNamespace="contenu.gestionActualite"
      />
    </div>
  );
};

export default ActualiteCardsContainer;