// import ServiceCardsContainer from "@/components/contenu/service-cards-container";
import { useTranslations } from "next-intl";

export default function ServicePage() {
  const t = useTranslations("contenu.gestionService");
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-primary-100 mt-2">
            Gérez vos services consulaires facilement
          </p>
        </div>
      </div>
      
      {/* <ServiceCardsContainer /> */}
    </div>
  );
}
