import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme.css";
import { ThemeProvider } from "@/providers/theme-provider";
import MountedProvider from "@/providers/mounted.provider";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

// language
import { getLangDir } from "rtl-detect";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import DirectionProvider from "@/providers/direction-provider";
import AuthProvider from "@/providers/auth.provider";
import QueryProvider from "@/providers/query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: "created by codeshaper",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const messages = await getMessages();
  const direction = getLangDir(locale);
  const queryClient = getQueryClient();

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={`${inter.className} starter-next`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <QueryProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <NuqsAdapter>
                <AuthProvider>
                  <ThemeProvider attribute="class" defaultTheme="light">
                    <MountedProvider>
                      <DirectionProvider direction={direction}>
                        {children}
                      </DirectionProvider>
                    </MountedProvider>
                    <Toaster />
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
