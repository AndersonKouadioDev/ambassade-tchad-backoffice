"use client";

import React, { useState, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Image as ImageIcon, Plus, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ActualiteDTO, actualiteSchema } from "../../schemas/actualites.schema";
import { IActualite } from "../../types/actualites.type";
import {
  createActualite,
  updateActualite,
} from "@/features/actualites/actions/actualites.action";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { invalidateActualitesList } from "../../queries/actualite-list.query";
import { Button } from "@heroui/react";

//

interface ActualiteFormProps {
  actualite?: IActualite;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

// TODO: Ajouter les images dans le formulaire

export const ActualiteForm: React.FC<ActualiteFormProps> = ({ actualite }) => {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ActualiteDTO>({
    resolver: zodResolver(actualiteSchema),
    defaultValues: {
      title: actualite?.title || "",
      content: actualite?.content || "",
      published: actualite?.published || false,
    },
  });

  const handleCancel = () => {
    router.push("/contenu/actualite");
  };

  // TODO: Ajouter les images dans le formulaire
  const watchedPublished = watch("published");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImageFiles: ImageFile[] = Array.from(files).map(
        (file, index) => ({
          id: `file-${Date.now()}-${index}`,
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        })
      );

      setImageFiles((prev) => [...prev, ...newImageFiles]);
    }
  };

  const handleImageRemove = (id: string) => {
    setImageFiles((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImageFiles: ImageFile[] = imageFiles.map((file, index) => ({
      id: `drop-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setImageFiles((prev) => [...prev, ...newImageFiles]);
  };

  const onSubmitForm = async (data: ActualiteDTO) => {
    startTransition(async () => {
      const images: File[] = imageFiles.map((file) => file.file);
      const submitData = {
        title: data.title,
        content: data.content,
        published: data.published,
        images,
      };

      let res: { success: boolean; message: string };

      const result = processAndValidateFormData(actualiteSchema, submitData, {
        outputFormat: "formData",
      });

      if (!result.success) {
        toast.error(
          result.errorsInString || "Des erreurs de validation sont survenues."
        );
      }
      const cretedFormData = createFormData(submitData);
      if (actualite) {
        res = await updateActualite(actualite.id, cretedFormData as FormData);
      } else {
        res = await createActualite(result.data as FormData);
      }

      if (res.success) {
        toast.success(res.message);
        router.push("/contenu/actualite");
        await invalidateActualitesList();
      } else {
        toast.error(res.message);
      }
    });
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
          <div className="space-y-4">
            <Label>Images</Label>

            {/* Zone d'upload */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                name="images"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Glissez-déposez vos images ici
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ou cliquez pour sélectionner des fichiers image
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Seuls les fichiers image sont acceptés
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>Formats supportés :</span>
                  <Badge className="text-xs">JPG</Badge>
                  <Badge className="text-xs">PNG</Badge>
                </div>
              </div>
            </div>

            {/* Images affichées */}
            {imageFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    Images sélectionnées ({imageFiles.length})
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImageFiles([])}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Tout supprimer
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {imageFiles.map((imageFile) => (
                    <div key={imageFile.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <Image
                          src={imageFile.preview}
                          alt={imageFile.name}
                          fill
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay avec actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              color="secondary"
                              size="sm"
                              className="w-8 h-8 p-0 "
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(imageFile.preview, "_blank");
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              color="danger"
                              size="sm"
                              className="w-4 h-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageRemove(imageFile.id);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Nom du fichier */}
                      <p className="text-xs text-gray-600 mt-1 truncate text-center">
                        {imageFile.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
            <Button type="button" variant="ghost" onClick={handleCancel}>
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

export function createFormData(formData: Record<string, unknown>): FormData {
  const sendFormData = new FormData();

  function appendFormData(key: string, value: unknown) {
    // Cas null ou undefined
    if (value === null || value === undefined) {
      sendFormData.append(key, "");
      return;
    }

    // Cas File
    if (value instanceof File) {
      sendFormData.append(key, value, value.name);
      return;
    }

    // Cas Blob
    if (value instanceof Blob) {
      sendFormData.append(key, value);
      return;
    }

    // Cas Date
    if (value instanceof Date) {
      sendFormData.append(key, value.toISOString());
      return;
    }

    // Cas tableau
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        // Pour les tableaux imbriqués ou objets dans les tableaux
        if (Array.isArray(item) || isObject(item)) {
          appendFormData(`${key}[${index}]`, item);
        } else {
          appendFormData(`${key}`, item);
        }
      });
      return;
    }

    // Cas objet (excluant les types spéciaux déjà traités)
    if (isObject(value)) {
      Object.entries(value).forEach(([propertyKey, propertyValue]) => {
        appendFormData(`${key}[${propertyKey}]`, propertyValue);
      });
      return;
    }

    // Cas des types primitifs (string, number, boolean)
    sendFormData.append(key, String(value));
  }

  // Fonction utilitaire pour vérifier si une valeur est un objet
  function isObject(value: unknown): value is Record<string, unknown> {
    return (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof File) &&
      !(value instanceof Blob) &&
      !(value instanceof Date) &&
      !Array.isArray(value)
    );
  }

  // Traitement de chaque entrée du formData initial
  Object.entries(formData).forEach(([key, value]) => {
    appendFormData(key, value);
  });

  return sendFormData;
}
