"use client";

import React, {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Eye,
    User,
    Edit,
    Trash2,
    Share2,
    BookOpen,
    ImageIcon, CalendarClock, MapPin,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import {cn} from "@/lib/utils";
import {Link} from "@/i18n/navigation";
import {EvenementDeleteModal} from "@/features/evenement/components/evenement-modal/evenement-delete-modal";
import {useEvenementDetailQuery} from "@/features/evenement/queries/evenement-details.query";
import {formatImageUrl} from "@/features/actualites/utils/image-utils";

function getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
}

export default function EvenementInfo() {
    const params = useParams();
    const router = useRouter();
    const evenementId = params?.id as string;

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageError, setImageError] = useState(false);

    const {data: evenement, isLoading, error} = useEvenementDetailQuery(evenementId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400">Chargement de l&#39;évènement</p>
                </div>
            </div>
        );
    }

    if (error || !evenement) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div
                        className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                        <Eye className="w-8 h-8 text-red-600 dark:text-red-400"/>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Evenement introuvable</h2>
                    <p className="text-gray-600 dark:text-gray-400">Cette évènement n&#39;existe pas ou a été
                        supprimée.</p>
                    <Button onClick={() => router.back()} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        Retour
                    </Button>
                </div>
            </div>
        );
    }

    const hasImages = evenement.imageUrl && evenement.imageUrl.length > 0;
    const selectedImage = hasImages ? evenement.imageUrl?.[selectedImageIndex] : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header avec navigation */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2"/>
                                Retour
                            </Button>
                            <Separator orientation="vertical" className="h-6"/>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary"/>
                                <span className="font-medium text-gray-900 dark:text-white">Evenement</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Share2 className="w-4 h-4 mr-2"/>
                                Partager
                            </Button>
                            <Link href={`/contenu/evenement/edit/${evenement.id}`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2"/>
                                    Modifier
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDeleteModal(true)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                            >
                                <Trash2 className="w-4 h-4 mr-2"/>
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Colonne principale - Images et contenu */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Images */}
                        {hasImages && !imageError ? (
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Image principale */}
                                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                                        <Image
                                            src={formatImageUrl(selectedImage!)}
                                            alt={evenement.title}
                                            fill
                                            className="object-cover aspect-square"
                                            onError={() => setImageError(true)}
                                            priority
                                        />

                                        {/* Indicateur d'image */}
                                        {(evenement.imageUrl?.length ?? 0) > 1 && (
                                            <div
                                                className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                                {selectedImageIndex + 1} / {evenement.imageUrl?.length ?? 0}
                                            </div>
                                        )}
                                    </div>

                                    {/* Miniatures */}
                                    {(evenement.imageUrl?.length ?? 0) > 1 && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800">
                                            <div className="flex gap-3 overflow-x-auto pb-2">
                                                {evenement.imageUrl?.map((imageUrl, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedImageIndex(index)}
                                                        className={cn(
                                                            "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                                            selectedImageIndex === index
                                                                ? "border-primary shadow-lg scale-105"
                                                                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                                                        )}
                                                    >
                                                        <Image
                                                            src={formatImageUrl(imageUrl)}
                                                            alt={`Image ${index + 1}`}
                                                            fill
                                                            className="object-cover aspect-square"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="p-8">
                                    <div
                                        className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4">
                                        <ImageIcon className="w-16 h-16"/>
                                        <p className="text-lg font-medium">Aucune image disponible</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Contenu de l'évènement */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                                            {evenement.title}
                                        </h1>
                                        <div className="flex items-center gap-3 mt-3">
                                            <Badge
                                                className={cn(
                                                    "text-sm font-medium",
                                                    evenement.published
                                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                                        : "bg-orange-500 text-white hover:bg-orange-600"
                                                )}
                                            >
                                                {evenement.published ? "Publié" : "Brouillon"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-gray dark:prose-invert max-w-none">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {evenement.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Informations */}
                    <div className="space-y-6">
                        {/* Informations de publication */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informations</h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Date de création */}
                                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div
                                        className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-300"/>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300 font-medium">
                                            Date de création
                                        </p>
                                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-100">
                                            {evenement.createdAt
                                                ? new Date(evenement.createdAt).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })
                                                : "Date inconnue"}
                                        </p>
                                    </div>
                                </div>

                                {/* Heure de création */}
                                <div
                                    className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <div
                                        className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full">
                                        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-300"/>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-300 font-medium">
                                            Heure de publication
                                        </p>
                                        <p className="text-sm font-semibold text-purple-800 dark:text-purple-100">
                                            {evenement.createdAt
                                                ? new Date(evenement.createdAt).toLocaleTimeString("fr-FR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "Heure inconnue"}
                                        </p>
                                    </div>
                                </div>

                                {/* Date de l event*/}
                                <div
                                    className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                                >
                                    <div
                                        className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full">
                                        <CalendarClock className="w-5 h-5 text-orange-600 dark:text-orange-300"/>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-orange-600 dark:text-orange-300 font-medium">
                                            Date de l&#39;évènement
                                        </p>
                                        <p className="text-sm font-semibold text-orange-800 dark:text-orange-100">
                                            {evenement.eventDate
                                                ? new Date(evenement.eventDate).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })
                                                : "date inconnue"}
                                        </p>
                                    </div>
                                </div>

                                {/* Lieu de l event*/}
                                <div
                                    className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                                >
                                    <div
                                        className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full">
                                        <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-300"/>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-orange-600 dark:text-orange-300 font-medium">
                                            Lieu de l&#39;évènement
                                        </p>
                                        <p className="text-sm font-semibold text-orange-800 dark:text-orange-100">
                                            {evenement.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Dernière modification */}
                                {evenement.updatedAt && evenement.updatedAt !== evenement.createdAt && (
                                    <div
                                        className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg"
                                    >
                                        <div
                                            className="flex items-center justify-center w-10 h-10 bg-amber-100 dark:bg-amber-800 rounded-full">
                                            <Edit className="w-5 h-5 text-amber-600 dark:text-amber-300"/>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-300 font-medium">
                                                Dernière modification
                                            </p>
                                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-100">
                                                {new Date(evenement.updatedAt).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Informations sur l'auteur */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Auteur</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12 ring-2 ring-gray-200 dark:ring-gray-700">
                                        <AvatarImage
                                            src={undefined}
                                            alt={evenement.author?.firstName || evenement.authorId}
                                        />
                                        <AvatarFallback
                                            className="text-lg bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 font-semibold">
                                            {getInitials(
                                                evenement.author?.firstName,
                                                evenement.author?.lastName
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div
                                            className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                                            {evenement.author?.firstName && evenement.author?.lastName
                                                ? `${evenement.author.firstName} ${evenement.author.lastName}`
                                                : evenement.author?.firstName
                                                    ? evenement.author.firstName
                                                    : evenement.author?.lastName
                                                        ? evenement.author.lastName
                                                        : evenement.author?.email
                                                            ? evenement.author.email
                                                            : `Auteur (${evenement.authorId.slice(0, 8)}...)`}
                                        </div>
                                        {evenement.author?.email && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {evenement.author.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistiques */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistiques</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div
                                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Images</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {evenement.imageUrl?.length || 0}
                  </span>
                                </div>
                                <div
                                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Caractères</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {evenement.description?.length || 0}
                  </span>
                                </div>
                                <div
                                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Statut</span>
                                    <Badge
                                        className={cn(
                                            "text-xs",
                                            evenement.published
                                                ? "bg-emerald-500 text-white"
                                                : "bg-orange-500 text-white"
                                        )}
                                    >
                                        {evenement.published ? "Publié" : "Brouillon"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal de suppression */}
            <EvenementDeleteModal
                evenement={evenement}
                isOpen={showDeleteModal}
                setIsOpen={setShowDeleteModal}
            />
        </div>
    );
}

function InfoCard({}){

}