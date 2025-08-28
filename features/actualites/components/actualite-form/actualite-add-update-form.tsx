"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ActualiteCreateDTO,
  actualiteCreateSchema,
} from "../../schemas/actualites.schema";
import { useRouter } from "next/navigation";
import {
  useActualiteCreateMutation,
  useActualiteUpdateMutation,
} from "../../queries/actualite.mutation";
import { useActualiteDetailQuery } from "../../queries/actualite-details.query";
import { getFullUrlFile } from "@/utils/getFullUrlFile";
import { Button } from "@/components/ui/button";
import FileUploadView from "@/components/blocks/file-upload-view";
import { createFileFromUrl } from "@/utils/createFileMetadataFromUrl";
import { useFileUpload } from "@/hooks/use-file-upload";

interface ActualiteFormProps {
  id?: string;
}

export const ActualiteAddUpdateForm: React.FC<ActualiteFormProps> = ({
  id,
}) => {
  // Récupération de l'actualite si id est fourni
  const { data: actualite, isLoading: isLoadingActualite } =
    useActualiteDetailQuery(id!);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ActualiteCreateDTO>({
    resolver: zodResolver(actualiteCreateSchema),
    defaultValues: {
      title: actualite?.title || "",
      content: actualite?.content || "",
      published: actualite?.published || false,
    },
  });

  const handleCancel = () => {
    router.push("/contenu/actualite");
  };

  const watchedPublished = watch("published");

  // Upload images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const maxFiles = 10;
  const maxSizeMB = 20;
  const [
    { files, isDragging, errors: fileErrors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
    initialFiles: imageFiles,
  });

  // Hook de mutations
  const {
    mutateAsync: actualiteCreateMutation,
    isPending: actualiteCreatePending,
  } = useActualiteCreateMutation();

  const {
    mutateAsync: actualiteUpdateMutation,
    isPending: actualiteUpdatePending,
  } = useActualiteUpdateMutation();

  const isLoading =
    actualiteCreatePending || actualiteUpdatePending || isLoadingActualite;

  useEffect(() => {
    async function loadActualite() {
      if (actualite) {
        setValue("title", actualite.title);
        setValue("content", actualite.content);
        setValue("published", actualite.published);
        if (
          actualite?.imageUrls &&
          actualite.imageUrls.length > 0 &&
          !isLoading
        ) {
          // Mapper les images existantes
          const existingImages = await Promise.all(
            actualite?.imageUrls?.map(
              async (imageUrl) =>
                await createFileFromUrl(getFullUrlFile(imageUrl))
            ) || []
          );

          setImageFiles(existingImages);
        }
      }
    }
    loadActualite();
  }, [actualite, setValue, isLoading]);

  const onSubmitForm = async (data: ActualiteCreateDTO) => {
    try {
      const newImages: File[] = files.map((newImage) => newImage.file as File);

      const submitData = {
        title: data.title,
        content: data.content,
        published: data.published,
        images: newImages.length > 0 ? newImages : undefined,
      };

      if (actualite) {
        await actualiteUpdateMutation({ id: actualite.id, data: submitData });
      } else {
        await actualiteCreateMutation(submitData);
      }

      router.push("/contenu/actualite");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {actualite ? "Modifier l'actualité" : "Créer une nouvelle actualité"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Entrez le titre de l'actualité..."
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Rédigez le contenu de l'actualité..."
              rows={6}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>
          {/* Images */}
          <FileUploadView
            maxFiles={maxFiles}
            maxSizeMB={maxSizeMB}
            openFileDialog={openFileDialog}
            handleDragEnter={handleDragEnter}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            files={files}
            isDragging={isDragging}
            errors={fileErrors}
            removeFile={removeFile}
            clearFiles={clearFiles}
            getInputProps={getInputProps}
          />

          {/* Statut de publication */}
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={watchedPublished}
              onCheckedChange={(checked) => setValue("published", checked)}
            />
            <Label htmlFor="published">Publier l&apos;actualité</Label>
            <Badge color={watchedPublished ? "default" : "secondary"}>
              {watchedPublished ? "Publié" : "Brouillon"}
            </Badge>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Enregistrement..."
                : actualite
                ? "Modifier"
                : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
