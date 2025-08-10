// import GalerieVideoCardsContainer from "@/components/contenu/galerie-video-cards-container";
import { useTranslations } from "next-intl";

export default function VideoListPage() {
  const t = useTranslations("contenu.gestionGalerie.videos");
  
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
      
      {/* <GalerieVideoCardsContainer /> */}
    </div>
  );
}
