"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { getFullUrlFile } from "@/utils/getFullUrlFile";
import { Button } from "@/components/ui/button";
import { usePhotoDetailQuery } from "../../queries/photo-details.query";
import { PhotoDTO, photoSchema } from "../../schemas/photo.schema";
import {
  usePhotoCreateMutation,
  usePhotoUpdateMutation,
} from "../../queries/photo.mutation";
import FileUploadView from "@/components/blocks/file-upload-view";
import { createFileFromUrl } from "@/utils/createFileMetadataFromUrl";
import { useFileUpload } from "@/hooks/use-file-upload";

interface PhotoFormProps {
  id?: string;
}

export const PhotoForm: React.FC<PhotoFormProps> = ({ id }) => {
  // Récupération de la photo si id est fourni
  const { data: photo, isLoading: isLoadingPhoto } = usePhotoDetailQuery(id!);

  const router = useRouter();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PhotoDTO>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: photo?.title || "",
      description: photo?.description || "",
    },
  });

  const handleCancel = () => {
    router.push("/contenu/galerie-photo");
  };

  // Hook de mutations
  const { mutateAsync: photoCreateMutation, isPending: photoCreatePending } =
    usePhotoCreateMutation();

  const { mutateAsync: photoUpdateMutation, isPending: photoUpdatePending } =
    usePhotoUpdateMutation();

  const isLoading = photoCreatePending || photoUpdatePending || isLoadingPhoto;

  useEffect(() => {
    async function loadPhoto() {
      if (photo) {
        setValue("title", photo.title);
        setValue("description", photo.description);
        if (photo?.imageUrl && photo.imageUrl.length > 0 && !isLoading) {
          // Mapper les images existantes
          const existingImages = await Promise.all(
            photo?.imageUrl?.map(
              async (imageUrl) =>
                await createFileFromUrl(getFullUrlFile(imageUrl))
            ) || []
          );

          setImageFiles(existingImages);
        }
      }
    }
    loadPhoto();
  }, [photo, setValue, isLoading]);

  const onSubmitForm = async (data: PhotoDTO) => {
    try {
      const newImages: File[] = files.map((newImage) => newImage.file as File);

      const submitData = {
        title: data.title,
        description: data.description,
        images: newImages.length > 0 ? newImages : undefined,
      };

      if (photo) {
        await photoUpdateMutation({ id: photo.id, data: submitData });
      } else {
        await photoCreateMutation(submitData);
      }

      router.push("/contenu/galerie-photo");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {photo ? "Modifier la photo" : "Créer une nouvelle photo"}
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
              placeholder="Entrez le titre de la photo..."
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Rédigez le contenu de la photo..."
              rows={6}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
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

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : photo ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
