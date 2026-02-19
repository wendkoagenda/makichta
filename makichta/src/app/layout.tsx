import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/store/provider";
import { NextAuthSessionProvider } from "@/components/session-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ma Kichta",
  description: "Application de gestion des finances personnelles",
  icons: {
    icon: "/logo_mk-no-bg.png",
    apple: "/logo_mk-no-bg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <NextAuthSessionProvider>
          <StoreProvider>{children}</StoreProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
