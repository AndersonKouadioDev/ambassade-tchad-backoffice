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
import { ImageDragDrop, ImageFile } from "@/components/blocks/image-drap-drop";
import {
  useActualiteCreateMutation,
  useActualiteUpdateMutation,
} from "../../queries/actualite.mutation";
import { useActualiteDetailQuery } from "../../queries/actualite-details.query";
import { getFullUrlFile } from "@/utils/getFullUrlFile";
import { Button } from "@/components/ui/button";

interface ActualiteFormProps {
  id?: string;
}

// Interface pour différencier les images existantes des nouvelles
export interface ExistingImageFile extends Omit<ImageFile, "file"> {
  file?: File;
  url: string;
  isExisting: true;
}

export interface NewImageFile extends ImageFile {
  isExisting: false;
}

export type MixedImageFile = ExistingImageFile | NewImageFile;

export const ActualiteAddUpdateForm: React.FC<ActualiteFormProps> = ({
  id,
}) => {
  // Récupération de l'actualite si id est fourni
  const { data: actualite } = useActualiteDetailQuery(id!);

  const router = useRouter();

  const [imageFiles, setImageFiles] = useState<MixedImageFile[]>([]);

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

  useEffect(() => {
    if (actualite) {
      setValue("title", actualite.title);
      setValue("content", actualite.content);
      setValue("published", actualite.published);

      // Mapper les images existantes
      const existingImages: ExistingImageFile[] =
        actualite?.imageUrls?.map((imageUrl, index) => ({
          id: `existing-${index}`,
          url: getFullUrlFile(imageUrl),
          preview: getFullUrlFile(imageUrl),
          name: imageUrl.split("/").pop() || `Image ${index + 1}`,
          isExisting: true,
        })) || [];

      setImageFiles(existingImages);
    }
  }, [actualite, setValue]);

  const handleCancel = () => {
    router.push("/contenu/actualite");
  };

  const watchedPublished = watch("published");

  // Hook de mutations
  const {
    mutateAsync: actualiteCreateMutation,
    isPending: actualiteCreatePending,
  } = useActualiteCreateMutation();

  const {
    mutateAsync: actualiteUpdateMutation,
    isPending: actualiteUpdatePending,
  } = useActualiteUpdateMutation();

  const isLoading = actualiteCreatePending || actualiteUpdatePending;

  const onSubmitForm = async (data: ActualiteCreateDTO) => {
    try {
      const newImages: File[] = imageFiles
        .filter((imageFile): imageFile is NewImageFile => !imageFile.isExisting)
        .map((newImage) => newImage.file);

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
          <ImageDragDrop
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            isUpdateMode={!!actualite}
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
            <Button type="submit"  disabled={isLoading}>
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
