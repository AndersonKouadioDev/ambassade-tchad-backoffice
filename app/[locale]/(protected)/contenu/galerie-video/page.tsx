// import GalerieVideoCardsContainer from "@/components/contenu/galerie-video-cards-container";
import {prefetchVideosList} from "@/features/galeries/videos/queries/video-list.query";
import {prefetchVideoStats} from "@/features/galeries/videos/queries/video-stats.query";
import {getTranslations} from "next-intl/server";
import {VideoStats} from "@/features/galeries/videos/components";
import {VideoListTable} from "@/features/galeries/videos/components/video-list";

export default async function VideoListPage() {
    const t = await getTranslations("contenu.gestionGalerie.videos");

    await Promise.all([
        prefetchVideosList({
            page: 1,
        }),
        prefetchVideoStats(),
    ]);

    return (
        <div className="   ">
            <div className="mb-8">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold">{t("title")}</h1>
                    <p className="text-blue-100 mt-2">
                        Gérez votre galerie vidéo facilement
                    </p>
                </div>
            </div>

            <VideoStats/>

            <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
                <VideoListTable/>
            </div>
        </div>
    );
}
