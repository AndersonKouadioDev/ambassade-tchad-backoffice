"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useVideoDetailQuery } from "@/features/galeries/videos/queries/video-details.query";
import {
  VideoDTO,
  videoSchema,
} from "@/features/galeries/videos/schemas/video.schema";
import {
  useVideoCreateMutation,
  useVideoUpdateMutation,
} from "@/features/galeries/videos/queries/video.mutation";

interface VideoFormProps {
  id?: string;
}

export const VideoForm: React.FC<VideoFormProps> = ({ id }) => {
  // Récupération de la video si id est fourni
  const { data: video } = useVideoDetailQuery(id!);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoDTO>({
    resolver: zodResolver(videoSchema),
    values: {
      title: video?.title || "",
      description: video?.description || "",
      youtubeUrl: video?.youtubeUrl || "",
    },
  });

  const handleCancel = () => {
    router.push("/contenu/galerie-video");
  };

  // Hook de mutations
  const { mutateAsync: videoCreateMutation, isPending: videoCreatePending } =
    useVideoCreateMutation();

  const { mutateAsync: videoUpdateMutation, isPending: videoUpdatePending } =
    useVideoUpdateMutation();

  const isLoading = videoCreatePending || videoUpdatePending;

  const onSubmitForm = async (data: VideoDTO) => {
    try {
      const submitData = {
        title: data.title,
        description: data.description,
        youtubeUrl: data.youtubeUrl,
      };

      if (video) {
        await videoUpdateMutation({ id: video.id, data: submitData });
      } else {
        await videoCreateMutation(submitData);
      }

      router.push("/contenu/galerie-video");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {video ? "Modifier la video" : "Créer une nouvelle video"}
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
              placeholder="Entrez le titre de la video..."
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
              placeholder="Rédigez le contenu de la video..."
              rows={6}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* URL YouTube */}
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">Lien de la vidéo Youtube *</Label>
            <Input
              id="youtubeUrl"
              {...register("youtubeUrl")}
              placeholder="Entrez l'url de la video youtube..."
              className={errors.youtubeUrl ? "border-red-500" : ""}
            />
            {errors.youtubeUrl && (
              <p className="text-sm text-red-500">
                {errors.youtubeUrl.message}
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : video ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
