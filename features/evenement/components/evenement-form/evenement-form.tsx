"use client";

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Calendar as CalendarIcon} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Switch} from "@/components/ui/switch";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {EvenementDTO, evenementSchema} from "../../schemas/evenement.schema";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {useEvenementCreateMutation, useEvenementUpdateMutation} from "@/features/evenement/queries/evenement.mutation";
import {
  ExistingImageFile,
  MixedImageFile,
  NewImageFile
} from "@/features/actualites/components/actualite-form/actualite-add-update-form";
import {ImageDragDrop} from "@/components/blocks/image-drap-drop";
import {useEvenementDetailQuery} from "@/features/evenement/queries/evenement-details.query";
import {getFullUrlFile} from "@/utils/getFullUrlFile";

interface EvenementFormProps {
  id?: string;
}

export const EvenementForm: React.FC<EvenementFormProps> = ({ id }) => {
  const { data: evenement } = useEvenementDetailQuery(id!);

  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<MixedImageFile[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    evenement?.eventDate instanceof Date
      ? evenement.eventDate
      : evenement?.eventDate
      ? new Date(evenement.eventDate)
      : undefined
  );

  // Hook de mutations
  const {
    mutateAsync: evenementCreateMutation,
    isPending: evenementCreatePending,
  } = useEvenementCreateMutation()

  const {
    mutateAsync: evenementUpdateMutation,
    isPending: evenementUpdatePending,
  } = useEvenementUpdateMutation();

  const isLoading = evenementCreatePending || evenementUpdatePending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EvenementDTO>({
    resolver: zodResolver(evenementSchema),
    values: {
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

  useEffect(() => {
    if (evenement) {
      setValue("title", evenement.title);
      setValue("description", evenement.description);
      setValue("published", evenement.published);

      // Mapper les images existantes
      const existingImages: ExistingImageFile[] =
          evenement?.imageUrl?.map((imageUrl, index) => ({
            id: `existing-${index}`,
            url: getFullUrlFile(imageUrl),
            preview: getFullUrlFile(imageUrl),
            name: imageUrl.split("/").pop() || `Image ${index + 1}`,
            isExisting: true,
          })) || [];

      setImageFiles(existingImages);
    }
  }, [evenement, setValue]);

  const handleCancel = () => {
    router.push("/contenu/evenement");
  };

  const watchedPublished = watch("published");

  const onSubmitForm = async (data: EvenementDTO) => {
    try {
      const newImages: File[] = imageFiles
          .filter((imageFile): imageFile is NewImageFile => !imageFile.isExisting)
          .map((newImage) => newImage.file);

      const submitData = {
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        location: data.location,
        published: data.published,
        images: newImages.length > 0 ? newImages : undefined,

      };

      if (evenement) {
        await evenementUpdateMutation({ id: evenement.id, data: submitData });
      } else {
        await evenementCreateMutation(submitData);
      }

      router.push("/contenu/actualite");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

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
          <ImageDragDrop
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              isUpdateMode={!!evenement}
          />

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
