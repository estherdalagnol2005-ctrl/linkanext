import type { Metadata } from "next";
import type { ReactNode } from "react";

import LenisProvider from "../components/linka/LenisProvider";

import "lenis/dist/lenis.css";
import "./globals.css";
import "./linka-site.css";
import "./unlock-stack.css";

export const metadata: Metadata = {
  title: "Linka Studio | Digital Experiences",
  description: "Linka creates websites, landing pages and digital experiences with presence, clarity and value.",
};

const preloaderFallbackScript = `
(() => {
  const DONE_EVENT = "linka:preloader:done";

  function releasePreloader() {
    const body = document.body;
    if (!body) return;

    body.classList.remove("linka-preload-lock");
    body.classList.add("linka-preloaded", "linka-preload-timeout");

    document.querySelectorAll(".linka-preloader").forEach((preloader) => {
      preloader.setAttribute("aria-hidden", "true");
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.style.pointerEvents = "none";
      preloader.style.display = "none";
    });

    window.__LINKA_PRELOADER_DONE__ = true;
    window.dispatchEvent(new Event(DONE_EVENT));

    if (window.__LINKA_PRELOADER_TIMEOUT_ID__) {
      window.clearTimeout(window.__LINKA_PRELOADER_TIMEOUT_ID__);
      window.__LINKA_PRELOADER_TIMEOUT_ID__ = undefined;
    }
  }

  window.__LINKA_PRELOADER_RELEASE__ = releasePreloader;
  window.__LINKA_PRELOADER_TIMEOUT_ID__ = window.setTimeout(releasePreloader, 8000);
})();
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="linka-preload-lock">
        <script dangerouslySetInnerHTML={{ __html: preloaderFallbackScript }} />
        <LenisProvider />
        {children}
      </body>
    </html>
  );
}
