"use client";

import React, { useRef, useState } from "react";
import {
  SquarePen,
  Trash2,
  Calendar,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { Link } from "@/i18n/navigation";
import { IPhoto } from "../../types/photo.type";
import { formatImageUrl } from "@/features/actualites/utils/image-utils";
import { PhotoDeleteModal } from "../photo-modal/photo-delete-modal";

interface PhotoListCardProps {
  photo: IPhoto;
  onView: (photo: IPhoto) => void;
  onDelete: (photo: IPhoto) => void;
}

export const PhotoListCard: React.FC<PhotoListCardProps> = ({
  photo,
  onView,
  onDelete,
}) => {
  const router = useRouter();

  const handleDeleteClick = () => {
    onDelete(photo);
  };

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  return (
    <>
      <Card
        className="group relative overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white dark:bg-gray-900"
        onClick={() => onView(photo)}
      >
        {/* Image avec overlay titre & actions */}
        <div className="relative">
          <PhotoImageCarousel photo={photo} />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

          {/* Titre & statut */}
          <div className="absolute bottom-3 left-3 z-20">
            <h3 className="text-white font-semibold text-lg truncate drop-shadow">
              {photo.title}
            </h3>
          </div>

          {/* Actions flottantes */}
          <div className="absolute top-3 right-3 flex gap-1 z-20">
            <Link
              href={`/contenu/galerie-photo/view/${photo.id}`}
              className="bg-white/80 hover:bg-white shadow-sm cursor-pointer rounded-md"
            >
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/contenu/galerie-photo/view/${photo.id}`);
                }}
                title="Modifier"
                className="bg-white/80 hover:bg-white shadow-sm"
              >
                <Eye className="w-4 h-4 text-yellow-500" />
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteAlert(true);
                router.push(`/contenu/galerie-photo/edit/${photo.id}`);
              }}
              title="Modifier"
              className="bg-white/80 hover:bg-white shadow-sm"
            >
              <SquarePen className="w-4 h-4 text-green-500" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteAlert(true);
              }}
              title="Supprimer"
              className="bg-white/80 hover:bg-white shadow-sm"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <CardContent className="p-5 space-y-5 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          {/* Contenu principal */}
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed tracking-wide">
            {photo.description}
          </p>

          {/* Infos clés avec style pro */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-900/30 shadow-sm">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-800">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex-1">
              <span className="text-xs uppercase tracking-wide text-blue-500 dark:text-blue-300 font-medium">
                Créé le
              </span>
              <div className="text-sm font-semibold text-blue-800 dark:text-blue-100">
                {photo.createdAt
                  ? new Date(photo.createdAt).toLocaleDateString("fr-FR")
                  : "Date inconnue"}
              </div>
            </div>
          </div>
        </CardContent>

      </Card>


      <PhotoDeleteModal photo={photo} isOpen={showDeleteAlert} setIsOpen={setShowDeleteAlert} />
      
    </>
  );
};
const PhotoImageCarousel = ({ photo }: { photo: IPhoto }) => {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {photo.imageUrl?.map((imageUrl, index) => (
          <CarouselItem key={index} >
            <Image
              src={formatImageUrl(imageUrl)}
              alt={`Image ${index + 1}`}
              width={500}
              height={500}
              className="aspect-square object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
};

