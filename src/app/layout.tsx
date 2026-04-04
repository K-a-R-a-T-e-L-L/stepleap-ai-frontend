import type { ReactNode } from "react";
import type { Metadata } from "next";
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

  return (
    <html lang={'ru'} {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
          <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
