"use client";

import React, {useState} from "react";
import {Calendar, Eye, SquarePen, Trash2,} from "lucide-react";
import {Card, CardContent, CardFooter,} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";
import {IVideo} from "../../types/video.type";
import {extractYoutubeId} from "@/utils/youtube";
import {VideoDeleteModal} from "../video-modal/video-delete-modal";

interface VideoListCardProps {
    video: IVideo;
    onView: (video: IVideo) => void;
    onDelete: (video: IVideo) => void;
}

export const VideoListCard: React.FC<VideoListCardProps> = ({
                                                                video,
                                                                onView,
                                                                onDelete,
                                                            }) => {
    const router = useRouter();

    const handleDeleteClick = () => {
        onDelete(video);
    };

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    return (
        <>
            <Card
                className="group relative overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white dark:bg-gray-900"
                onClick={() => onView(video)}
            >
                {/* Image avec overlay titre & actions */}
                <div className="relative h-[40vh]">
                    {/* Video Youtube */}
                    {video.youtubeUrl && <YoutubePreview
                        url={video.youtubeUrl}
                    />}

                    {/* Overlay gradient */}
                    {/*<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />*/}
                </div>

                {/* Contenu principal */}
                <CardContent
                    className="p-5 space-y-5 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                    <h3 className="font-semibold text-md truncate">
                        {video.title}
                    </h3>
                    {/* Contenu principal */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed tracking-wide">
                        {video.description}
                    </p>

                    {/* Infos clés avec style pro */}
                    <div
                        className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-900/30 shadow-sm">
                        <div
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-800">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300"/>
                        </div>
                        <div className="flex-1">
              <span className="text-xs uppercase tracking-wide text-blue-500 dark:text-blue-300 font-medium">
                Créé le
              </span>
                            <div className="text-sm font-semibold text-blue-800 dark:text-blue-100">
                                {video.createdAt
                                    ? new Date(video.createdAt).toLocaleDateString("fr-FR")
                                    : "Date inconnue"}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="py-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1 justify-end w-full">
                        <Link
                            href={`/contenu/galerie-video/view/${video.id}`}
                            className="bg-white/80 hover:bg-white shadow-sm cursor-pointer rounded-md"
                        >
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/contenu/galerie-video/view/${video.id}`);
                                }}
                                title="Modifier"
                                className="bg-white/80 shadow-sm text-yellow-500 hover:bg-orange-300 hover:text-orange-100 transition duration-300"
                            >
                                <Eye className="!w-6 !h-6"/>
                            </Button>
                        </Link>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteAlert(true);
                                router.push(`/contenu/galerie-video/edit/${video.id}`);
                            }}
                            title="Modifier"
                            className="bg-white/80 shadow-sm text-green-500 hover:bg-green-400 hover:text-green-100 transition duration-300"
                        >
                            <SquarePen className="!w-6 !h-6"/>
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteAlert(true);
                            }}
                            title="Supprimer"
                            className="bg-white/80 text-red-500 hover:bg-red-400 hover:text-red-100 shadow-sm transition duration-300"
                        >
                            <Trash2 className="!w-6 !h-6"/>
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <VideoDeleteModal video={video} isOpen={showDeleteAlert} setIsOpen={setShowDeleteAlert}/>
        </>
    );
};

export function YoutubePreview({url}: { url: string }) {
    const youtubeId = extractYoutubeId(url)
    return (
        <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-none"
            loading="lazy"
        />
    )
}

