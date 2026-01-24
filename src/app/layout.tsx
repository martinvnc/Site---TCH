import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const garet = localFont({
  src: [
    {
      path: "./fonts/Garet-Book.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Garet-Book.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Garet-Book.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Garet-Heavy.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Garet-Heavy.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Garet-Heavy.woff",
      weight: "850",
      style: "normal",
    },
    {
      path: "./fonts/Garet-Heavy.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-garet",
});

export const metadata: Metadata = {
  title: "Tennis Club d'Halluin",
  description: "Site officiel du Tennis Club d'Halluin. Réservation de cours, école de tennis et actualités.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${garet.className} ${garet.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
