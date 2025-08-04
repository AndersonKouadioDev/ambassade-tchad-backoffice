"use client";
import { Link } from "@/i18n/routing";
import LoginForm from "@/features/auth/components/auth-form/login-form";
import Image from "next/image";
import { InfoIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { baseURL } from "@/config";

export default function HomePage() {
  const t = useTranslations("LoginPage");
  const session = useSession();
  console.log({ session });
  console.log({ baseURL });
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background pour la partie droite avec support dark mode */}
      <div
        className="absolute inset-0 lg:left-1/2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(0, 51, 153, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(250, 76, 49, 0.03) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23003399' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      />

      {/* Motifs décoratifs animés */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-embassy-yellow-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-embassy-red-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-embassy-blue-400/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Section gauche - Informations Ambassade */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-embassy-blue-900 via-embassy-blue-800 to-embassy-blue-700">
          <div className="flex flex-col justify-center items-center w-full p-12 text-white relative">
            {/* Logo et titre principal */}
            <div className="text-center space-y-8 max-w-md">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl"></div>
                <Link
                  href="/"
                  className="relative block group transition-transform duration-300 hover:scale-105"
                  aria-label="Retour à l'accueil"
                >
                  <Image
                    src="/images/logo/logo.png"
                    alt="Logo de l'Ambassade du Tchad"
                    width={140}
                    height={140}
                    className="rounded-full object-contain mx-auto shadow-2xl border-4 border-white/20 group-hover:border-embassy-yellow-400/50 transition-all duration-300"
                    priority
                  />
                </Link>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                  <span className="block text-white">Ambassade de la</span>
                  <span className="block bg-gradient-to-r from-embassy-yellow-300 to-embassy-yellow-500 bg-clip-text text-transparent">
                    République du Tchad
                  </span>
                </h1>

                <div className="h-1 w-24 bg-gradient-to-r from-embassy-yellow-400 to-embassy-red-400 mx-auto rounded-full"></div>

                <p className="text-lg text-white/80 leading-relaxed">
                  Ministère des Affaires Étrangères
                  <br />
                  et de la Coopération Internationale
                </p>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="absolute bottom-12 left-12 right-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-embassy-yellow-400 font-semibold text-sm">
                      CÔTE D&apos;IVOIRE
                    </div>
                    <div className="text-white/80 text-xs">
                      Représentation diplomatique
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-embassy-red-400 font-semibold text-sm">
                      SERVICES
                    </div>
                    <div className="text-white/80 text-xs">
                      Consulaires & Administratifs
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-embassy-blue-400 font-semibold text-sm">
                      COOPÉRATION
                    </div>
                    <div className="text-white/80 text-xs">
                      Bilatérale & Multilatérale
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire de connexion */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 lg:bg-none">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="flex justify-center mb-8 lg:hidden">
              <Link href="/" className="group">
                <div className="relative">
                  <div className="absolute inset-0 bg-embassy-blue-600/20 rounded-full blur-xl"></div>
                  <Image
                    src="/images/logo/logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="relative rounded-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            </div>

            {/* Carte de connexion */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 lg:p-10 relative overflow-hidden">
              {/* Effets décoratifs de la carte */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-embassy-yellow-400/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-embassy-red-400/10 to-transparent rounded-full blur-xl"></div>

              <div className="relative z-10">
                {/* En-tête */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-embassy-blue-800 dark:text-embassy-blue-400 mb-2">
                    {t("title")}
                  </h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-embassy-blue-600 to-embassy-yellow-500 mx-auto rounded-full mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("subtitle")}
                  </p>
                </div>

                {/* Formulaire */}
                <div className="space-y-6">
                  <LoginForm />
                </div>

                {/* Contact rapide */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <a
                      href="#"
                      className="flex items-center space-x-1 hover:text-embassy-blue-600 dark:hover:text-embassy-blue-400 transition-colors"
                    >
                      <MailIcon size={16} />
                      <span>{t("contact")}</span>
                    </a>
                    <Link
                      href="#"
                      className="flex items-center space-x-1 hover:text-embassy-blue-600 dark:hover:text-embassy-blue-400 transition-colors"
                    >
                      <InfoIcon size={16} />
                      <span>{t("help")}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
