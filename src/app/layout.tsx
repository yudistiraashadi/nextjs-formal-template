import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";

import "devextreme/dist/css/dx.fluent.saas.light.css";

import {
  MantineProvider,
  ColorSchemeScript,
  Box,
  DEFAULT_THEME,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { SearchParamsNotification } from "@/components/notification";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Next.js Formal Template",
  description:
    "Next.js Template for formal web apps (companies, governments, etc.)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <ColorSchemeScript />
      </head>

      <body className={inter.className} suppressHydrationWarning>
        <MantineProvider
          theme={{
            fontFamily: `${inter.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
            headings: {
              fontFamily: `${inter.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
            },
          }}
        >
          <ModalsProvider>
            <Notifications
              position="top-right"
              zIndex={1000}
              autoClose={10000}
            />

            <Suspense>
              <SearchParamsNotification />
            </Suspense>

            <Box bg={"gray.1"}>{children}</Box>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
