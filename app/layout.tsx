import type { Metadata } from "next";
import type { ReactNode } from "react";

import LenisProvider from "../components/linka/LenisProvider";

import "lenis/dist/lenis.css";
import "./globals.css";
import "./linka-site.css";

export const metadata: Metadata = {
  title: "Linka Studio | Digital Experiences",
  description: "Linka creates websites, landing pages and digital experiences with presence, clarity and value.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#050609" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="linka-preload-lock">
        <LenisProvider />
        {children}
      </body>
    </html>
  );
}
