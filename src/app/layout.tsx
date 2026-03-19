import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { I18nProvider } from "@/shared/lib/i18n/provider";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@/styles/globalStyles.css";
import "normalize.css/normalize.css";
import AppProviders from "./providers";

export const metadata: Metadata = {
  title: "Telegram Mini App Starter",
  description: "Production-ready starter for Telegram Mini Apps on Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <I18nProvider>
          <AppProviders>{children}</AppProviders>
        </I18nProvider>
      </body>
    </html>
  );
}
