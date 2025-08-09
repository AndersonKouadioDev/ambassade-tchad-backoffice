"use client";

import React, { useState, useRef, useTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IEvenement } from "../../types/evenement.type";
import { EvenementDTO, evenementSchema } from "../../schemas/evenement.schema";
import {
  createEvenement,
  updateEvenement,
} from "../../actions/evenement.action";
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
import { useInvalidateEvenementQuery } from "../../queries/index.query";
import { cn } from "@/lib/utils";

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

export const EvenementForm: React.FC<EvenementFormProps> = ({ evenement }) => {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    evenement?.eventDate instanceof Date
      ? evenement.eventDate
      : evenement?.eventDate
      ? new Date(evenement.eventDate)
      : undefined
  );

  const invalideEvenement = useInvalidateEvenementQuery();

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
        ? evenement.eventDate instanceof Date
          ? evenement.eventDate.toISOString()
          : evenement.eventDate
        : "",
      published: evenement?.published ?? false,
      images: [],
    },
  });

  const handleCancel = () => {
    router.push("/contenu/evenement");
  };

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
        ...data,
        eventDate: new Date(data.eventDate),
        images,
      };

      let res: { success: boolean; message: string };

      const formData = createFormData(submitData);

      if (evenement) {
        res = await updateEvenement(evenement.id, formData);
      } else {
        res = await createEvenement(formData);
      }

      if (res.success) {
        await invalideEvenement();
        toast.success(res.message);
        router.push("/contenu/evenement");
      } else {
        toast.error(res.message);
      }
    });
  };

  const createFormData = useCallback((data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item instanceof File) {
            formData.append(`${key}`, item);
          } else {
            formData.append(`${key}`, String(item));
          }
        });
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    return formData;
  }, []);

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">
          {evenement ? "Modifier l'événement" : "Créer un événement"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l&apos;événement *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Ex: Conférence annuelle..."
                className={cn(errors.title && "border-red-500")}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Lieu */}
            <div className="space-y-2">
              <Label htmlFor="location">Lieu *</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Ex: Paris, Salle 3"
                className={cn(errors.location && "border-red-500")}
              />
              {errors.location && (
                <p className="text-xs text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={5}
              placeholder="Détaillez ici l'événement..."
              className={cn(errors.description && "border-red-500")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="eventDate">Date de l&apos;évènement *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full text-left justify-start",
                    !selectedDate && "text-muted-foreground",
                    errors.eventDate && "border-red-500"
                  )}
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
                      setValue("eventDate", date.toISOString(), {
                        shouldValidate: true,
                      });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <input type="hidden" {...register("eventDate")} />
            {errors.eventDate && (
              <p className="text-xs text-red-500">{errors.eventDate.message}</p>
            )}
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Images</Label>
            <div
              className="border-2 border-dashed p-6 rounded-lg text-center hover:border-gray-400 cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="mx-auto text-gray-400 w-10 h-10" />
              <p className="mt-2 text-sm text-gray-500">
                Glissez-déposez ou cliquez pour ajouter des images
              </p>
            </div>

            {imageFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">
                    Images sélectionnées ({imageFiles.length})
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => setImageFiles([])}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Tout supprimer
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageFiles.map((img) => (
                    <div key={img.id} className="relative group">
                      <div className="aspect-square border rounded overflow-hidden bg-gray-100">
                        <Image
                          src={img.preview}
                          alt={img.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2 transition">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => window.open(img.preview, "_blank")}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleImageRemove(img.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs truncate text-center mt-1">
                        {img.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Switch publié */}
          <div className="flex items-center gap-3">
            <Switch
              id="published"
              checked={watchedPublished}
              onCheckedChange={(checked) => {
                setValue("published", checked, { shouldValidate: true });
              }}
            />
            <Label htmlFor="published">Publier l’événement</Label>
            <Badge variant={watchedPublished ? "default" : "secondary"}>
              {watchedPublished ? "Publié" : "Brouillon"}
            </Badge>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Enregistrement en cours..."
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
