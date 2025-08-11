"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ImageDragDrop, ImageFile } from "@/components/blocks/image-drap-drop";
import { getFullUrlFile } from "@/utils/getFullUrlFile";
import { Button } from "@/components/ui/button";
import { usePhotoDetailQuery } from "../../queries/photo-details.query";
import { PhotoDTO, photoSchema } from "../../schemas/photo.schema";
import { usePhotoCreateMutation, usePhotoUpdateMutation } from "../../queries/photo.mutation";

interface PhotoFormProps {
  id?: string;
}

// Interface pour différencier les images existantes des nouvelles
export interface ExistingImageFile extends Omit<ImageFile, "file"> {
  file?: File;
  url: string;
  isExisting: true;
}

export interface NewImageFile extends ImageFile {
  file: any;
  isExisting: false;
}

export type MixedImageFile = ExistingImageFile | NewImageFile;

export const PhotoForm: React.FC<PhotoFormProps> = ({
  id,
}) => {
  // Récupération de la photo si id est fourni
  const { data: photo } = usePhotoDetailQuery(id!);

  const router = useRouter();

  const [imageFiles, setImageFiles] = useState<MixedImageFile[]>([]);

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

  useEffect(() => {
    if (photo) {
      setValue("title", photo.title);
      setValue("description", photo.description);

      // Mapper les images existantes
      const existingImages: ExistingImageFile[] =
        photo?.imageUrl?.map((imageUrl, index) => ({
          id: `existing-${index}`,
          url: getFullUrlFile(imageUrl),
          preview: getFullUrlFile(imageUrl),
          name: imageUrl.split("/").pop() || `Image ${index + 1}`,
          isExisting: true,
        })) || [];

      setImageFiles(existingImages);
    }
  }, [photo, setValue]);

  const handleCancel = () => {
    router.push("/contenu/galerie-photo");
  };



  // Hook de mutations
  const {
    mutateAsync: photoCreateMutation,
    isPending: photoCreatePending,
  } = usePhotoCreateMutation();

  const {
    mutateAsync: photoUpdateMutation,
    isPending: photoUpdatePending,
  } = usePhotoUpdateMutation();

  const isLoading = photoCreatePending || photoUpdatePending;

  const onSubmitForm = async (data: PhotoDTO) => {
    try {
      const newImages: File[] = imageFiles
        .filter((imageFile): imageFile is NewImageFile => !imageFile.isExisting)
        .map((newImage) => newImage.file);

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
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Images */}
          <ImageDragDrop
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            isUpdateMode={!!photo}
          />

          

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit"  disabled={isLoading}>
              {isLoading
                ? "Enregistrement..."
                : photo
                ? "Modifier"
                : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
