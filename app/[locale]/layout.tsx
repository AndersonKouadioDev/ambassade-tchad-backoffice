import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import MountedProvider from "@/providers/mounted.provider";
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
const inter = Inter({ subsets: ["latin"] });
// language 
import { getLangDir } from 'rtl-detect';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import DirectionProvider from "@/providers/direction-provider";
import AuthProvider from "@/providers/auth.provider";
import QueryProvider from "@/providers/query-provider";
import { SessionManager } from "@/components/session-manager";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";

export const metadata: Metadata = {
  title: "Dashboard Ambassade de tchad",
  description: "Back-office de l'ambassade du tchad en côte d'ivoire",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

  const messages = await getMessages();
  const direction = getLangDir(locale);
  const queryClient = getQueryClient();

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${inter.className} starter-next`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <QueryProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <NuqsAdapter>
                <AuthProvider>
                  <ThemeProvider locale={locale} attribute="class"
                    defaultTheme="light">
                    <MountedProvider>

                      <DirectionProvider direction={direction}>
                        <SessionManager />
                        {children}
                      </DirectionProvider>

                    </MountedProvider>
                    <Toaster />
                    <SonnerToaster />
                  </ThemeProvider>
                </AuthProvider>
              </NuqsAdapter>
            </HydrationBoundary>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
