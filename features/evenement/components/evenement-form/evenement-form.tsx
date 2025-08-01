"use client";

import React, { useState, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Image as ImageIcon, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { cn, DatePicker, Input, Textarea } from "@heroui/react";
import { IEvenement } from "../../types/evenement.type";
import { EvenementDTO, evenementSchema } from "../../schemas/evenement.schema";
import {
  createEvenement,
  updateEvenement,
} from "../../actions/evenement.action";
import { invalidateAllEvenements, invalidateEvenement } from "../../queries/evenement-list.query";
import getQueryClient from "@/lib/get-query-client";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

//

interface EvenementFormProps {
  evenement?: IEvenement;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

// TODO: Ajouter les images dans le formulaire

export const EvenementForm: React.FC<EvenementFormProps> = ({ evenement }) => {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = getQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    evenement?.eventDate instanceof Date 
      ? evenement.eventDate 
      : evenement?.eventDate 
        ? new Date(evenement.eventDate)
        : new Date()
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EvenementDTO>({
    resolver: zodResolver(evenementSchema),
    defaultValues: {
      title: evenement?.title || "",
      description: evenement?.description || "",
      location: evenement?.location || "",
      eventDate: evenement?.eventDate 
        ? (evenement.eventDate instanceof Date 
            ? evenement.eventDate.toISOString() 
            : evenement.eventDate)
        : "",
      published: evenement?.published || false,
    },
  });

  const handleCancel = () => {
    router.push("/contenu/evenement");
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

  const onSubmitForm = async (data: EvenementDTO) => {
    startTransition(async () => {
      const images: File[] = imageFiles.map((file) => file.file);
      const submitData = {
        title: data.title,
        description: data.description,
        eventDate: new Date(data.eventDate),
        location: data.location,
        published: data.published,
        images,
      };

      let res: { success: boolean; message: string };

      // Créer le FormData directement
      const formData = createFormData(submitData);
      
      if (evenement) {
        res = await updateEvenement(evenement.id, formData);
      } else {
        res = await createEvenement(formData);
      }

      if (res.success) {
        toast.success(res.message);
        
        // Mettre à jour le cache optimistiquement
        if (evenement) {
          queryClient.setQueryData(
            ['evenement', 'detail', evenement.id],
            {
              ...evenement,
              title: data.title,
              description: data.description,
              eventDate: new Date(data.eventDate),
              location: data.location,
              published: data.published,
            }
          );
        }
        
        router.push("/contenu/evenement");
        // Invalider tous les événements et l'événement spécifique
        await Promise.all([
          invalidateAllEvenements(),
          evenement ? invalidateEvenement(evenement.id) : Promise.resolve()
        ]);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {evenement ? "Modifier l'événement" : "Créer un nouvel événement"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Input
              id="title"
              {...register("title")}
              placeholder="Entrez le titre de l'actualité..."
              className={errors.title ? "border-red-500" : ""}
              label="Titre de l'actualité"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          {/* Contenu */}
          <div className="space-y-2">
            <Textarea
              id="content"
              {...register("description")}
              placeholder="Rédigez la description de l'évènement..."
              rows={6}
              className={errors.description ? "border-red-500" : ""}
              label="Description de l'évènement"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Date de l'événement */}

          <div className="space-y-2">
            <label htmlFor="eventDate" className="block text-sm font-medium">
              Date de l'évènement *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      setValue("eventDate", date.toISOString());
                    }
                  }}
                />
                <input type="hidden" {...register("eventDate")} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Lieu */}
          <div className="space-y-2 ">
            <Input
              id="location"
              {...register("location")}
              placeholder="Entrez le lieu de l'évènement..."
              className={errors.location ? "border-red-500" : ""}
              label="Lieu de l'évènement*"
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>
          {/* Images */}
          <div className="space-y-4">
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
                              variant="outline"
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
                : evenement
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
